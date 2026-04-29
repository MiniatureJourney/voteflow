'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ConstituencyMapper } from '@/lib/engines/ConstituencyMapper'

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

  if (journeyError) throw journeyError

  revalidatePath('/dashboard')
  return { success: true, regionCode }
}
