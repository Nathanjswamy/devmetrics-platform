import type { Metadata } from "next";
import "../globals.css";
import { Providers } from "../components/Providers";

export const metadata: Metadata = {
  title: "DevMetrics Onboarding",
  description: "Complete your developer profile.",
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
