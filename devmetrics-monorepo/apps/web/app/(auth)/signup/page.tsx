"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GitBranch, Sparkles } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";
import { BrandLogo } from "../../components/BrandLogo";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="w-full pb-8">
      {/* Mobile-only Header */}
      <div className="lg:hidden flex items-center justify-center mb-8 mt-4">
        <BrandLogo href="/" size="md" />
      </div>

      <div className="mb-6 mt-4 lg:mt-0">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Create your Account</h2>
        <p className="text-sm text-gray-500">
          Join engineers improving their craft with DevMetrics.
        </p>
      </div>

      {message && (
        <div className="p-3 mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Primary Action - GitHub */}
        <button
          type="button"
          onClick={handleGithubSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-medium text-gray-700 transition-colors bg-white hover:bg-gray-50 rounded-md border border-gray-300 shadow-sm disabled:opacity-50"
        >
          <GitBranch size={16} /> Sign up with GitHub
        </button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-400 uppercase font-semibold tracking-wider">or register with email</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
            <input id="firstName" name="firstName" type="text" required disabled={isLoading} className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 disabled:opacity-50" placeholder="Jane" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
            <input id="lastName" name="lastName" type="text" required disabled={isLoading} className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 disabled:opacity-50" placeholder="Doe" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input id="email" name="email" type="email" required disabled={isLoading} className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 disabled:opacity-50" placeholder="you@company.com" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700 mb-1.5">GitHub Username</label>
            <input id="githubUsername" name="githubUsername" type="text" required disabled={isLoading} className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 disabled:opacity-50" placeholder="janedoe" />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">Company <span className="text-gray-400 font-normal">(optional)</span></label>
            <input id="company" name="company" type="text" disabled={isLoading} className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 disabled:opacity-50" placeholder="Acme Inc" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input id="password" name="password" type="password" required disabled={isLoading} className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 disabled:opacity-50" placeholder="••••••••" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required disabled={isLoading} className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 disabled:opacity-50" placeholder="••••••••" />
          </div>
        </div>

        <div className="flex items-start mt-4 mb-6">
          <div className="flex items-center h-5">
            <input id="terms" name="terms" type="checkbox" required disabled={isLoading} className="w-4 h-4 text-[#060c18] bg-gray-50 border-gray-300 rounded focus:ring-[#060c18] disabled:opacity-50" />
          </div>
          <label htmlFor="terms" className="ml-2 text-xs text-gray-500">
            By continuing, you agree to our <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-white transition-colors bg-[#060c18] hover:bg-[#060c18]/90 rounded-md shadow-sm disabled:opacity-50"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="w-full flex justify-center py-8">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
