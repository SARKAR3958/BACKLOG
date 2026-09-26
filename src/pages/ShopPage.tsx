import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { Product, University, Course, Semester, Subject } from '../types';
import {
  Filter,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { queryParams, navigate } = useRouter();
  const { user } = useAuth();

  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Hierarchy Options
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Filter States initialized from URL params
  const [search, setSearch] = useState(queryParams.get('search') || '');
  const [selectedUniv, setSelectedUniv] = useState(queryParams.get('universityId') || '');
  const [selectedSemester, setSelectedSemester] = useState(queryParams.get('semesterId') || '');
  const [selectedSubject, setSelectedSubject] = useState(queryParams.get('subjectId') || '');
  const [selectedSort, setSelectedSort] = useState(queryParams.get('sort') || 'popular');
  const [minPrice, setMinPrice] = useState(queryParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(queryParams.get('maxPrice') || '');

  // Mobile Filter Drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // User's owned product IDs for duplicate purchase indicator
  const [userPurchasedIds, setUserPurchasedIds] = useState<Set<string>>(new Set());

  // Load user purchases if logged in
  useEffect(() => {
    if (user) {
      api.getMyPurchases().then((res) => {
        const ids = new Set(res.purchases.map((p) => p.productId));
        setUserPurchasedIds(ids);
      }).catch(console.error);
    } else {
      setUserPurchasedIds(new Set());
    }
  }, [user]);

  // Load hierarchy metadata
  useEffect(() => {
    async function loadHierarchy() {
      try {
        const [univs, crses, sems, subjs] = await Promise.all([
          api.getUniversities(),
          api.getCourses(),
          api.getSemesters(),
          api.getSubjects(),
        ]);
        setUniversities(univs);
        setCourses(crses);
        setSemesters(sems);
        setSubjects(subjs);
      } catch (err) {
        console.error('Failed to load hierarchy data:', err);
      }
    }
    loadHierarchy();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const res = await api.getProducts({
          search: search || undefined,
          universityId: selectedUniv || undefined,
          semesterId: selectedSemester || undefined,
          subjectId: selectedSubject || undefined,
          sort: selectedSort,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          limit: 30,
        });
        setProducts(res.products || []);
        setTotalProducts(res.total || 0);
      } catch (err) {
        console.error('Failed to fetch filtered products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilteredProducts();
  }, [search, selectedUniv, selectedSemester, selectedSubject, selectedSort, minPrice, maxPrice]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedUniv('');
    setSelectedSemester('');
    setSelectedSubject('');
    setSelectedSort('popular');
    setMinPrice('');
    setMaxPrice('');
    navigate('/shop');
  };

  const hasActiveFilters = Boolean(
    search || selectedUniv || selectedSemester || selectedSubject || minPrice || maxPrice
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 overflow-x-hidden">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Exam Notes Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">
            Explore Study Materials
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Browse point-wise revision notes and PYQ answer keys filtered by university syllabus.
          </p>
        </div>

        {/* Mobile Filter Trigger Button & Sort Dropdown */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto w-full sm:w-auto">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Filters {hasActiveFilters && '• Active'}</span>
          </button>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Releases</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated (4.9+)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
        {/* DESKTOP SIDEBAR FILTER */}
        <aside className="hidden lg:block w-72 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 space-y-6 shadow-xs shrink-0 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Filter Syllabus</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* Search filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Search Keywords</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Political Theory"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 pl-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* University Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">University</label>
              <select
                value={selectedUniv}
                onChange={(e) => setSelectedUniv(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs font-medium cursor-pointer"
              >
                <option value="">All Universities</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id} className="dark:bg-slate-800">
                    {u.name} ({u.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs font-medium cursor-pointer"
              >
                <option value="">All Semesters</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id} className="dark:bg-slate-800">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subject Discipline</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs font-medium cursor-pointer"
              >
                <option value="">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id} className="dark:bg-slate-800">
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2 text-center"
                />
                <span className="text-slate-400 text-xs">—</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2 text-center"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT CATALOG GRID WITH OVERLAY / SHIMMER LOADING */}
        <main className="flex-1 w-full min-w-0">
          {/* Active filter tags */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold">
              Showing <strong className="text-slate-900 dark:text-white font-extrabold">{products.length}</strong> study materials
              {totalProducts > 0 && ` of ${totalProducts}`}
            </span>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5">
                {search && (
                  <span className="bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    "{search}"
                    <button onClick={() => setSearch('')} className="cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedUniv && (
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    University
                    <button onClick={() => setSelectedUniv('')} className="cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSemester && (
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    Semester
                    <button onClick={() => setSelectedSemester('')} className="cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 relative">
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
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 sm:p-14 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">No Study Materials Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                No notes matched your specific filter combination. Try adjusting your university, semester, or price range.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  hasPurchased={userPurchasedIds.has(product.productId)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER MODAL / BOTTOM SHEET */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-5 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Filter Materials
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* University */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">University</label>
              <select
                value={selectedUniv}
                onChange={(e) => setSelectedUniv(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3"
              >
                <option value="">All Universities</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3"
              >
                <option value="">All Semesters</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject Discipline</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3"
              >
                <option value="">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-center"
                />
                <span className="text-slate-400 text-xs">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-center"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
