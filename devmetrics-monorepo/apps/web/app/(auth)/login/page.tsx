"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GitBranch, Eye, EyeOff } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(searchParams?.get("error") || null);
  const [message, setMessage] = useState<string | null>(searchParams?.get("message") || null);

  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Could not authenticate user: " + signInError.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000');

    const { error: githubError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${redirectUrl}/api/auth/callback`,
      },
    });

    if (githubError) {
      setError("Could not authenticate with GitHub: " + githubError.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Dot pattern logo */}
      <div className="mb-8 flex justify-center">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="3" fill="white" />
          <circle cx="28" cy="8" r="3" fill="white" />
          <circle cx="8" cy="20" r="3" fill="white" />
          <circle cx="20" cy="20" r="3" fill="white" />
          <circle cx="32" cy="20" r="3" fill="white" />
          <circle cx="12" cy="32" r="3" fill="white" />
          <circle cx="28" cy="32" r="3" fill="white" />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-light tracking-tight mb-3" style={{ color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif' }}>
        Sign in
      </h2>
      
      <p className="text-sm mb-10" style={{ color: '#777' }}>
        or{" "}
        <Link href="/signup" className="underline underline-offset-2 transition-colors hover:text-white" style={{ color: '#999' }}>
          create an account
        </Link>
      </p>

      {/* Messages */}
      {message && (
        <div className="w-full p-3 mb-5 text-sm rounded-lg" style={{ 
          background: 'rgba(21, 132, 110, 0.1)', 
          border: '1px solid rgba(21, 132, 110, 0.25)',
          color: '#4db89e' 
        }}>
          {message}
        </div>
      )}

      {error && (
        <div className="w-full p-3 mb-5 text-sm rounded-lg" style={{ 
          background: 'rgba(255, 77, 106, 0.1)', 
          border: '1px solid rgba(255, 77, 106, 0.25)',
          color: '#ff8099' 
        }}>
          {error}
        </div>
      )}

      {/* GitHub button */}
      <button
        type="button"
        onClick={handleGithubSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 text-sm font-medium transition-all duration-200 rounded-full mb-6 disabled:opacity-50"
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#ccc',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.color = '#ccc';
        }}
      >
        <GitBranch size={16} /> Continue with GitHub
      </button>

      {/* Divider */}
      <div className="relative w-full my-2 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 uppercase font-medium tracking-wider" style={{ background: '#141414', color: '#555' }}>
            or
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSignIn} className="w-full space-y-4">
        <div>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isLoading}
            className="w-full px-5 py-3.5 text-sm rounded-full outline-none transition-all duration-200 disabled:opacity-50"
            placeholder="Email or username"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e0e0e0',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
          />
        </div>
        
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            disabled={isLoading}
            className="w-full px-5 py-3.5 pr-12 text-sm rounded-full outline-none transition-all duration-200 disabled:opacity-50"
            placeholder="Password"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e0e0e0',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: '#555' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#999'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#555'; }}
            tabIndex={-1}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 text-sm font-semibold transition-all duration-200 rounded-full mt-2 disabled:opacity-50"
          style={{
            background: '#ffffff',
            color: '#111111',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e8e8e8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
          }}
        >
          {isLoading ? "Signing In..." : "Enter"}
        </button>
      </form>

      {/* Forgot password */}
      <div className="mt-6 text-center">
        <Link 
          href="/forgot-password" 
          className="text-sm transition-colors hover:text-white"
          style={{ color: '#666' }}
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full flex justify-center py-8" style={{ color: '#555' }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
