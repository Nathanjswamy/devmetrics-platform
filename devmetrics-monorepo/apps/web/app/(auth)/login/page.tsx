import { login, signInWithGithub } from "../actions";
import Link from "next/link";
import { GitBranch, Sparkles } from "lucide-react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {
  return (
    <div className="w-full">
      {/* Mobile-only Header */}
      <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-[#060c18]">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="text-xl font-serif font-bold tracking-tight text-gray-900">DevMetrics</span>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Sign In</h2>
        <p className="text-sm text-gray-500">
          Welcome back to DevMetrics
        </p>
      </div>

      {searchParams?.message && (
        <div className="p-3 mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded">
          {searchParams.message}
        </div>
      )}

      {searchParams?.error && (
        <div className="p-3 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
          {searchParams.error}
        </div>
      )}

      <form className="space-y-4">
        {/* Primary Action - GitHub */}
        <button
          formAction={signInWithGithub}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-medium text-gray-700 transition-colors bg-white hover:bg-gray-50 rounded-md border border-gray-300 shadow-sm"
        >
          <GitBranch size={16} /> Continue with GitHub
        </button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-400 uppercase font-semibold tracking-wider">or sign in with email</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400"
              placeholder="you@company.com"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 transition-colors font-medium">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          formAction={login}
          className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-white transition-colors bg-[#060c18] hover:bg-[#060c18]/90 rounded-md shadow-sm mt-6"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
      
      <div className="mt-12 text-center flex items-center justify-center gap-4 text-xs text-gray-400">
        <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
        <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
        <Link href="/cookies" className="hover:text-gray-600 transition-colors">Cookies</Link>
      </div>
    </div>
  );
}
