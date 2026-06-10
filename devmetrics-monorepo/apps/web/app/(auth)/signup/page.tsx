import { signup, signInWithGithub } from "../actions";
import Link from "next/link";
import { GitBranch, Sparkles } from "lucide-react";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {
  return (
    <div className="w-full pb-8">
      {/* Mobile-only Header */}
      <div className="lg:hidden flex items-center justify-center gap-2 mb-8 mt-4">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-[#060c18]">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="text-xl font-serif font-bold tracking-tight text-gray-900">DevMetrics</span>
      </div>

      <div className="mb-6 mt-4 lg:mt-0">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Create your Account</h2>
        <p className="text-sm text-gray-500">
          Join engineers improving their craft with DevMetrics.
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
            <input id="firstName" name="firstName" type="text" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400" placeholder="Jane" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
            <input id="lastName" name="lastName" type="text" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400" placeholder="Doe" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <input id="email" name="email" type="email" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400" placeholder="you@company.com" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700 mb-1.5">GitHub Username</label>
            <input id="githubUsername" name="githubUsername" type="text" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400" placeholder="janedoe" />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">Company <span className="text-gray-400 font-normal">(optional)</span></label>
            <input id="company" name="company" type="text" className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400" placeholder="Acme Inc" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400" placeholder="••••••••" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400" placeholder="••••••••" />
          </div>
        </div>

        <div className="flex items-start mt-4 mb-6">
          <div className="flex items-center h-5">
            <input id="terms" name="terms" type="checkbox" required className="w-4 h-4 text-[#060c18] bg-gray-50 border-gray-300 rounded focus:ring-[#060c18]" />
          </div>
          <label htmlFor="terms" className="ml-2 text-xs text-gray-500">
            By continuing, you agree to our <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </label>
        </div>

        <button
          formAction={signup}
          className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-white transition-colors bg-[#060c18] hover:bg-[#060c18]/90 rounded-md shadow-sm"
        >
          Create Account
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
