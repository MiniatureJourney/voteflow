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
    .update({
      dob: parsed.data.dob,
      zip_code: parsed.data.zip_code,
    })
    .eq('id', user.id)

  if (profileError) throw profileError

  await supabase
    .from('settings')
    .update({ language: parsed.data.language })
    .eq('user_id', user.id)

  const { error: journeyError } = await supabase
    .from('election_journeys')
    .update({ current_step: 'eligibility' })
    .eq('user_id', user.id)

  if (journeyError) throw journeyError

  revalidatePath('/dashboard')
  return { success: true, regionCode }
}
