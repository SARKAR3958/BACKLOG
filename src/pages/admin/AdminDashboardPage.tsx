import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { api } from '../../services/api';
import { Link } from '../../context/RouterContext';
import {
  Users,
  BookOpen,
  ShoppingCart,
  IndianRupee,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const fetchStats = () => {
    setLoading(true);
    api.getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleResetData = async () => {
    if (!window.confirm('Reset database to realistic initial B.A. curriculum seed data?')) return;
    setResetting(true);
    try {
      const res = await api.resetDatabaseToSeed();
      setResetMessage(res.message);
      fetchStats();
      setTimeout(() => setResetMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to reset seed');
    } finally {
      setResetting(false);
    }
  };

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* Top actions & notifications */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Platform Analytics & Metrics</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live store sales, order fulfillments, and download activity.</p>
          </div>
          <button
            onClick={handleResetData}
            disabled={resetting}
            className="self-start sm:self-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetting ? 'Resetting...' : 'Re-seed Demo Data'}</span>
          </button>
        </div>

        {resetMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{resetMessage}</span>
          </div>
        )}

        {/* Dashboard Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gross Revenue</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              ₹{stats ? stats.totalRevenue.toLocaleString('en-IN') : 0}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Today: ₹{stats ? stats.todayRevenue.toLocaleString('en-IN') : 0}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Orders</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              {stats?.totalOrders || 0}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <strong className="text-emerald-600 dark:text-emerald-400">{stats?.paidOrders || 0} Paid</strong> • {stats?.pendingOrders || 0} Pending
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Study Products</div>
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1.5">
              {stats?.totalProducts || 0}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Across 3 Major Universities
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Registered Users</div>
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1.5">
              {stats?.totalUsers || 0}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Student Accounts
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/products"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-purple-400 dark:hover:border-purple-500 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Manage Products</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Upload, edit pricing, or toggle active notes</div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </Link>

          <Link
            to="/admin/orders"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-purple-400 dark:hover:border-purple-500 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Review Orders</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Inspect Razorpay transactions and items</div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </Link>

          <Link
            to="/admin/coupons"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-purple-400 dark:hover:border-purple-500 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Discount Coupons</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Create promo codes like FIRST50</div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};
