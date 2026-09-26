import React from 'react';
import { Link } from '../../context/RouterContext';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export const CopyrightPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Link to="/" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Copyright & Takedown Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Effective Date: January 1, 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-200 text-xs">
          <strong>Original & Authorized Content Pledge:</strong> BACKLOG SAVER strictly prohibits the uploading, distribution, or sale of pirated textbooks, unauthorized scans of published books, leaked university question papers, or infringing third-party materials (PRD Section 54).
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Nature of Materials</h2>
          <p>
            Study notes published on our platform represent original analytical syntheses, educational summaries, previous years' question examinations, and model answers authored by qualified faculty and academic editors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Copyright Infringement & Takedown Notice</h2>
          <p>
            If you are a copyright owner or an authorized agent and believe that any educational note hosted on BACKLOG SAVER infringes upon your copyright, please submit an expedited takedown notice containing:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>The exact URL of the material on our marketplace you wish to be removed.</li>
            <li>Your contact information (name, address, telephone number, and official email).</li>
            <li>A statement that you have a good-faith belief that use of the material is not authorized by the copyright owner.</li>
            <li>A statement made under penalty of perjury that the information provided is accurate.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Contact for Notices</h2>
          <p>
            Send all official intellectual property inquiries and DMCA/Copyright notifications directly to: <br />
            <strong>Email: copyright@backlogsaver.in</strong>
          </p>
          <p>
            We process all verified intellectual property takedown inquiries within 24 business hours.
          </p>
        </section>
      </div>
    </div>
  );
};
