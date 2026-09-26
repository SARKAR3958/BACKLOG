import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../context/RouterContext';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { University } from '../types';
import {
  GraduationCap,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Download,
  Zap,
  CheckCircle2,
  Users,
  Star,
  Award,
  HelpCircle,
  FileCheck,
  Sparkles,
  Layers,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [heroSearch, setHeroSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, univRes] = await Promise.all([
          api.getProducts({ limit: 6, sort: 'popular' }),
          api.getUniversities(),
        ]);
        setFeaturedProducts(prodRes.products || []);
        setUniversities(univRes || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <div className="space-y-12 sm:space-y-20 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-800">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
            {/* Top Tag / Badge with subtle float */}
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs sm:text-sm font-bold backdrop-blur-xs animate-fade-up animate-float-subtle">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>India's Dedicated B.A. Educational Notes Marketplace</span>
            </div>

            {/* Main Hero Headline with NEON GRADIENT text on 'Prepare Smarter.' */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight animate-fade-up-delay-1">
              Clear Backlogs. <br className="hidden sm:block" />
              <span className="neon-gradient-text inline-block font-black">
                Prepare Smarter.
              </span>{' '}
              Move Forward.
            </h1>

            {/* Subheading */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto animate-fade-up-delay-2">
              Stop panicking before exam week. Access authorized, high-yield PDF study materials and solved previous 7-year question frameworks structured specifically to clear backlogs in Delhi University, Mumbai University & central universities.
            </p>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto animate-fade-up-delay-3">
              <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-1 sm:p-1.5 border border-slate-200 dark:border-slate-700">
                <Search className="w-5 h-5 text-slate-400 ml-2.5 sm:ml-3 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search subject (e.g. Political Theory, History)..."
                  className="w-full px-2.5 sm:px-3 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 dark:text-white bg-transparent focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick University Pills */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-400 animate-fade-up-delay-3">
              <span className="text-slate-400 font-bold text-[11px] sm:text-xs">Popular:</span>
              {['Delhi University (DU)', 'Mumbai University', 'Semester 1', 'Political Science', 'Ancient History'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/shop?search=${encodeURIComponent(tag.replace(/ \(.+\)/, ''))}`)}
                  className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors text-[11px] font-semibold cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* CTA Navigation Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up-delay-3">
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" /> Browse All Study Materials
              </Link>
              <Link
                to="/universities"
                className="w-full sm:w-auto bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" /> Select University <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Highlights */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 animate-fade-up-delay-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 bg-slate-800/80 dark:bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-lg">
            <div className="text-center p-2">
              <div className="text-xl sm:text-3xl font-black text-white">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-0.5">CBCS / NEP Syllabus</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xl sm:text-3xl font-black text-indigo-400">15-Mark</div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-0.5">Ready Model Answers</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xl sm:text-3xl font-black text-emerald-400">Instant</div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-0.5">PDF Digital Download</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xl sm:text-3xl font-black text-amber-400">4.9 ★</div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-0.5">Student Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UNIVERSITIES SECTION WITH DISTINCT LOCAL LOADING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Curated by University
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Select Your University Curriculum
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Each university follows distinct exam question patterns. Choose your university for exact syllabus alignment.
            </p>
          </div>
          <Link
            to="/universities"
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
          >
            View All Universities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          /* Dedicated University Loading Shimmer Overlay */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 skeleton-shimmer h-36 flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-300/60 dark:bg-slate-700/60 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-300/60 dark:bg-slate-700/60 rounded w-3/4" />
                  <div className="h-3 bg-slate-300/40 dark:bg-slate-700/40 rounded w-1/2" />
                  <div className="h-3 bg-slate-300/40 dark:bg-slate-700/40 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {universities.slice(0, 6).map((univ) => (
              <div
                key={univ.id}
                onClick={() => navigate(`/shop?universityId=${univ.id}`)}
                className="group cursor-pointer bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-400 hover:shadow-xl dark:hover:shadow-indigo-950/20 transition-all duration-200 flex items-start gap-3.5 sm:gap-4 interactive-card"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0 border border-slate-100 dark:border-slate-700">
                  <img
                    src={univ.logo}
                    alt={univ.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded">
                      {univ.code}
                    </span>
                    <span className="text-[11px] text-slate-400">{univ.state}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {univ.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {univ.description}
                  </p>
                  <div className="mt-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    Browse Notes <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. FEATURED STUDY MATERIALS WITH DISTINCT LOCAL LOADING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Top-Selling Materials
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Exam-Clearing Rapid Revision Notes
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Handcrafted for undergraduate semester exams and backlog clearance with step-by-step model answers.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
          >
            Explore Complete Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          /* Dedicated Products Loading Shimmer Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 skeleton-shimmer h-96 flex flex-col justify-between"
              >
                <div className="w-full h-44 bg-slate-300/60 dark:bg-slate-700/60 rounded-2xl" />
                <div className="space-y-2 py-2">
                  <div className="h-4 bg-slate-300/60 dark:bg-slate-700/60 rounded w-3/4" />
                  <div className="h-3 bg-slate-300/40 dark:bg-slate-700/40 rounded w-1/2" />
                </div>
                <div className="h-10 bg-slate-300/50 dark:bg-slate-700/50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY CHOOSE BACKLOG SAVER */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-12 sm:py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Built Specifically for University Students
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Why Indian Students Trust Backlog Saver
            </h2>
            <p className="text-slate-400 text-xs sm:text-base leading-relaxed">
              Standard textbooks are 600+ pages of dense theoretical text. Our notes are high-yield, exam-oriented, and structured around what examiners evaluate in answer sheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            <div className="bg-slate-800/80 dark:bg-slate-900/90 border border-slate-700/80 p-5 sm:p-6 rounded-2xl space-y-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">15-Mark Model Answers</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Every major theoretical unit is distilled into pre-structured 15-mark essay answers with introduction, core arguments, critical perspectives, and conclusion.
              </p>
            </div>

            <div className="bg-slate-800/80 dark:bg-slate-900/90 border border-slate-700/80 p-5 sm:p-6 rounded-2xl space-y-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">Solved Previous 7-Year Papers</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Understand recurring exam patterns. We identify high-frequency questions that universities repeat year after year so you focus on what really matters.
              </p>
            </div>

            <div className="bg-slate-800/80 dark:bg-slate-900/90 border border-slate-700/80 p-5 sm:p-6 rounded-2xl space-y-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">Instant Account Download</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                No waiting, no shipping delays. Complete payment via UPI or Cards and immediately download your clean, searchable PDF directly inside your student dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Simple 3-Step Process</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">How Backlog Saver Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-base flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Select University & Subject</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Filter by Delhi University, Mumbai University, B.A. course, semester, and your exact subject syllabus.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-base flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Preview & Checkout Securely</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Read authentic sample page previews, apply student discount promo code, and pay seamlessly via Razorpay / UPI.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-base flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Download & Ace Your Exam</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instant PDF unlock on your student account with lifetime re-download guarantee on any mobile or laptop.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
