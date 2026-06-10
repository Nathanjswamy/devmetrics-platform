import { signup, signInWithGithub } from "../actions";
import Link from "next/link";
import { GitBranch, Sparkles } from "lucide-react";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {
  return (
    <div className="w-full">
      {/* Mobile-only Header */}
      <div className="md:hidden flex items-center justify-center gap-2 mb-8">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-text-primary">
          <Sparkles size={16} className="text-surface" />
        </div>
        <span className="text-xl font-serif font-bold tracking-tight">DevMetrics</span>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">Create an account</h2>
        <p className="text-sm text-text-secondary">
          Join DevMetrics and discover your Developer DNA
        </p>
      </div>

      {searchParams?.message && (
        <div className="p-3 mb-6 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded">
          {searchParams.message}
        </div>
      )}

      {searchParams?.error && (
        <div className="p-3 mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded">
          {searchParams.error}
        </div>
      )}

      <form className="space-y-4">
        {/* Primary Action */}
        <button
          formAction={signInWithGithub}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-medium text-white transition-colors bg-[#24292e] hover:bg-[#1b1f23] rounded-md border border-transparent shadow-sm"
        >
          <GitBranch size={16} /> Continue with GitHub
        </button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-text-muted">or register with email</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-1.5">First Name</label>
            <input id="firstName" name="firstName" type="text" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-text-primary transition-shadow bg-surface border border-border text-text-primary" placeholder="Jane" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-1.5">Last Name</label>
            <input id="lastName" name="lastName" type="text" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-text-primary transition-shadow bg-surface border border-border text-text-primary" placeholder="Doe" />
          </div>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-1.5">Username</label>
          <input id="username" name="username" type="text" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-text-primary transition-shadow bg-surface border border-border text-text-primary" placeholder="janedoe" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">Email Address</label>
          <input id="email" name="email" type="email" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-text-primary transition-shadow bg-surface border border-border text-text-primary" placeholder="you@company.com" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-text-primary transition-shadow bg-surface border border-border text-text-primary" placeholder="••••••••" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1.5">Confirm</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-text-primary transition-shadow bg-surface border border-border text-text-primary" placeholder="••••••••" />
          </div>
        </div>

        <button
          formAction={signup}
          className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-surface transition-colors bg-text-primary hover:bg-text-primary/90 rounded-md shadow-sm mt-6"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
      
      <div className="mt-12 text-center flex items-center justify-center gap-4 text-xs text-text-muted">
        <Link href="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link>
        <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
      </div>
    </div>
  );
}
