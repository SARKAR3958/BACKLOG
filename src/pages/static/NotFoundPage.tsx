import React from 'react';
import { Link } from '../../context/RouterContext';
import { Home, BookOpen, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6 animate-in fade-in duration-300">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-extrabold text-3xl flex items-center justify-center mx-auto shadow-sm border border-indigo-100 dark:border-indigo-900/40">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-3.5 h-3.5" /> Back Home
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
        >
          <BookOpen className="w-3.5 h-3.5" /> Browse Materials
        </Link>
      </div>
    </div>
  );
};
