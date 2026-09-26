import React from 'react';
import { Link } from '../../context/RouterContext';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Link to="/" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Effective Date: January 1, 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            When registering an account or completing an order on BACKLOG SAVER, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name and Email Address (for digital delivery and account verification)</li>
            <li>Telephone number (optional, for payment status notifications)</li>
            <li>Order history, purchased items, and download verification records</li>
            <li>Technical metadata (browser user-agent, IP hash for download token security)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. How We Use Your Information</h2>
          <p>
            Your information is used strictly to fulfill digital PDF study note delivery, maintain lifetime access under "My Purchases", verify payments via Razorpay, and provide customer support.
          </p>
          <p>We do not sell, rent, or trade your personal information to third parties.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Payment Security</h2>
          <p>
            All financial transactions are handled directly by Razorpay's PCI-DSS compliant checkout architecture. BACKLOG SAVER never captures, stores, or accesses your bank passwords, CVVs, or UPI credentials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Advertising & Cookies (Google AdSense)</h2>
          <p>
            BACKLOG SAVER may utilize Google AdSense to serve non-intrusive advertisements. Third-party vendors, including Google, use cookies to serve ads based on user prior visits to this website. Users may opt out of personalized advertising by visiting Google's Ads Settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Contacting Us</h2>
          <p>
            If you have questions about our privacy practices or wish to request data deletion, contact us at <strong>privacy@backlogsaver.in</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
