import { TopNav } from "../../components/TopNav";

export default function CookiesPage() {
  return (
    <div className="flex-1 w-full bg-background min-h-screen">
      <TopNav title="Cookie Policy" />
      <div className="p-8 max-w-3xl mx-auto mt-8">
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-6">Cookie Policy</h1>
        <div className="prose prose-sm prose-invert text-text-secondary">
          <p className="mb-4">Last updated: June 10, 2026</p>
          <p className="mb-4">
            DevMetrics uses cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
          </p>
          <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">How We Use Cookies</h2>
          <p className="mb-4">
            We use both Session and Persistent Cookies for the purposes set out below:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Necessary / Essential Cookies</strong>: These Cookies are essential to provide you with services available through the Website and to enable you to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts.</li>
            <li><strong>Cookies Policy / Notice Acceptance Cookies</strong>: These Cookies identify if users have accepted the use of cookies on the Website.</li>
            <li><strong>Functionality Cookies</strong>: These Cookies allow us to remember choices you make when you use the Website, such as remembering your login details or language preference.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
