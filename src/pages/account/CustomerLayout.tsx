import React from 'react';
import { useRouter, Link } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  ShoppingCart,
  User,
  Shield,
  LogOut,
  LayoutDashboard,
  GraduationCap,
} from 'lucide-react';

interface CustomerLayoutProps {
  children: React.ReactNode;
  activeTab: 'overview' | 'purchases' | 'orders' | 'profile' | 'security';
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, activeTab }) => {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 animate-in fade-in duration-200">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign in to view your account</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">You need to be logged in to view your purchases and orders.</p>
        <Link
          to="/login"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', href: '/account', icon: LayoutDashboard },
    { id: 'purchases', label: 'My Purchases (PDFs)', href: '/account/purchases', icon: FileText, highlight: true },
    { id: 'orders', label: 'My Orders', href: '/account/orders', icon: ShoppingCart },
    { id: 'profile', label: 'Profile Information', href: '/account/profile', icon: User },
    { id: 'security', label: 'Account Security', href: '/account/security', icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-indigo-600/25">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{user.fullName}</h1>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{user.email}</span>
              <span>•</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Student Account</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : item.highlight
                    ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Tab Content Area */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
};
