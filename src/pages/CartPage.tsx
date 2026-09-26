import React, { useState } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Trash2,
  ShoppingCart,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const {
    items,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    setCouponError(null);
    setCouponSuccess(null);
    try {
      const res = await applyCoupon(couponInput.trim());
      if (res.success) {
        setCouponSuccess(res.message);
        setCouponInput('');
      } else {
        setCouponError(res.message);
      }
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Cart is Empty</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
          Explore our authorized university study notes and solved answer frameworks to clear backlogs.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
        >
          <BookOpen className="w-4 h-4" /> Browse Study Notes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {items.length} digital study material{items.length > 1 ? 's' : ''} ready for instant download access.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product }) => (
            <div
              key={product.productId}
              className="bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-100 dark:border-slate-700">
                <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
                    Digital PDF
                  </span>
                  <span className="text-xs text-slate-400">{product.pages} Pages</span>
                </div>
                <Link to={`/product/${product.slug}`} className="block hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2">
                    {product.title}
                  </h3>
                </Link>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Edition: {product.edition}
                </div>
              </div>

              {/* Price & Remove */}
              <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/60">
                <div className="text-right">
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white">₹{product.price}</div>
                  {product.compareAtPrice && (
                    <div className="text-xs text-slate-400 line-through">₹{product.compareAtPrice}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(product.productId)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Educational Guarantee Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Lifetime Access Guarantee:</strong> Once purchased, you can re-download this PDF anytime in your account under "My Purchases" without repurchase.
            </span>
          </div>
        </div>

        {/* Right: Order Summary & Coupon Input */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700/60">
            Order Summary
          </h2>

          {/* Coupon Code Section (PRD Section 45) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Apply Coupon Code
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs">
                <div>
                  <span className="font-extrabold text-emerald-800 dark:text-emerald-300">{appliedCoupon.couponCode}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 ml-1.5">(-₹{appliedCoupon.discountAmount})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 font-bold p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. FIRST50, BACKLOG10"
                  className="flex-1 uppercase text-xs font-semibold p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={applying}
                  className="bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {applying ? 'Checking...' : 'Apply'}
                </button>
              </form>
            )}

            {couponError && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{couponSuccess}</p>}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Coupon Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Digital Delivery Fee</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE (Instant)</span>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Total Amount</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{total}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-[11px] text-center text-slate-400">
            🔒 Secured by 256-bit SSL encryption & Razorpay
          </div>
        </div>
      </div>
    </div>
  );
};
