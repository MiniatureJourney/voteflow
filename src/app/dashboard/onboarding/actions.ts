'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ConstituencyMapper } from '@/lib/engines/ConstituencyMapper'
import { GoogleGenerativeAI } from '@google/generative-ai'

const onboardingSchema = z.object({
  dob: z.string(),
  zip_code: z.string(),
  citizenship: z.boolean(),
  language: z.string(),
})

export async function submitOnboarding(data: z.infer<typeof onboardingSchema>) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const parsed = onboardingSchema.safeParse(data)
  if (!parsed.success) throw new Error("Validation failed")

  const regionCode = await ConstituencyMapper.mapZipCodeToRegion(parsed.data.zip_code)

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      dob: parsed.data.dob,
      zip_code: parsed.data.zip_code,
    })

  if (profileError) throw profileError

  await supabase
    .from('settings')
    .upsert({ 
      user_id: user.id,
      language: parsed.data.language 
    })

  const { error: journeyError } = await supabase
    .from('election_journeys')
    .upsert({ 
      user_id: user.id,
      current_step: 'eligibility' 
    })

  if (journeyError) throw journeyError;

  revalidatePath('/dashboard');
  return { success: true, regionCode };
}

export async function getRealtimeInsights(query: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return ["GEMINI_API_KEY missing."];
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: [{ googleSearch: {} }] as any
    });
    
    const prompt = `You are a factual, real-time civic AI news assistant. 
Using Google Search grounding, identify the most recent breaking local news headlines, candidate profiles, and important administrative timelines regarding elections in: "${query}". 
Extract exactly 3 distinct local election insights or news briefs. 
If there are absolutely no active or scheduled upcoming elections or election news at this place, state: "There are currently no active or upcoming elections scheduled for this location."
Format your output strictly as separate independent news headlines, omitting excess introductory text.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return text.split('\n\n').map(t => t.trim()).filter(t => t.length > 0);
  } catch (e) {
    console.error("Insights AI error:", e);
    return ["Unable to stream active local model updates."];
  }
}

export async function getRealtimeDeadlines(query: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { hasElections: false, reminders: [], nextElectionYear: null, noElectionMessage: "API Key missing." };
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: [{ googleSearch: {} }] as any
    });
    
    const today = new Date().toISOString().split('T')[0];
    const prompt = `You are a civic AI providing election deadlines. Today's date is ${today}.
Find the upcoming election deadlines for the location: "${query}".
If there are upcoming elections, output a JSON object with:
{
  "hasElections": true,
  "reminders": [
    { "message": "Event Name", "daysRemaining": number (calculated based on today), "type": "CRITICAL" | "WARNING" | "INFO" }
  ]
}
If there are NO upcoming elections, determine the year of the next major election for this area and output:
{
  "hasElections": false,
  "nextElectionYear": 2029,
  "reminders": []
}
Output ONLY valid JSON. Do not include markdown blocks like \`\`\`json.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (text.startsWith('\`\`\`')) {
      text = text.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }
    
    return JSON.parse(text);
  } catch (e) {
    console.error("Deadlines AI error:", e);
    return { hasElections: false, reminders: [], nextElectionYear: null, noElectionMessage: "Unable to stream real-time deadlines." };
  }
}
