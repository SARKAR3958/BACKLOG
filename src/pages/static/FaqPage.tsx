import React, { useState } from 'react';
import { Link } from '../../context/RouterContext';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'What is BACKLOG SAVER?',
      a: 'BACKLOG SAVER is India’s dedicated digital educational marketplace tailored for undergraduate students. We curate high-yield, exam-oriented study materials and solved previous year question answers to help B.A. students clear backlog exams and score higher in regular semester examinations.',
    },
    {
      q: 'Are the products physical books or digital PDFs?',
      a: 'All products sold on BACKLOG SAVER are 100% digital PDF study materials. No physical shipping is required. Immediately after successful payment, your purchased file becomes available for download directly inside your student account.',
    },
    {
      q: 'How do I purchase and make payment?',
      a: 'Simply browse study notes by university, course, semester, or subject. Click "Add to Cart" or "Buy Now", proceed to checkout, enter your student name and email, and pay securely via Razorpay using UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit Cards, or Net Banking.',
    },
    {
      q: 'How do I receive my PDF after payment?',
      a: 'Once your payment is verified by our server, the study material is immediately unlocked in your account. You will be redirected to an Order Success screen with an instant "Download PDF" button, and the file will remain permanently accessible under your "My Purchases" dashboard.',
    },
    {
      q: 'Can I download the study material again in the future?',
      a: 'Yes! All legitimate purchases grant lifetime access on your student account. If you change devices or lose your downloaded file, simply log in to BACKLOG SAVER, go to "My Purchases", and generate a fresh download link at no extra charge.',
    },
    {
      q: 'What if payment succeeds but my browser closes or disconnects?',
      a: 'Do not panic! Our backend uses automated Razorpay webhooks. Even if your browser crashes, battery dies, or connection drops, our server captures the payment event, marks the order PAID, and unlocks the PDF in your account. Just log in and check "My Purchases".',
    },
    {
      q: 'Can I get a refund if I change my mind?',
      a: 'Due to the immediate digital delivery nature of PDF materials, refunds are generally not offered once a file is downloaded. However, if technical issues prevent you from accessing the file or if duplicate transactions occurred, our support team will issue a full refund within 48 hours. Please see our Refund Policy for details.',
    },
    {
      q: 'Can I share my purchased PDF with other students?',
      a: 'No. Purchased materials are licensed solely for the individual student purchaser. Each document is watermarked with user licensing identifiers. Unauthorized redistribution, public group uploads, or commercial resale violates our terms and copyright regulations.',
    },
    {
      q: 'How do I contact customer support?',
      a: 'You can email our academic support desk anytime at support@backlogsaver.in or submit an inquiry through our Contact page. We strive to resolve all questions within 24 business hours.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 animate-in fade-in duration-300">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Everything You Need to Know
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Clear answers regarding digital PDF delivery, Razorpay checkout, downloads, and backlog preparation.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-indigo-50 dark:bg-indigo-950/40 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 text-center space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Still have questions?</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Our student support team is always ready to assist you with order verification, downloads, or course syllabus inquiries.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs"
        >
          Contact Support Desk
        </Link>
      </div>
    </div>
  );
};
