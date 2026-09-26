import React, { useState } from 'react';
import { Product } from '../../types';
import { Link, useRouter } from '../../context/RouterContext';
import { useCart } from '../../context/CartContext';
import { PdfPreviewModal } from './PdfPreviewModal';
import { Star, Eye, ShoppingCart, Check, Download, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * ProductCard Props
 * Represents study material data with optional resolved hierarchy names
 */
interface ProductCardProps {
  product: Product & {
    universityName?: string;
    courseName?: string;
    semesterName?: string;
    subjectName?: string;
  };
  hasPurchased?: boolean; // True if the current student has already purchased this item
}

/**
 * ProductCard Component
 * Displays product cover, pricing, preview modal trigger, and animated Add-to-Cart logic.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, hasPurchased = false }) => {
  const { navigate } = useRouter();
  const { addToCart, isInCart } = useCart();
  const [showPreview, setShowPreview] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  // Calculate discount percentage if compareAtPrice is present
  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  const inCart = isInCart(product.productId);

  /**
   * Handles adding the study material to cart with celebratory confetti, feedback animation & toast
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If already owned, route directly to downloads
    if (hasPurchased) {
      navigate('/account/purchases');
      return;
    }

    // Trigger celebratory micro-confetti burst
    try {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { x, y },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#38bdf8', '#fbbf24'],
        disableForReducedMotion: true,
      });
    } catch {
      // Fallback gracefully
    }

    const res = addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);

    setToastMsg(res.message);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <>
      <div className="group bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-xl dark:hover:shadow-indigo-950/20 transition-all duration-300 flex flex-col overflow-hidden relative">
        {/* Instant action notification banner */}
        {toastMsg && (
          <div className="absolute top-2 inset-x-2 z-20 bg-slate-900/95 dark:bg-slate-950 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-xl text-center animate-in fade-in zoom-in-95 duration-150 border border-slate-700">
            {toastMsg}
          </div>
        )}

        {/* Thumbnail Image Container with Badges */}
        <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900 overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          {/* Subtle gradient vignette for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-85" />

          {/* Top Badges (Semester & Discount) */}
          <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-wrap gap-1.5 z-10">
            <span className="bg-indigo-600 text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-lg shadow-sm">
              {product.semesterName || 'Semester Notes'}
            </span>
            {discountPercent && (
              <span className="bg-rose-500 text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Quick PDF Sample Preview Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPreview(true);
            }}
            className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-xs transition-all active:scale-95 cursor-pointer z-10"
            aria-label={`Preview sample for ${product.title}`}
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Preview</span>
          </button>

          {/* University Name Tag on Thumbnail */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 max-w-[62%] z-10">
            <span className="text-[11px] font-bold text-white/95 drop-shadow-md truncate block">
              {product.universityName || 'University Exam Prep'}
            </span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Subject Tag & Total Pages */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold truncate max-w-[70%]">
                {product.subjectName || 'B.A. Discipline'}
              </span>
              <span className="shrink-0">{product.pages} Pages</span>
            </div>

            {/* Product Title with Link */}
            <Link
              to={`/product/${product.slug}`}
              className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
            >
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2">
                {product.title}
              </h3>
            </Link>

            {/* Short Syllabus Summary */}
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Student Reviews & Rating */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <div className="flex text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{product.rating || 4.9}</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                ({product.ratingCount || 42} reviews)
              </span>
            </div>
          </div>

          {/* Pricing Row and Dynamic Purchase/Cart Action */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  ₹{product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                    ₹{product.compareAtPrice}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                Instant PDF Download
              </span>
            </div>

            {/* Dynamic Button State */}
            {hasPurchased ? (
              <Link
                to="/account/purchases"
                className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/80 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Purchased
              </Link>
            ) : inCart ? (
              <Link
                to="/cart"
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer animate-in zoom-in-95 duration-150"
              >
                <Check className="w-4 h-4 stroke-[3]" /> In Cart
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className={`bg-indigo-600 hover:bg-indigo-700 active:scale-90 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer ${
                  justAdded
                    ? 'animate-cart-pop !bg-emerald-600 !shadow-emerald-500/40 scale-105'
                    : 'hover:scale-105'
                }`}
                aria-label={`Add ${product.title} to cart`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 animate-in zoom-in stroke-[3]" /> In Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PDF Sample Preview Lightbox Modal */}
      <PdfPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={product.title}
        previewImages={product.previewImages}
        totalPages={product.pages}
        sampleTopics={product.sampleTopics}
        price={product.price}
        onBuyNow={() => {
          addToCart(product);
          navigate('/checkout');
        }}
      />
    </>
  );
};
