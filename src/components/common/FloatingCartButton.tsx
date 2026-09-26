import React, { useEffect, useState } from 'react';
import { useRouter, Link } from '../../context/RouterContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';

export const FloatingCartButton: React.FC = () => {
  const { currentPath } = useRouter();
  const { itemCount, total, cartBump } = useCart();
  const [bumping, setBumping] = useState(false);

  const path = currentPath.split('?')[0];

  // Trigger bounce & ring expansion when item is added
  useEffect(() => {
    if (cartBump > 0) {
      setBumping(true);
      const timer = setTimeout(() => setBumping(false), 900);
      return () => clearTimeout(timer);
    }
  }, [cartBump]);

  // Show on shopping / exploratory routes OR whenever user has added items to their cart
  const isShoppingRoute =
    path === '/' ||
    path === '/shop' ||
    path.startsWith('/product/') ||
    path === '/universities' ||
    path === '/semesters' ||
    path === '/subjects' ||
    path === '/search';

  const isExcluded =
    path.startsWith('/admin') ||
    path === '/cart' ||
    path === '/checkout' ||
    path === '/order-success' ||
    path === '/order-failed';

  if (isExcluded) return null;
  if (!isShoppingRoute && itemCount === 0) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 transition-transform duration-300 ${
        bumping ? 'scale-110 -translate-y-2' : 'scale-100'
      }`}
    >
      <Link
        to="/cart"
        className={`group relative flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-600 text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl border border-white/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          bumping
            ? 'ring-4 ring-indigo-400 shadow-indigo-500/60'
            : 'shadow-purple-600/35 floating-cart-glow'
        }`}
        aria-label="View Shopping Cart"
      >
        <div className="relative">
          <ShoppingCart
            className={`w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform ${
              bumping ? 'rotate-12 scale-125 text-amber-300' : 'group-hover:rotate-6'
            }`}
          />
          {itemCount > 0 ? (
            <span
              className={`absolute -top-2.5 -right-2.5 bg-amber-400 text-slate-950 font-black text-[11px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center shadow-md ${
                bumping ? 'scale-125 bg-amber-300' : 'animate-bounce'
              }`}
            >
              {itemCount}
            </span>
          ) : (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-600" />
          )}
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-100 opacity-90 leading-tight">
            {itemCount === 0 ? 'Study Cart' : `${itemCount} Study ${itemCount === 1 ? 'Pack' : 'Packs'}`}
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-white leading-tight">
            {itemCount === 0 ? 'View Cart' : `₹${total}`}
          </span>
        </div>

        <div className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors ml-1">
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </div>
      </Link>
    </div>
  );
};
