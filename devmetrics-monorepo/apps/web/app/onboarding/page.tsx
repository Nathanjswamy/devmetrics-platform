import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import { completeOnboarding } from "./actions";
import { ArrowRight, GitBranch, User } from "lucide-react";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Check if they already have all the info from Github
  const metadata = user.user_metadata || {};
  const isGithubOauth = user.app_metadata?.provider === 'github';
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)] py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-none mb-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <User size={20} className="text-text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2 uppercase tracking-widest">
            Welcome to DevMetrics
          </h1>
          <p className="text-sm text-text-muted">
            Let's complete your profile to unlock your engineering intelligence
          </p>
        </div>

        <div className="bauhaus-card p-8">
          <form className="space-y-6" action={completeOnboarding}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2">First Name</label>
                <input id="firstName" name="firstName" type="text" required defaultValue={metadata.first_name || metadata.full_name?.split(' ')[0] || ''} className="w-full px-4 py-3 text-sm rounded-none focus:outline-none" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} placeholder="Jane" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2">Last Name</label>
                <input id="lastName" name="lastName" type="text" required defaultValue={metadata.last_name || metadata.full_name?.split(' ').slice(1).join(' ') || ''} className="w-full px-4 py-3 text-sm rounded-none focus:outline-none" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} placeholder="Doe" />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2">Username</label>
              <input id="username" name="username" type="text" required defaultValue={metadata.username || metadata.preferred_username || ''} className="w-full px-4 py-3 text-sm rounded-none focus:outline-none" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }} placeholder="janedoe123" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="country" className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2">Country</label>
                <select id="country" name="country" required defaultValue={metadata.country || ''} className="w-full px-4 py-3 text-sm rounded-none focus:outline-none" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="IN">India</option>
                  <option value="AU">Australia</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="role" className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2">Role</label>
                <select id="role" name="role" required defaultValue={metadata.role || 'developer'} className="w-full px-4 py-3 text-sm rounded-none focus:outline-none" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                  <option value="developer">Developer</option>
                  <option value="manager">Engineering Manager</option>
                  <option value="cto">CTO / Executive</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {!isGithubOauth && (
              <div className="mt-8 p-6 rounded-none border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <GitBranch size={16} /> Connect GitHub
                </h3>
                <p className="text-xs text-text-muted mb-4">
                  DevMetrics requires a GitHub connection to analyze your commits and pull requests.
                </p>
                {/* Normally we'd put an OAuth button here, but they are already authenticated. They need to link an identity. */}
                <div className="text-xs text-yellow-500 mb-2">
                  Please complete the form below. You can link your GitHub account from the dashboard later.
                </div>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold uppercase tracking-widest text-[#F8F6F1] transition-transform hover:-translate-y-0.5"
                style={{ background: "#2B6B6D" }}
              >
                Complete Setup & Go To Dashboard <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
