import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { api } from '../../services/api';
import { Order } from '../../types';
import { ShoppingCart, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    api.getAdminOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newPaymentStatus: string) => {
    if (!window.confirm(`Change order payment status to ${newPaymentStatus.toUpperCase()}? This will update access.`)) return;
    try {
      await api.updateOrderStatus(orderId, {
        status: newPaymentStatus,
        paymentStatus: newPaymentStatus,
      });
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.paymentStatus === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout activeTab="orders">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Orders & Payment Transactions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review Razorpay payments, customer details, and access fulfillment.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order or email..."
                className="text-xs p-2.5 pl-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-bold p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl cursor-pointer"
            >
              <option value="all" className="dark:bg-slate-800">All Statuses</option>
              <option value="paid" className="dark:bg-slate-800">Paid</option>
              <option value="pending" className="dark:bg-slate-800">Pending</option>
              <option value="failed" className="dark:bg-slate-800">Failed</option>
              <option value="refunded" className="dark:bg-slate-800">Refunded</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Order Details</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredOrders.map((ord) => (
                <tr key={ord.orderId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 dark:text-white">#{ord.orderNumber}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{ord.customerName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{ord.customerEmail}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-700 dark:text-slate-300 font-medium">
                      {ord.items.length} Product{ord.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      {ord.items.map((i) => i.title).join(', ')}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    <div>₹{ord.total}</div>
                    {ord.discount > 0 && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Coupon: -₹{ord.discount}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                          : ord.paymentStatus === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {ord.paymentStatus.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={ord.paymentStatus}
                      onChange={(e) => handleStatusChange(ord.orderId, e.target.value)}
                      className="text-[11px] font-bold p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg cursor-pointer"
                    >
                      <option value="paid" className="dark:bg-slate-800">Set Paid</option>
                      <option value="pending" className="dark:bg-slate-800">Set Pending</option>
                      <option value="failed" className="dark:bg-slate-800">Set Failed</option>
                      <option value="refunded" className="dark:bg-slate-800">Set Refunded</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
