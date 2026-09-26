import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppliedCoupon {
  couponCode: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  cartBump: number;
  appliedCoupon: AppliedCoupon | null;
  addToCart: (product: Product) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('backlog_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartBump, setCartBump] = useState<number>(0);

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    try {
      const saved = localStorage.getItem('backlog_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('backlog_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('backlog_applied_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('backlog_applied_coupon');
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon]);

  const isInCart = (productId: string): boolean => {
    return items.some((item) => item.product.productId === productId);
  };

  const addToCart = (product: Product): { success: boolean; message: string } => {
    if (isInCart(product.productId)) {
      return { success: false, message: 'This study material is already in your cart.' };
    }
    // For digital products, quantity is always 1 (PRD Section 21)
    setItems((prev) => [...prev, { product, quantity: 1 }]);
    setCartBump(Date.now()); // Trigger animated bump
    return { success: true, message: `Added "${product.title}" to cart!` };
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.productId !== productId));
    if (items.length <= 1) {
      setAppliedCoupon(null);
    }
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price, 0);

  let discount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
    discount = Math.min(discount, subtotal);
  }

  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter a coupon code.' };
    }
    if (items.length === 0) {
      return { success: false, message: 'Your cart is empty. Add study materials before applying a coupon.' };
    }

    try {
      const res = await api.validateCoupon(code.trim(), items);
      if (res.valid) {
        setAppliedCoupon({
          couponCode: res.couponCode,
          discountType: res.discountType,
          discountValue: res.discountValue,
          discountAmount: res.discountAmount,
        });
        return { success: true, message: `Coupon "${res.couponCode}" applied successfully! You saved ₹${res.discountAmount}.` };
      }
      return { success: false, message: res.error || 'Invalid coupon code.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to apply coupon.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.length,
        subtotal,
        discount,
        total,
        cartBump,
        appliedCoupon,
        addToCart,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
