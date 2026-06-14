import { resetPassword } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { message: string; error: string };
}) {
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
        Reset password
      </h2>
      
      <p className="text-sm mb-2 text-center" style={{ color: '#777' }}>
        Enter your email and we'll send you a reset link.
      </p>
      
      <Link 
        href="/login" 
        className="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-white mb-10" 
        style={{ color: '#999' }}
      >
        <ArrowLeft size={12} /> Back to sign in
      </Link>

      {/* Messages */}
      {searchParams?.message && (
        <div className="w-full p-3 mb-5 text-sm rounded-lg" style={{ 
          background: 'rgba(21, 132, 110, 0.1)', 
          border: '1px solid rgba(21, 132, 110, 0.25)',
          color: '#4db89e' 
        }}>
          {searchParams.message}
        </div>
      )}

      {searchParams?.error && (
        <div className="w-full p-3 mb-5 text-sm rounded-lg" style={{ 
          background: 'rgba(255, 77, 106, 0.1)', 
          border: '1px solid rgba(255, 77, 106, 0.25)',
          color: '#ff8099' 
        }}>
          {searchParams.error}
        </div>
      )}

      {/* Form */}
      <form className="w-full space-y-4">
        <div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-5 py-3.5 text-sm rounded-full outline-none transition-all duration-200"
            placeholder="Email address"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e0e0e0',
            }}
          />
        </div>

        <button
          formAction={resetPassword}
          className="w-full py-3.5 px-4 text-sm font-semibold transition-all duration-200 rounded-full mt-2"
          style={{
            background: '#ffffff',
            color: '#111111',
          }}
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
