"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const updates = {
    first_name: formData.get("firstName") as string,
    last_name: formData.get("lastName") as string,
    username: formData.get("username") as string,
    country: formData.get("country") as string,
    role: formData.get("role") as string,
    onboarding_complete: true,
  };

  // Update user metadata in Supabase
  const { error: updateError } = await supabase.auth.updateUser({
    data: updates
  });

  if (updateError) {
    // In a real app we'd handle this better without throwing an unhandled exception or plain redirect
    console.error("Failed to update user", updateError);
  }

  // Ideally, here we also ping the API to sync this user to Prisma DB 
  // e.g., fetch(`.../api/v1/auth/sync`, { method: 'POST', body: ... })
  // For now, redirecting to the dashboard

  redirect("/dashboard");
}
