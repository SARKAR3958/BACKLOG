import React from 'react';
import { Link } from '../../context/RouterContext';
import { ArrowLeft, Download, ShieldCheck } from 'lucide-react';

export const DigitalProductsPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Link to="/" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Digital Products & Delivery Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Effective Date: January 1, 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Instant Electronic Delivery</h2>
          <p>
            BACKLOG SAVER is an exclusively digital goods platform. We do not dispatch physical textbooks or paper printouts. All products are delivered electronically in high-resolution Adobe Portable Document Format (.PDF).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Delivery Timeline</h2>
          <p>
            Delivery is instant. Immediately following successful payment authorization via Razorpay, your order status updates to PAID and your purchased items are automatically credited to your student account under "My Purchases".
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. File Security & Dynamic Tokens</h2>
          <p>
            To prevent unauthorized file leeching and permanent URL sharing, all download links are generated as secure temporary tokens valid for 15 minutes. You may request and generate unlimited fresh download links from your account dashboard for personal study.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Recommended Viewing Software</h2>
          <p>
            Our PDF files are compatible with standard PDF readers, including Adobe Acrobat Reader, Google Chrome, Apple Books, and mobile PDF viewers on Android and iOS devices.
          </p>
        </section>
      </div>
    </div>
  );
};
