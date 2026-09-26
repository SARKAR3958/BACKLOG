import React, { useEffect, useState } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Download,
  FileText,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { queryParams } = useRouter();
  const { user } = useAuth();
  const orderId = queryParams.get('orderId');
  const orderNumber = queryParams.get('orderNumber');

  const [purchases, setPurchases] = useState<any[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error(e);
    }

    // Fetch user purchases to let student download right away
    if (user) {
      api.getMyPurchases().then((res) => {
        setPurchases(res.purchases || []);
      }).catch(console.error);
    }
  }, [user]);

  const handleDownload = async (productId: string, title: string) => {
    setDownloadingId(productId);
    try {
      const res = await api.generateDownloadToken(productId);
      const link = document.createElement('a');
      link.href = res.downloadUrl;
      link.download = res.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert(err.message || 'Failed to download file. Please check My Purchases dashboard.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center space-y-8 animate-in fade-in duration-300">
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-md border border-emerald-200/60 dark:border-emerald-800/60">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/80 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Payment Confirmed & Verified
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Thank You for Your Order!
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
          Your payment was processed successfully. Your high-yield study materials are now permanently linked to your account.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white dark:bg-slate-800/90 p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-md text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Order Number</div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              {orderNumber || 'BS-PROCESSED'}
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            Status: PAID & UNLOCKED
          </span>
        </div>

        {/* Quick Download List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Your Downloadable Study Notes:
          </h3>
          {purchases.length > 0 ? (
            <div className="space-y-2.5">
              {purchases.slice(0, 3).map((item) => (
                <div
                  key={item.purchaseId}
                  className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-14 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                      <img src={item.thumbnail} alt={item.productTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.productTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.subjectName || 'Study Material'} • {item.pages || 'Multi-page'} Notes
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(item.productId, item.productTitle)}
                    disabled={downloadingId === item.productId}
                    className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-xs shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingId === item.productId ? 'Preparing...' : 'Download PDF'}</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-center text-xs text-slate-500 dark:text-slate-400">
              Loading your purchase records...
            </div>
          )}
        </div>

        <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5 bg-indigo-50/50 dark:bg-indigo-950/30 p-3.5 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            Security Notice: Download tokens are generated securely. You can re-download at any time from your student account dashboard under My Purchases.
          </span>
        </div>
      </div>

      {/* Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/account/purchases"
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" /> Go to My Purchases Dashboard
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs"
        >
          <ShoppingBag className="w-4 h-4" /> Browse More Notes
        </Link>
      </div>
    </div>
  );
};
