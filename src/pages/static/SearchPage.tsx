import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../../context/RouterContext';
import { api } from '../../services/api';
import { Search, X, BookOpen, Clock, ArrowRight } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { navigate } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('backlog_recent_searches');
      return s ? JSON.parse(s) : ['Political Theory', 'Microeconomics', 'Ancient History', 'Delhi University'];
    } catch {
      return ['Political Theory', 'Microeconomics', 'Ancient History', 'Delhi University'];
    }
  });

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.getAutocomplete(searchTerm);
        setSuggestions(res.suggestions || []);
      } catch (err) {
        console.error(err);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (termToSearch: string) => {
    const clean = termToSearch.trim();
    if (!clean) return;

    // Save to recents
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('backlog_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    navigate(`/shop?search=${encodeURIComponent(clean)}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Search Study Materials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Find point-wise revision notes by topic, subject code, semester, or university.
        </p>
      </div>

      {/* Main Search Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(searchTerm);
        }}
        className="relative"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g. Political Theory, B.A. Semester 1, DU History..."
          autoFocus
          className="w-full text-sm sm:text-base font-medium p-4 pl-12 pr-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none transition-colors"
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4.5 pointer-events-none" />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-4 top-3.5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Live Suggestions List */}
      {suggestions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-850">
            Matching Materials & Subjects
          </div>
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.type === 'product') {
                  navigate(`/product/${item.slug}`);
                } else if (item.type === 'subject') {
                  handleSearch(item.title);
                } else {
                  navigate(`/shop?universityId=${item.id}`);
                }
              }}
              className="w-full text-left p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                <div className="text-[11px] text-slate-400">{item.subtitle}</div>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {item.type}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Recent Searches & Popular Tags */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Recent Searches
          </span>
          {recentSearches.length > 0 && (
            <button
              onClick={() => {
                setRecentSearches([]);
                localStorage.removeItem('backlog_recent_searches');
              }}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline capitalize font-semibold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {recentSearches.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(s)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
