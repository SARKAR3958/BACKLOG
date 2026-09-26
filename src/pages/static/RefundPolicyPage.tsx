import React from 'react';
import { Link } from '../../context/RouterContext';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Link to="/" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Refund & Cancellation Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Effective Date: January 1, 2026 • Last updated: September 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs">
          <strong>Digital Products Notice:</strong> All study materials sold on BACKLOG SAVER are non-tangible digital PDF documents. Instant delivery occurs immediately upon successful payment verification.
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. General Policy on Digital Goods</h2>
          <p>
            Because study materials and answer frameworks are digital and non-returnable once generated and downloaded, all sales are considered final unless one of the exceptional circumstances outlined below applies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Eligible Circumstances for Full Refund</h2>
          <p>You are eligible for a 100% full refund under the following conditions:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Duplicate Transactions:</strong> If your bank or UPI app debited your account multiple times for the same order due to network timeouts.
            </li>
            <li>
              <strong>Technical Non-Delivery:</strong> If technical server issues permanently prevent access to your purchased PDF within 48 hours of purchase, and our support team is unable to manually deliver the file.
            </li>
            <li>
              <strong>Unpublished/Corrupted File:</strong> If the PDF file downloaded is demonstrably corrupted, unreadable, or truncated, and we cannot furnish a replacement file within 24 hours.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Ineligible Situations</h2>
          <p>Refunds cannot be granted for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Change of mind after successful file access or download.</li>
            <li>Failure to attend university examinations or adverse exam results.</li>
            <li>Purchasing the wrong semester/subject when sample previews and descriptions were available prior to checkout.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Refund Request Procedure</h2>
          <p>
            To request a refund, email <strong>support@backlogsaver.in</strong> with your registered email, order number (e.g., BS-20260926-XXXXXX), and Razorpay payment ID. Our operations team reviews all requests within 2 business days. Approved refunds are credited back to the original payment source within 5–7 business days per banking norms.
          </p>
        </section>
      </div>
    </div>
  );
};
