import { updatePassword } from "../actions";
import { Sparkles } from "lucide-react";

export default function UpdatePasswordPage({
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
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Update Password</h2>
        <p className="text-sm text-gray-500">
          Enter your new password below.
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#060c18]/20 transition-shadow bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400"
            placeholder="••••••••"
          />
        </div>

        <button
          formAction={updatePassword}
          className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-white transition-colors bg-[#060c18] hover:bg-[#060c18]/90 rounded-md shadow-sm mt-6"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
