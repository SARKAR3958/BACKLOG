import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Product } from '../types';
import { PdfPreviewModal } from '../components/product/PdfPreviewModal';
import { ProductCard } from '../components/product/ProductCard';
import confetti from 'canvas-confetti';
import {
  Star,
  ShieldCheck,
  Download,
  BookOpen,
  Eye,
  ShoppingCart,
  CheckCircle2,
  Lock,
  ArrowRight,
  GraduationCap,
  Sparkles,
  AlertCircle,
  FileText,
  Clock,
  Send,
} from 'lucide-react';

interface ProductDetailsPageProps {
  slug: string;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadProductDetails() {
      setLoading(true);
      setError(null);
      try {
        const prod = await api.getProductBySlug(slug);
        setProduct(prod);

        // Check ownership
        if (user) {
          const check = await api.checkHasPurchased(prod.productId);
          setHasPurchased(check.hasPurchased);
        }

        // Fetch related products in same university
        const relatedRes = await api.getProducts({
          universityId: prod.universityId,
          limit: 3,
        });
        setRelatedProducts(
          (relatedRes.products || []).filter((p) => p.productId !== prod.productId)
        );
      } catch (err: any) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    }
    loadProductDetails();
  }, [slug, user]);

  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (!product) return;

    try {
      if (e) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { x, y },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#38bdf8', '#fbbf24'],
        });
      }
    } catch {
      // Fallback
    }

    const res = addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);

    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await api.submitReview({
        productId: product.productId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewSuccess('Thank you! Your verified review has been published.');
      setReviewComment('');
      // Reload reviews
      const updatedProd = await api.getProductBySlug(slug);
      setProduct(updatedProd);
    } catch (err: any) {
      setToastMessage(err.message || 'Failed to submit review');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Study Material Unavailable</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error || 'The requested notes cannot be found.'}</p>
        <Link
          to="/shop"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs"
        >
          Browse All Notes
        </Link>
      </div>
    );
  }

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 dark:bg-slate-800 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-4 border border-slate-700">
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb Hierarchy */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-indigo-600 dark:hover:text-indigo-400">Materials</Link>
        <span>/</span>
        <Link to={`/shop?universityId=${product.universityId}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
          {product.university?.name || 'University'}
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Top Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Media Gallery (PRD Section 18, 19, 20) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-xl shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => setShowPreviewModal(true)}
              className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 backdrop-blur-xs transition-transform active:scale-95 border border-slate-200/50 dark:border-slate-700/50"
            >
              <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Preview Sample Pages
            </button>
          </div>

          {/* Sample Pages Thumbnails */}
          {product.previewImages && product.previewImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.previewImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setShowPreviewModal(true)}
                  className="w-20 h-24 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 shrink-0 relative group"
                >
                  <img src={img} alt={`Sample ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent flex items-center justify-center text-[10px] text-white font-bold">
                    Sample {idx + 1}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Key Details & Purchasing Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-lg">
              {product.university?.name || 'Central University'}
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-lg">
              {product.course?.name || 'B.A. Programme'}
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-lg">
              {product.semester?.name || 'Semester 1'}
            </span>
            <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg">
              {product.edition}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {product.title}
          </h1>

          {/* Rating & Author */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 stroke-none" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{product.rating || 4.9}</span>
              <span className="text-slate-400">({product.ratingCount || 42} reviews)</span>
            </div>
            <span>•</span>
            <div>
              Author: <strong className="text-slate-800 dark:text-slate-200">{product.author}</strong>
            </div>
            <span>•</span>
            <div>
              Sales: <strong className="text-slate-800 dark:text-slate-200">{product.salesCount || 100}+ students</strong>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{product.price}</span>
              {product.compareAtPrice && (
                <span className="text-base text-slate-400 line-through">₹{product.compareAtPrice}</span>
              )}
              {discountPercent && (
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* DUPLICATE PURCHASE PROTECTION (PRD Section 22) */}
            {hasPurchased ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Already Purchased</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/80 leading-relaxed">
                  You already own this educational study material. Repurchasing is not required. You can download your PDF anytime.
                </p>
                <Link
                  to="/account/purchases"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" /> Go to My Purchases & Download
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {isInCart(product.productId) ? (
                  <Link
                    to="/cart"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white border border-emerald-500 font-extrabold text-sm py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" /> In Cart (View Cart)
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-bold text-sm py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                      justAdded ? 'animate-cart-pop !bg-emerald-600 !text-white !border-emerald-600' : 'active:scale-95'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Add to Cart
                      </>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm py-3 px-5 rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Buy Now (₹{product.price})
                </button>
              </div>
            )}

            {/* Digital Product Notice (PRD Section 19) */}
            <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong>Digital Product Notice:</strong> This is an authorized digital PDF study material. After successful payment, your purchased file becomes immediately accessible in your account for secure download.
              </span>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Pages</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{product.pages} Pages</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Language</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{product.language}</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">File Size</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{product.fileSize}</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Format</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">High-Res PDF</div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">About this Study Material</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Units / Topics Covered */}
          {product.sampleTopics && product.sampleTopics.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Syllabus Units Covered</h3>
              <div className="space-y-2">
                {product.sampleTopics.map((topic: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REVIEWS & FEEDBACK SECTION (PRD Section 46) */}
      <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Reviews & Feedback</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verified comments from university students who studied these notes.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              <Star className="w-5 h-5 fill-amber-400 stroke-none" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">{product.rating || 4.9}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev: any) => (
              <div key={rev.reviewId} className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{rev.userName}</div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">"{rev.comment}"</p>
                <div className="text-[10px] text-slate-400">
                  {new Date(rev.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No reviews yet for this edition.</p>
          )}
        </div>

        {/* Write a review form for verified purchaser */}
        {hasPurchased && (
          <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 max-w-xl">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Share your exam preparation feedback</h4>
            {reviewSuccess ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl">
                {reviewSuccess}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Your Rating:</span>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg p-1.5"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Helpful</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Needs Improvement</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How did these notes help you clear your backlog or prepare for semester exams?"
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
              </form>
            )}
          </div>
        )}
      </section>

      {/* RELATED STUDY MATERIALS */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Related University Notes</h2>
            <Link to="/shop" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Watermarked Sample Preview Modal */}
      <PdfPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title={product.title}
        previewImages={product.previewImages || []}
        totalPages={product.pages}
        sampleTopics={product.sampleTopics}
        price={product.price}
        onBuyNow={() => {
          addToCart(product);
          navigate('/checkout');
        }}
      />
    </div>
  );
};
