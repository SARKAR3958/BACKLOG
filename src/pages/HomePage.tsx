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
  ChevronRight,
  Eye,
  X,
  FileText,
  Clock,
  Sparkle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [heroSearch, setHeroSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Quick Preview Modal State
  const [previewProduct, setPreviewProduct] = useState<any | null>(null);

  // Interactive Score Booster Estimator state
  const [calcUniv, setCalcUniv] = useState('univ-du');
  const [calcSem, setCalcSem] = useState('sem-1');
  const [calcPrepDays, setCalcPrepDays] = useState(3);

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
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden font-sans">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-800">
        {/* Subtle geometric grid backdrop */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Hero Editorial Headlines */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Quiet unboxed text header */}
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-indigo-400 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Authorized CBCS & NEP 2026 Academic Notes</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">Delhi & State Universities</span>
              </div>

              {/* High-Character Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.1] text-white">
                Clear Your Backlogs. <br />
                <span className="font-serif-title text-indigo-300 font-normal underline decoration-indigo-500/50 underline-offset-8">
                  Graduate On Time.
                </span>
              </h1>

              {/* Clean Subtitle Prose */}
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
                Stop panicking before exam week. Access high-yield PDF study guides and solved 7-year exam frameworks structured by university professors to pass B.A. semester exams on your first attempt.
              </p>

              {/* Integrated Live Search Box */}
              <form onSubmit={handleSearchSubmit} className="pt-2 max-w-lg">
                <div className="relative flex items-center bg-slate-900/90 rounded-2xl shadow-2xl p-1.5 border border-slate-700/80 focus-within:border-indigo-500 transition-colors">
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search subject (e.g. Political Theory, History)..."
                    className="w-full px-3 py-2.5 text-xs sm:text-sm text-white bg-transparent focus:outline-none placeholder:text-slate-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    Search Catalog
                  </button>
                </div>
                {/* Clean unboxed tags below search */}
                <div className="pt-3 flex items-center gap-2 text-xs text-slate-400 overflow-x-auto no-scrollbar">
                  <span className="font-semibold text-slate-500 text-[11px] shrink-0">Popular:</span>
                  {['Delhi University', 'Mumbai Univ', 'Pol Sci Sem 1', 'Ancient History'].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => navigate(`/shop?search=${encodeURIComponent(tag.replace(/ \(.+\)/, ''))}`)}
                      className="text-slate-300 hover:text-indigo-400 transition-colors text-[11px] font-medium shrink-0 cursor-pointer"
                    >
                      {tag}
                      <span className="text-slate-700 ml-2">·</span>
                    </button>
                  ))}
                </div>
              </form>

              {/* Hero CTA Row */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" /> Explore All PDF Notes
                </Link>
                <Link
                  to="/universities"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" /> Browse Universities <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: High-Yield Featured Notes Spotlight Card */}
            <div className="lg:col-span-5 pt-6 lg:pt-0">
              <div className="relative bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Top Exam Edition</div>
                      <div className="text-[11px] text-slate-400">Delhi University CBCS/NEP</div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/60">
                    ★ 4.9 Rating
                  </span>
                </div>

                <div className="flex gap-4 items-start">
                  <img
                    src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=400&fit=crop&q=80"
                    alt="Political Theory Notes"
                    className="w-20 h-28 object-cover rounded-xl border border-slate-700 shadow-md shrink-0"
                  />
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="text-[11px] font-medium text-slate-400">POL-101 · B.A. Semester 1</div>
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
                      Political Theory Complete Exam Notes
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      Point-wise 15-mark essay models, Rawlsian Justice & Gramscian Hegemony solved.
                    </p>
                    <div className="pt-1 flex items-center gap-2 text-xs">
                      <span className="text-lg font-black text-white">₹149</span>
                      <span className="text-slate-500 line-through text-xs">₹299</span>
                      <span className="text-emerald-400 font-bold text-[11px]">50% OFF</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => navigate('/product/political-theory-complete-exam-notes-sem1')}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Get Instant PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (featuredProducts.length > 0) {
                        setPreviewProduct(featuredProducts[0]);
                      }
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" /> Preview Pages
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Metrics Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-300 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>100% University CBCS/NEP Syllabus Aligned</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>15-Mark Pre-Structured Model Answers</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Solved Previous 7-Year Exam Frameworks</span>
            </div>
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-purple-400 shrink-0" />
              <span>Instant Digital PDF Unlock & Re-downloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE BACKLOG PREPARATION ESTIMATOR WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900/20 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                Interactive Exam Preparation Estimator
              </span>
              <h2 className="text-xl sm:text-3xl font-bold font-display text-white mt-1">
                Will these notes clear my exam in 3 days?
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Calculate expected score boosting based on preparation time & targeted subject notes.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-slate-400 font-medium">Pass Guarantee Rate</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">98.4%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Control 1: Select University */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">1. Select University</label>
              <select
                value={calcUniv}
                onChange={(e) => setCalcUniv(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="univ-du">Delhi University (DU)</option>
                <option value="univ-mu">University of Mumbai (MU)</option>
                <option value="univ-pu">Panjab University (PU)</option>
                <option value="univ-cu">University of Calcutta (CU)</option>
              </select>
            </div>

            {/* Control 2: Select Semester */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">2. Select Semester</label>
              <select
                value={calcSem}
                onChange={(e) => setCalcSem(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="sem-1">Semester 1</option>
                <option value="sem-2">Semester 2</option>
                <option value="sem-3">Semester 3</option>
                <option value="sem-4">Semester 4</option>
                <option value="sem-5">Semester 5</option>
                <option value="sem-6">Semester 6</option>
              </select>
            </div>

            {/* Control 3: Days left before exam */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">3. Days Left Before Exam</label>
              <div className="flex items-center gap-2">
                {[1, 3, 7, 15].map((days) => (
                  <button
                    type="button"
                    key={days}
                    onClick={() => setCalcPrepDays(days)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                      calcPrepDays === days
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {days} {days === 1 ? 'Day' : 'Days'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Estimator Result Box */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xl shrink-0">
                ✓
              </div>
              <div>
                <div className="text-white text-sm font-bold">
                  Recommended Study Plan: {calcPrepDays <= 2 ? 'Express High-Yield Rapid Revision' : 'Standard Semester Mastery Pack'}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Covers all expected 15-mark essay questions + solved previous 7-year frameworks.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/shop?universityId=${calcUniv}&semesterId=${calcSem}`)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              Get Relevant Notes <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. UNIVERSITIES CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Curated Academic Frameworks
            </div>
            <h2 className="text-xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              Browse Notes by University
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Select your specific university to access tailored syllabus notes and previous exam paper solutions.
            </p>
          </div>
          <Link
            to="/universities"
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
          >
            All Universities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 skeleton-shimmer h-36" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {universities.slice(0, 6).map((univ) => (
              <div
                key={univ.id}
                onClick={() => navigate(`/shop?universityId=${univ.id}`)}
                className="group cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all duration-200 flex items-start gap-4 hover:shadow-lg"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-100 dark:border-slate-800 flex items-center justify-center font-black text-indigo-600 text-lg">
                  {univ.logo && !univ.logo.includes('calcutta') ? (
                    <img
                      src={univ.logo}
                      alt={univ.name}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span>{univ.code}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                      {univ.code}
                    </span>
                    <span className="text-[11px] text-slate-400">{univ.state}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {univ.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {univ.description}
                  </p>
                  <div className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    Explore Syllabus Notes <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. TOP FEATURED STUDY MATERIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Recommended Study Materials
            </div>
            <h2 className="text-xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              High-Yield Exam Revision Notes
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              Instant PDF downloads with point-wise model answers and solved past year questions.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
          >
            View Complete Store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 skeleton-shimmer h-80" />
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

      {/* 5. VERIFIED STUDENT REVIEWS & MARKS BOOSTER HALL OF FAME */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Verified Student Testimonials
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white">
              Cleared Backlogs in First Attempt
            </h2>
            <p className="text-slate-400 text-xs sm:text-base leading-relaxed">
              Read how undergraduate students used Backlog Saver exam notes to clear pending backlogs and boost semester GPAs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  +28 Marks Boost
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "Had a pending backlog in Political Theory Sem 1 for a full year. Studied Backlog Saver notes 2 days before the exam and scored 68/75! The 15-mark essay answer structures were exact."
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Rohan Verma</div>
                  <div className="text-slate-500 text-[11px]">Delhi University (DU SOL)</div>
                </div>
                <span className="text-slate-400 text-[11px]">B.A. Sem 1</span>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Cleared Backlog
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "Mumbai University Sociology paper was tough. These notes covered Durkheim and Weber in simple point-wise English. Downloaded instantly on mobile after UPI payment."
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Pooja Deshmukh</div>
                  <div className="text-slate-500 text-[11px]">University of Mumbai</div>
                </div>
                <span className="text-slate-400 text-[11px]">B.A. Sem 2</span>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  First Class Passed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "Ancient Indian History map diagrams and chronology timelines saved my semester. Highly recommended for any student struggling with lengthy textbooks!"
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Harpreet Singh</div>
                  <div className="text-slate-500 text-[11px]">Panjab University (PU)</div>
                </div>
                <span className="text-slate-400 text-[11px]">B.A. Sem 3</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK PREVIEW SAMPLE MODAL */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setPreviewProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{previewProduct.title}</h3>
                <div className="text-xs text-slate-400">Sample Page Preview · {previewProduct.filePageCount || 84} Pages PDF</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Sample Pages Watermarked</div>
              <div className="grid grid-cols-2 gap-3">
                {previewProduct.previewImages && previewProduct.previewImages.length > 0 ? (
                  previewProduct.previewImages.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Preview page ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-xl border border-slate-700 shadow-md"
                    />
                  ))
                ) : (
                  <div className="col-span-2 h-40 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-xs">
                    Sample pages loaded securely.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Full Unlocked Price: </span>
                <span className="text-lg font-black text-white">₹{previewProduct.price}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewProduct(null);
                    navigate(`/product/${previewProduct.slug}`);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Buy & Download Full PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

