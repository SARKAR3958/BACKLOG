import React from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { AlertCircle, RotateCcw, HelpCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

export const OrderFailedPage: React.FC = () => {
  const { queryParams } = useRouter();
  const orderId = queryParams.get('orderId');
  const reason = queryParams.get('reason');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6 animate-in fade-in duration-300">
      <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-3xl flex items-center justify-center mx-auto shadow-md border border-rose-200 dark:border-rose-900/60">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 px-3.5 py-1.5 rounded-full border border-rose-200 dark:border-rose-800">
          Payment Incomplete
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Payment Could Not Be Completed
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
          {reason
            ? decodeURIComponent(reason)
            : 'Your transaction was cancelled or declined by your bank or UPI application. Your order has not been charged.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 text-left text-xs space-y-3 max-w-md mx-auto shadow-sm">
        <div className="font-bold text-slate-900 dark:text-white">What happens next?</div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          • If any money was deducted, Razorpay and your bank will automatically reverse the full amount within 3-5 business days.
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          • Your cart items are saved. You can retry checkout anytime using Google Pay, PhonePe, Paytm, or Cards.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/cart"
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Return to Cart & Retry
        </Link>
        <Link
          to="/contact"
          className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <HelpCircle className="w-4 h-4" /> Contact Academic Support
        </Link>
      </div>
    </div>
  );
};
