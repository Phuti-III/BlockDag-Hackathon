"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TermsOfService() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <p className="mb-4">
          Welcome to <strong>Uyinene's Ledger</strong>. By using our platform, you agree to abide by these terms and all applicable laws.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By creating an account or using our services, you confirm that you have read, understood, and agree to these terms.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Account Responsibility</h2>
        <p className="mb-4">
          You are responsible for safeguarding your account information, including your password. Unauthorized use must be reported immediately.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Use of Platform</h2>
        <p className="mb-4">
          The platform is designed for securely storing and managing digital evidence. Any misuse, including harassment, unlawful activities, or distribution of false information, is strictly prohibited.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Limitation of Liability</h2>
        <p className="mb-4">
          Uyinene's Ledger is not liable for loss of data, technical issues, or unauthorized access. Users must maintain their own backups.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Amendments</h2>
        <p className="mb-4">
          We reserve the right to update these terms at any time. Users will be notified of significant changes via the platform.
        </p>

        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="underline hover:text-blue-600">
            View our Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
