import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import LandingContent from "./LandingContent";

export default async function MarketingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LandingContent />;
}
