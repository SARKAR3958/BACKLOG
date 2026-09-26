import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const { queryParams, navigate } = useRouter();
  const { user, verifyEmail, resendVerification, refreshProfile } = useAuth();

  const emailParam = queryParams.get('email') || user?.email || 'your email';
  const tokenParam = queryParams.get('token');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(user?.emailVerified || false);

  // If token is in URL, auto-verify
  useEffect(() => {
    if (tokenParam) {
      setLoading(true);
      verifyEmail(tokenParam)
        .then(() => {
          setVerifiedSuccess(true);
          setMessage('Email verified successfully! You have full access.');
        })
        .catch((err) => setError(err.message || 'Verification token invalid or expired'))
        .finally(() => setLoading(false));
    }
  }, [tokenParam]);

  const handleManualCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      await verifyEmail(undefined, user?.uid);
      await refreshProfile();
      setVerifiedSuccess(true);
      setMessage('Your email address has been verified!');
    } catch (err: any) {
      setError(err.message || 'Email not yet verified. Please click the link in your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      await resendVerification(emailParam);
      setMessage(`Verification link has been sent to ${emailParam}.`);
    } catch (err: any) {
      setError(err.message || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-indigo-100 dark:border-indigo-900/40">
          {verifiedSuccess ? <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" /> : <Mail className="w-8 h-8" />}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {verifiedSuccess ? 'Email Verified!' : 'Account Created'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {verifiedSuccess ? (
              'Your email is verified. You now have full authorized access to purchase, download, and review study materials.'
            ) : (
              <>
                We've sent a verification email to: <br />
                <strong className="text-slate-900 dark:text-white font-bold">{emailParam}</strong> <br />
                Please verify your email before continuing.
              </>
            )}
          </p>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-xl">
            {message}
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        {verifiedSuccess ? (
          <div className="space-y-3 pt-2">
            <Link
              to="/account/purchases"
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Access My Purchases</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-3 px-4 rounded-xl transition-all"
            >
              Browse Study Materials
            </Link>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <button
              onClick={handleManualCheck}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Checking status...' : "I've Verified My Email"}</span>
            </button>

            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resend Verification Email</span>
            </button>

            <div className="pt-2">
              <Link to="/login" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
