import React, { useState, useEffect } from 'react';
import { CustomerLayout } from './CustomerLayout';
import { api } from '../../services/api';
import { ShoppingCart } from 'lucide-react';
import { Order } from '../../types';

export const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyOrders()
      .then((res) => setOrders(res.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <CustomerLayout activeTab="orders">
      <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Order History</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review all your Razorpay transactions and order status details.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
            {orders.length} Order{orders.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-100 dark:bg-slate-750 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your completed purchases will show here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.orderId}
                className="p-5 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/90 dark:border-slate-700 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Order #{ord.orderNumber}</span>
                      <span
                        className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                            : ord.paymentStatus === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {ord.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(ord.createdAt).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">₹{ord.total}</div>
                    <div className="text-[10px] text-slate-400">Razorpay ID: {ord.razorpayPaymentId || ord.razorpayOrderId || 'Pending'}</div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-md">• {item.title}</span>
                      <span className="text-slate-600 dark:text-slate-400 font-bold shrink-0">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                {ord.discount > 0 && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex justify-between pt-1">
                    <span>Coupon Applied ({ord.couponCode})</span>
                    <span>-₹{ord.discount}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
