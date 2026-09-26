import React from 'react';
import { Link } from '../../context/RouterContext';
import { ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Link to="/" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Effective Date: January 1, 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h2>
          <p>
            By registering, purchasing, or accessing study materials on BACKLOG SAVER, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Individual Student License</h2>
          <p>
            Every digital study material purchased from BACKLOG SAVER is granted under a limited, revocable, non-exclusive, non-transferable personal license for the individual purchaser's personal educational revision only.
          </p>
          <p>
            You are strictly prohibited from redistributing, public uploading, broadcasting, selling, sharing via Telegram/WhatsApp channels, or copying the materials for commercial gain.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Account Integrity</h2>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Payments & Taxes</h2>
          <p>
            All prices are stated in Indian Rupees (INR ₹). Payment processing is conducted securely via Razorpay. We do not store credit card numbers or UPI PINs on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Disclaimer of Educational Guarantees</h2>
          <p>
            While our study notes and PYQ answer keys are crafted by academic faculty to optimize exam outcomes, BACKLOG SAVER makes no warranty or guarantee of specific academic grades or examination results.
          </p>
        </section>
      </div>
    </div>
  );
};
