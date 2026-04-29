-- Seed Data for VoteFlow

-- 1. Election Rules (Regions)
INSERT INTO election_rules (region_code, min_age, requires_photo_id, allows_mail_in, registration_url) VALUES
('US-NY', 18, false, true, 'https://voterreg.dmv.ny.gov/MotorVoter/'),
('US-CA', 18, false, true, 'https://registertovote.ca.gov/'),
('US-TX', 18, true, false, 'https://www.votetexas.gov/register-to-vote/');

-- 2. Constituencies (Districts)
INSERT INTO constituencies (region_code, district_name) VALUES
('US-NY', 'NY-01 Congressional District'),
('US-NY', 'NY-14 Congressional District'),
('US-CA', 'CA-12 Congressional District'),
('US-CA', 'CA-33 Congressional District'),
('US-TX', 'TX-02 Congressional District'),
('US-TX', 'TX-10 Congressional District');

-- 3. Deadlines (Mock 2026 Midterms for example)
INSERT INTO deadlines (region_code, election_date, voter_reg_deadline, mail_in_request_deadline, mail_in_return_deadline) VALUES
('US-NY', '2026-11-03', '2026-10-24', '2026-10-24', '2026-11-03'),
('US-CA', '2026-11-03', '2026-10-19', '2026-10-27', '2026-11-03'),
('US-TX', '2026-11-03', '2026-10-05', '2026-10-23', '2026-11-03');
