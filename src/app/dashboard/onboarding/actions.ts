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
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCdqwhR36TChH4jWESU9PTNIf9rd0cGPEg";
  if (!apiKey) return ["GEMINI_API_KEY missing."];
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro", 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: [{ googleSearch: {} }] as any
    });
    
    const prompt = `You are a factual, real-time civic AI assistant. 
Provide highly detailed, current election insights (active/upcoming measures, candidates, voting guidelines) for this specific request: "${query}". 
If there are absolutely no active or scheduled upcoming elections at this place, reply: "There are currently no active or upcoming elections scheduled for this location."
Provide the output as a series of short independent paragraphs without heavy markdown styling.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return text.split('\n\n').map(t => t.trim()).filter(t => t.length > 0);
  } catch (e) {
    console.error("Insights AI error:", e);
    return ["Unable to stream active local model updates."];
  }
}
