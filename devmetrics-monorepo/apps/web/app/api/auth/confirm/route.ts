import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Using the request URL origin if env var isn't set
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : request.nextUrl.origin)

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      // Redirect user to specified redirect URL or root of app
      // If the type is recovery, we might want to redirect them to a password update page
      if (type === 'recovery') {
        return NextResponse.redirect(`${baseUrl}/update-password?message=Please update your password`)
      }
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // Redirect to error page if token is invalid or expired
  return NextResponse.redirect(`${baseUrl}/login?error=Authentication link is invalid or expired`)
}
