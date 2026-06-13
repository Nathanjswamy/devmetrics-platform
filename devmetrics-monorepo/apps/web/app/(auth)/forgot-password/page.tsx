import { resetPassword } from "../actions";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage({
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
        <span className="text-xl font-sans font-bold tracking-tight text-gray-900">DevMetrics</span>
      </div>

      <div className="mb-8">
        <Link href="/login" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors mb-4 font-medium">
          <ArrowLeft size={12} /> Back to login
        </Link>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Reset Password</h2>
        <p className="text-sm text-gray-500">
          Enter your email address and we'll send you a link to reset your password.
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

        <button
          formAction={resetPassword}
          className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-white transition-colors bg-[#060c18] hover:bg-[#060c18]/90 rounded-md shadow-sm mt-6"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
