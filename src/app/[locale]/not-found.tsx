import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | TenderX Nepal",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#070b14] text-white">
      <div className="max-w-md space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#72f5bc] font-semibold">
          Error 404
        </span>
        <h1 className="text-3xl font-bold text-slate-100">
          Page not found
        </h1>
        <p className="text-sm text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#72f5bc] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
