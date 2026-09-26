import React from 'react';
import { Link } from '../../context/RouterContext';
import { GraduationCap, ShieldCheck, Download, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                BACKLOG <span className="text-indigo-400">SAVER</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              India's premier digital marketplace designed specifically for undergraduate students. Discover authorized, high-yield PDF study materials aligned with university CBCS/NEP syllabus to clear backlogs and score higher.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Secure Razorpay Checkout
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
                <Download className="w-4 h-4 text-indigo-400" /> Instant PDF Delivery
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Explore Study Material</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop" className="hover:text-indigo-400 transition-colors">
                  All Study Notes
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  B.A. (Programme) Notes
                </Link>
              </li>
              <li>
                <Link to="/universities" className="hover:text-indigo-400 transition-colors">
                  Delhi University (DU)
                </Link>
              </li>
              <li>
                <Link to="/universities" className="hover:text-indigo-400 transition-colors">
                  Mumbai University (MU)
                </Link>
              </li>
              <li>
                <Link to="/universities" className="hover:text-indigo-400 transition-colors">
                  Panjab University (PU)
                </Link>
              </li>
              <li>
                <Link to="/semesters" className="hover:text-indigo-400 transition-colors">
                  Browse by Semester
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Help */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Student Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">
                  About Backlog Saver
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-indigo-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors">
                  Contact Academic Support
                </Link>
              </li>
              <li>
                <Link to="/account/purchases" className="hover:text-indigo-400 transition-colors">
                  My Purchases & Downloads
                </Link>
              </li>
              <li>
                <Link to="/digital-products" className="hover:text-indigo-400 transition-colors">
                  Digital Delivery Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Trust & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-indigo-400 transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/copyright" className="hover:text-indigo-400 transition-colors">
                  Copyright & Takedown Policy
                </Link>
              </li>
              <li>
                <Link to="/digital-products" className="hover:text-indigo-400 transition-colors">
                  Authorized Educational Content
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar (PRD Section 50, 54, 100) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} BACKLOG SAVER. Clear Backlogs. Prepare Smarter. Move Forward. All rights reserved.
          </p>
          <p className="text-center sm:text-right text-[11px] max-w-md">
            BACKLOG SAVER is an independent educational publishing marketplace and is not officially affiliated with or endorsed by any specific university or university syndicate.
          </p>
        </div>
      </div>
    </footer>
  );
};
