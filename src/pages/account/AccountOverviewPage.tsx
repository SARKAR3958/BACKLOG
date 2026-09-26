import React, { useState, useEffect } from 'react';
import { CustomerLayout } from './CustomerLayout';
import { api } from '../../services/api';
import { Link } from '../../context/RouterContext';
import { FileText, ShoppingCart, Download, ArrowRight } from 'lucide-react';

export const AccountOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalPurchases: 0,
    totalOrders: 0,
    availablePdfs: 0,
    recentPurchases: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAccountStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <CustomerLayout activeTab="overview">
      <div className="space-y-6">
        {/* Metric Cards (PRD Section 32) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Purchases</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.totalPurchases}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Purchased study notes</div>
          </div>

          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Orders</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.totalOrders}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Orders placed</div>
          </div>

          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Available PDFs</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{stats.availablePdfs}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Ready for instant download</div>
          </div>
        </div>

        {/* Recent Purchases Section */}
        <div className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recent Study Materials</h2>
            <Link to="/account/purchases" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentPurchases && stats.recentPurchases.length > 0 ? (
            <div className="space-y-3">
              {stats.recentPurchases.map((item: any) => (
                <div key={item.purchaseId} className="p-3.5 bg-slate-50 dark:bg-slate-750 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.thumbnail} alt={item.productTitle} className="w-10 h-12 rounded object-cover" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.productTitle}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.subjectName}</div>
                    </div>
                  </div>
                  <Link
                    to="/account/purchases"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0"
                  >
                    Download
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              You haven't purchased any study materials yet.{' '}
              <Link to="/shop" className="text-indigo-600 dark:text-indigo-400 font-bold underline">
                Browse catalog
              </Link>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};
