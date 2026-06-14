import type { Metadata } from "next";
import "../globals.css";
import { Providers } from "../components/Providers";

export const metadata: Metadata = {
  title: "DevMetrics — Engineering Intelligence Platform",
  description: "Transform commits, pull requests, code reviews, and deployments into actionable engineering intelligence. Know your Developer DNA.",
  openGraph: {
    title: "DevMetrics — Engineering Intelligence Platform",
    description: "Transform commits, pull requests, code reviews, and deployments into actionable engineering intelligence.",
    images: [{ url: "/logo-full.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevMetrics — Engineering Intelligence Platform",
    description: "Transform commits, pull requests, code reviews, and deployments into actionable engineering intelligence.",
    images: ["/logo-full.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ background: '#0a0a0a', color: '#e0e0e0', margin: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
