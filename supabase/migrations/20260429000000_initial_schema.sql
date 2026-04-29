-- Initial Schema for VoteFlow

-- Extension for UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  dob DATE,
  zip_code TEXT,
  constituency_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Election Rules
CREATE TABLE election_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  region_code TEXT UNIQUE NOT NULL,
  min_age INTEGER NOT NULL DEFAULT 18,
  requires_photo_id BOOLEAN NOT NULL DEFAULT true,
  allows_mail_in BOOLEAN NOT NULL DEFAULT true,
  registration_url TEXT
);

-- 3. Constituencies
CREATE TABLE constituencies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  region_code TEXT REFERENCES election_rules(region_code) ON DELETE CASCADE NOT NULL,
  district_name TEXT NOT NULL
);

-- Update profiles with foreign key
ALTER TABLE profiles ADD CONSTRAINT fk_constituency FOREIGN KEY (constituency_id) REFERENCES constituencies(id) ON DELETE SET NULL;

-- 4. Election Journeys
CREATE TABLE election_journeys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_step TEXT NOT NULL DEFAULT 'onboarding',
  is_eligible BOOLEAN,
  is_registered BOOLEAN,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Deadlines
CREATE TABLE deadlines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  region_code TEXT REFERENCES election_rules(region_code) ON DELETE CASCADE NOT NULL,
  election_date DATE NOT NULL,
  voter_reg_deadline DATE,
  mail_in_request_deadline DATE,
  mail_in_return_deadline DATE
);

-- 6. Documents (Checklist)
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doc_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'missing',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, doc_type)
);

-- 7. Voter Status Logs
CREATE TABLE voter_status_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  previous_step TEXT,
  new_step TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Notifications
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Settings
CREATE TABLE settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  push_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'en',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE voter_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE election_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE constituencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Private Tables
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own journey" ON election_journeys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own journey" ON election_journeys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journey" ON election_journeys FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own documents" ON documents FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own logs" ON voter_status_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON voter_status_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own settings" ON settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Public Tables
CREATE POLICY "Anyone can view election rules" ON election_rules FOR SELECT USING (true);
CREATE POLICY "Anyone can view constituencies" ON constituencies FOR SELECT USING (true);
CREATE POLICY "Anyone can view deadlines" ON deadlines FOR SELECT USING (true);

-- Functions and Triggers for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER journeys_updated_at BEFORE UPDATE ON election_journeys FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- Trigger to create profile and settings on user signup
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  
  INSERT INTO public.settings (user_id)
  VALUES (new.id);
  
  INSERT INTO public.election_journeys (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
