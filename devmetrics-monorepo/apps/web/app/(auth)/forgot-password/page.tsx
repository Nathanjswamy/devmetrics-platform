import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
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
        <Link href="/login" className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors mb-4">
          <ArrowLeft size={12} /> Back to login
        </Link>
        <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">Reset your password</h2>
        <p className="text-sm text-text-secondary">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-text-primary transition-shadow bg-surface border border-border text-text-primary"
            placeholder="you@company.com"
          />
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-surface transition-colors bg-text-primary hover:bg-text-primary/90 rounded-md shadow-sm mt-4"
        >
          Send Reset Link
        </button>
      </form>
      
      <div className="mt-12 text-center flex items-center justify-center gap-4 text-xs text-text-muted">
        <Link href="/terms" className="hover:text-text-primary transition-colors">Terms of Service</Link>
        <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
      </div>
    </div>
  );
}
