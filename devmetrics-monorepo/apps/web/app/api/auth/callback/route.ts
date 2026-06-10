import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // URL to redirect to after sign in process completes
  // In production, we should redirect to onboarding or dashboard
  let redirectUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/onboarding`
    : `${origin}/onboarding`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Create user in the database if it doesn't exist.
      // But we will do that inside the /onboarding page check or API layer.
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not verify the authentication code.`);
}
