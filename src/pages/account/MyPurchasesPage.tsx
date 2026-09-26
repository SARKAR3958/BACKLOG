import React, { useState, useEffect } from 'react';
import { CustomerLayout } from './CustomerLayout';
import { api } from '../../services/api';
import { Link } from '../../context/RouterContext';
import { Download, FileText, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const MyPurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  useEffect(() => {
    api.getMyPurchases()
      .then((res) => setPurchases(res.purchases || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (productId: string, title: string) => {
    setDownloadingId(productId);
    setDownloadStatus('Verifying ownership and generating secure download token...');
    try {
      const res = await api.generateDownloadToken(productId);

      setDownloadStatus('Download starting...');
      const link = document.createElement('a');
      link.href = res.downloadUrl;
      link.download = res.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setDownloadStatus(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to download file.');
      setDownloadStatus(null);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <CustomerLayout activeTab="purchases">
      <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">My Study Materials</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instant lifetime access to all your purchased CBCS/NEP study notes.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 self-start sm:self-auto">
            {purchases.length} File{purchases.length !== 1 ? 's' : ''} Available
          </span>
        </div>

        {downloadStatus && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <span>{downloadStatus}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-100 dark:bg-slate-750 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Purchased Study Materials</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You haven't bought any study notes yet. Browse our library to prepare for upcoming semester exams.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((item) => (
              <div
                key={item.purchaseId}
                className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="w-14 h-18 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700">
                    <img src={item.thumbnail} alt={item.productTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                        Active Access
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Purchased:{' '}
                        {new Date(item.purchasedAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug truncate">
                      {item.productTitle}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>{item.subjectName}</span>
                      <span>•</span>
                      <span>{item.universityName}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => handleDownload(item.productId, item.productTitle)}
                    disabled={downloadingId === item.productId}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloadingId === item.productId ? 'Generating...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                All downloads are authenticated and generated with expiring secure access tokens to protect digital educational copyrights.
              </span>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
