import { login, signup } from "./actions";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)]">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-none mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <Lock size={20} className="text-text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2 uppercase tracking-widest">
            DevMetrics
          </h1>
          <p className="text-sm text-text-muted">
            Sign in to access your engineering intelligence
          </p>
        </div>

        {/* Form Container */}
        <div className="bauhaus-card p-8">
          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 text-sm rounded-none focus:outline-none transition-colors"
                style={{ 
                  background: "var(--surface-2)", 
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)"
                }}
                placeholder="you@company.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 text-sm rounded-none focus:outline-none transition-colors"
                style={{ 
                  background: "var(--surface-2)", 
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)"
                }}
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                formAction={login}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold uppercase tracking-widest text-[#F8F6F1] transition-transform hover:-translate-y-0.5"
                style={{ background: "#2B6B6D" }} // Teal
              >
                Sign In <ArrowRight size={14} strokeWidth={3} />
              </button>
              
              <button
                formAction={signup}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center text-xs text-text-muted">
          By signing in, you agree to our Terms of Service.
        </div>
      </div>
    </div>
  );
}
