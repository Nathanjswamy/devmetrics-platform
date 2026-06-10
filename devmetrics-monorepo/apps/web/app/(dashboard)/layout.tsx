import type { Metadata } from "next";
import "../globals.css";
import { Sidebar } from "../components/Sidebar";
import { Providers } from "../components/Providers";
import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "DevMetrics — AI-Powered Engineering Intelligence",
  description:
    "Transform engineering activity into actionable workflow intelligence. DORA metrics, AI insights, code review analytics, and team performance in one platform.",
  keywords: ["engineering metrics", "DORA metrics", "developer productivity", "AI insights", "code review analytics"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const isSetup = user.user_metadata?.onboarding_complete;
  if (!isSetup) {
    redirect("/onboarding");
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-text-primary antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-60 flex flex-col min-h-screen">
            <Providers>{children}</Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
