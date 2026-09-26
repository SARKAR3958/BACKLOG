import React, { useState, useEffect, useRef } from 'react';
import { useRouter, Link } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { setupRealtimePresence } from '../../services/firebase';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  FileText,
  LogOut,
  Settings,
  Sparkles,
  GraduationCap,
  Sun,
  Moon,
  Flame,
  BookOpen,
  Layers,
  ArrowRight,
  Home,
  Info,
  Mail,
} from 'lucide-react';

/**
 * Main Navbar Component
 * 
 * Features:
 * - Live student presence indicator powered by Firebase RTDB
 * - Responsive desktop navigation bar with single-line layout
 * - Dark & Light mode switcher with dynamic 360-degree rotational glow animation
 * - Live autocomplete search with instant product & university suggestion links
 * - Modern spring-animated mobile drawer with quick navigation & explore pills
 */
export const Navbar: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, total } = useCart();
  const { theme, toggleTheme } = useTheme();

  // Component UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [liveLearnerCount, setLiveLearnerCount] = useState(148);
  const [themeAnimKey, setThemeAnimKey] = useState(0);

  // References for outside-click listeners
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 1. Realtime Active Learners Presence via Firebase RTDB
  useEffect(() => {
    const unsubscribe = setupRealtimePresence((count) => {
      setLiveLearnerCount(count);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // 2. Click outside handler to dismiss dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. Reset mobile menu whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [currentPath]);

  // 4. Debounced Search Autocomplete
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.getAutocomplete(searchQuery);
        setSuggestions(res.suggestions || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setMobileMenuOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle Theme Toggle with explicit animation trigger
  const handleThemeClick = () => {
    setThemeAnimKey((prev) => prev + 1);
    toggleTheme();
  };

  // Main Desktop Navigation Links
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'All', href: '/shop' },
    { label: 'Universities', href: '/universities' },
    { label: 'Semesters', href: '/semesters' },
    { label: 'Subjects', href: '/subjects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const pathnameOnly = currentPath.split('?')[0];

  return (
    <header className="sticky top-0 z-50 transition-colors duration-200 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 shadow-xs backdrop-blur-md">
      {/* Top Live Announcement Bar */}
      <div className="bg-slate-950 text-slate-100 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded tracking-wide shrink-0 animate-pulse">
              <Flame className="w-3 h-3 fill-slate-950 stroke-none" />
              <span>LIVE</span>
            </span>
            <span className="hidden md:inline text-slate-200">
              <strong className="text-amber-300 font-bold">{liveLearnerCount} students</strong> preparing for B.A. exams right now. Use code{' '}
              <strong className="text-amber-300">FIRST50</strong> for ₹50 off!
            </span>
            <span className="md:hidden text-slate-200 truncate">
              <strong className="text-amber-300">{liveLearnerCount} live students</strong> • Code <strong className="text-amber-300">FIRST50</strong>
            </span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 text-slate-400 text-[11px] shrink-0 font-medium">
            <Link to="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <span className="text-slate-700">|</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 lg:gap-5">
          {/* Brand Logo with 'PREPARE SMARTER' Subtitle */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <div className="font-black text-lg sm:text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                BACKLOG <span className="text-indigo-600 dark:text-indigo-400">SAVER</span>
              </div>
              <p className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
                Prepare Smarter
              </p>
            </div>
          </Link>

          {/* Desktop Global Search Bar */}
          <div ref={searchRef} className="hidden lg:block flex-1 max-w-md xl:max-w-lg relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                placeholder="Search notes by subject, university, semester..."
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl pl-9 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-700/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Suggestions
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setShowSuggestions(false);
                        if (item.type === 'product') {
                          navigate(`/product/${item.slug}`);
                        } else if (item.type === 'subject') {
                          navigate(`/shop?search=${encodeURIComponent(item.title)}`);
                        } else {
                          navigate(`/shop?universityId=${item.id}`);
                        }
                      }}
                      className="w-full text-left p-3 hover:bg-indigo-50/70 dark:hover:bg-slate-700/60 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.subtitle}</div>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSearchSubmit}
                  className="w-full text-center py-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/40 border-t border-slate-100 dark:border-slate-700 cursor-pointer"
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            )}
          </div>

          {/* Desktop Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs xl:text-sm font-bold text-slate-600 dark:text-slate-300 shrink-0 whitespace-nowrap">
            {navLinks.map((link) => {
              const active = pathnameOnly === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-2.5 xl:px-3 py-2 rounded-xl transition-all duration-150 ${
                    active
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-black shadow-2xs'
                      : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Theme toggle, Desktop Account, Mobile Hamburger) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Toggle Button with animated switch effect */}
            <button
              type="button"
              onClick={handleThemeClick}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-all active:scale-90 cursor-pointer overflow-hidden"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <div key={`${theme}-${themeAnimKey}`} className="animate-theme-switch flex items-center justify-center">
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </div>
            </button>

            {/* Desktop Account Dropdown / Auth Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              {isAuthenticated ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 border border-slate-200/90 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
                  >
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.fullName} className="w-7 h-7 rounded-lg object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {user?.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                      {user?.fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-profile-dropdown">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{user?.fullName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              user?.role === 'admin' || user?.role === 'super_admin'
                                ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Student'}
                          </span>
                        </div>
                      </div>

                      <div className="py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                        <Link
                          to="/account/purchases"
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-indigo-50 dark:hover:bg-slate-800 font-bold text-indigo-600 dark:text-indigo-400 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> My Purchases (PDFs)
                        </Link>
                        <Link
                          to="/account/orders"
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 text-slate-400" /> My Orders
                        </Link>
                        <Link
                          to="/account/profile"
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" /> Profile & Security
                        </Link>

                        {isAdmin && (
                          <>
                            <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                            <Link
                              to="/admin"
                              className="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold transition-colors"
                            >
                              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Admin Control Panel
                            </Link>
                          </>
                        )}

                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-left cursor-pointer transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm shadow-indigo-600/30 cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-500 animate-in spin-in-90 duration-200" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Modern Spring-Animated Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            animation: 'menuDropdownAnim 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
          className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto"
        >
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search study material..."
              className="w-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </form>

          {/* TOP SECTION: HOME, ABOUT & CONTACT BUTTONS */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Quick Navigation
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <Link
                to="/"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4 mb-1 text-indigo-600 dark:text-indigo-400" />
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-900/60 hover:bg-purple-100 dark:hover:bg-purple-900/80 transition-all cursor-pointer"
              >
                <Info className="w-4 h-4 mb-1 text-purple-600 dark:text-purple-400" />
                <span>About</span>
              </Link>
              <Link
                to="/contact"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 mb-1 text-emerald-600 dark:text-emerald-400" />
                <span>Contact</span>
              </Link>
            </div>
          </div>

          {/* EXPLORE MATERIALS SECTION: THEMED BUTTONS */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Explore Materials
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                to="/shop"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors border border-indigo-200/60 dark:border-indigo-900/60 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>All Notes</span>
              </Link>
              <Link
                to="/universities"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/80 transition-colors border border-purple-200/60 dark:border-purple-900/60 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Universities</span>
              </Link>
              <Link
                to="/semesters"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-colors border border-emerald-200/60 dark:border-emerald-900/60 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Semesters</span>
              </Link>
              <Link
                to="/subjects"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/80 transition-colors border border-amber-200/60 dark:border-amber-900/60 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Subjects</span>
              </Link>
            </div>
          </div>

          {/* Quick Cart Shortcut */}
          <Link
            to="/cart"
            className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200/60 dark:border-indigo-800/60 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Shopping Cart</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {itemCount === 0 ? 'Your cart is empty' : `${itemCount} item(s) • Total: ₹${total}`}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </Link>

          {/* Account / Auth Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Account & Student Portal
            </div>

            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl flex items-center justify-between border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                      {user?.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{user?.fullName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{user?.email}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {user?.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <Link
                    to="/account/purchases"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>My Downloads</span>
                  </Link>
                  <Link
                    to="/account/orders"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-slate-400" />
                    <span>My Orders</span>
                  </Link>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Open Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Account</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Quick Policy Links */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/faq" className="hover:text-indigo-600 dark:hover:text-indigo-400">FAQs</Link>
            <Link to="/refund-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400">Refunds</Link>
            <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms</Link>
            <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</Link>
          </div>
        </div>
      )}
    </header>
  );
};
