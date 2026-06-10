"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/login?error=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Redirect to callback route to handle setting up user session
  const redirectUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/auth/callback`
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback`;

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        username: formData.get("username") as string,
        country: formData.get("country") as string,
        role: formData.get("role") as string,
      }
    }
  });

  if (error) {
    redirect("/signup?error=Could not create user: " + error.message);
  }

  redirect("/login?message=Check your email to continue sign in process");
}

export async function signInWithGithub() {
  const supabase = await createClient();
  const redirectUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/auth/callback`
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    redirect("/login?error=Could not authenticate with GitHub");
  }

  if (data.url) {
    redirect(data.url);
  }
}
