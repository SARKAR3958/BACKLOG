import React from 'react';
import { useRouter, Link } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  Layers,
  History,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'products' | 'orders' | 'users' | 'coupons' | 'hierarchy' | 'settings' | 'audit';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { navigate } = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Strict Authorization Check
  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5 animate-in fade-in duration-200">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-3xl flex items-center justify-center mx-auto shadow-md border border-rose-200 dark:border-rose-900/60">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Access Denied</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          You do not have administrative credentials to view this area. Only authorized system operators can access backend management.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
          >
            Log in as Admin
          </Link>
          <Link
            to="/"
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard & Metrics', href: '/admin', icon: LayoutDashboard },
    { id: 'products', label: 'Study Products', href: '/admin/products', icon: BookOpen },
    { id: 'orders', label: 'Orders & Payments', href: '/admin/orders', icon: ShoppingCart },
    { id: 'users', label: 'Student Accounts', href: '/admin/users', icon: Users },
    { id: 'coupons', label: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
    { id: 'hierarchy', label: 'Curriculum Hierarchy', href: '/admin/hierarchy', icon: Layers },
    { id: 'settings', label: 'Platform Settings', href: '/admin/settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Admin Top Header */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-white">Backlog Saver Admin Console</h1>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/30">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Authenticated: {user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
          <Link
            to="/"
            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto border border-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Admin Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <Link
                key={link.id}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Admin Content Workspace */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
};
