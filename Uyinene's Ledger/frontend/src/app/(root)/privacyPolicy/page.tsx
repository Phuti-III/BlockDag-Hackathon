"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
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

        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          At <strong>Uyinene's Ledger</strong>, we value your privacy and are committed to protecting your personal information in accordance with the <strong>POPIA (Protection of Personal Information Act, South Africa)</strong>.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Information Collection</h2>
        <p className="mb-4">
          We collect personal information such as name, email, and account activity to provide our services. Sensitive information stored in the platform (digital evidence) is encrypted and only accessible by the account owner.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Purpose of Processing</h2>
        <p className="mb-4">
          Personal data is used solely to manage your account, enable secure storage of evidence, and improve user experience. We do not share your information with third parties without consent, except as required by law.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Security Measures</h2>
        <p className="mb-4">
          We implement administrative, technical, and physical safeguards to protect personal information from unauthorized access, loss, or disclosure.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. User Rights</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Access your personal information</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your personal information</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Data Retention</h2>
        <p className="mb-4">
          Personal information will only be retained for as long as necessary to fulfill the purpose it was collected or as required by law.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Contact Us</h2>
        <p className="mb-4">
          For any questions about your personal information or this Privacy Policy, contact us at <a href="mailto:jonithandolwethu05@gmail.com" className="underline hover:text-blue-600">jonithandolwethu05@gmail.com</a>.
        </p>

        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/terms" className="underline hover:text-blue-600">
            Back to Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
