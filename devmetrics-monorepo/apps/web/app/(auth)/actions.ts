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
    redirect("/login?error=Could not authenticate user: " + error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000');

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: `${redirectUrl}/api/auth/confirm`,
      data: {
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        github_username: formData.get("githubUsername") as string,
        company: formData.get("company") as string,
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
  const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${redirectUrl}/api/auth/callback`,
    },
  });

  if (error) {
    redirect("/login?error=Could not authenticate with GitHub: " + error.message);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000');

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectUrl}/api/auth/confirm`,
  });

  if (error) {
    redirect("/forgot-password?error=Could not send reset link: " + error.message);
  }

  redirect("/forgot-password?message=Password reset link has been sent to your email.");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    redirect("/update-password?error=Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    redirect("/update-password?error=Could not update password: " + error.message);
  }

  redirect("/login?message=Password updated successfully. Please sign in.");
}
