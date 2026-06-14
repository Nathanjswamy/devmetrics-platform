"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GitBranch, Eye, EyeOff } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(searchParams?.get("error") || null);
  const [message, setMessage] = useState<string | null>(searchParams?.get("message") || null);

  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const githubUsername = formData.get("githubUsername") as string;
    const company = formData.get("company") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000');

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${redirectUrl}/api/auth/confirm`,
        data: {
          first_name: firstName,
          last_name: lastName,
          github_username: githubUsername,
          company: company,
        }
      }
    });

    if (signUpError) {
      setError("Could not create user: " + signUpError.message);
      setIsLoading(false);
    } else {
      router.push("/login?message=Check your email to continue sign in process");
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

  // Shared input styles
  const inputClass = "w-full px-5 py-3.5 text-sm rounded-full outline-none transition-all duration-200 disabled:opacity-50";
  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e0e0e0',
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
  };

  return (
    <div className="w-full flex flex-col items-center pb-8">
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
        Create account
      </h2>
      
      <p className="text-sm mb-10" style={{ color: '#777' }}>
        or{" "}
        <Link href="/login" className="underline underline-offset-2 transition-colors hover:text-white" style={{ color: '#999' }}>
          sign in to existing account
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
        <GitBranch size={16} /> Sign up with GitHub
      </button>

      {/* Divider */}
      <div className="relative w-full my-2 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 uppercase font-medium tracking-wider" style={{ background: '#141414', color: '#555' }}>
            or register with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp} className="w-full space-y-3.5">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            disabled={isLoading}
            className={inputClass}
            placeholder="First name"
            style={inputStyle}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            disabled={isLoading}
            className={inputClass}
            placeholder="Last name"
            style={inputStyle}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>

        {/* Email */}
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={isLoading}
          className={inputClass}
          placeholder="Email address"
          style={inputStyle}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />

        {/* GitHub & Company row */}
        <div className="grid grid-cols-2 gap-3">
          <input
            id="githubUsername"
            name="githubUsername"
            type="text"
            required
            disabled={isLoading}
            className={inputClass}
            placeholder="GitHub username"
            style={inputStyle}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <input
            id="company"
            name="company"
            type="text"
            disabled={isLoading}
            className={inputClass}
            placeholder="Company (opt.)"
            style={inputStyle}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            disabled={isLoading}
            className={`${inputClass} pr-12`}
            placeholder="Password"
            style={inputStyle}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
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

        {/* Confirm Password */}
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            disabled={isLoading}
            className={`${inputClass} pr-12`}
            placeholder="Confirm password"
            style={inputStyle}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: '#555' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#999'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#555'; }}
            tabIndex={-1}
          >
            {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start pt-2 pb-1">
          <div className="flex items-center h-5">
            <input 
              id="terms" 
              name="terms" 
              type="checkbox" 
              required 
              disabled={isLoading} 
              className="w-4 h-4 rounded disabled:opacity-50 cursor-pointer"
              style={{ 
                accentColor: '#fff',
                background: 'rgba(255,255,255,0.06)',
                borderColor: 'rgba(255,255,255,0.15)',
              }}
            />
          </div>
          <label htmlFor="terms" className="ml-2.5 text-xs leading-relaxed" style={{ color: '#777' }}>
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-white transition-colors" style={{ color: '#999' }}>Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-white transition-colors" style={{ color: '#999' }}>Privacy Policy</Link>.
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 text-sm font-semibold transition-all duration-200 rounded-full mt-1 disabled:opacity-50"
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
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="w-full flex justify-center py-8" style={{ color: '#555' }}>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
