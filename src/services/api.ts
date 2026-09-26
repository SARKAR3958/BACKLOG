import {
  User,
  Product,
  Order,
  Purchase,
  University,
  Course,
  Semester,
  Subject,
  Coupon,
  Review,
  SiteSettings,
  Notification,
  AuditLog,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('backlog_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async register(data: { fullName: string; email: string; password: string; confirmPassword: string; terms: boolean }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Registration failed');
    return json;
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    return json;
  },

  async googleLogin(data: { email: string; fullName?: string; photoURL?: string; uid?: string }) {
    const res = await fetch(`${API_BASE}/auth/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Google login failed');
    return json;
  },

  async verifyEmail(data: { token?: string; uid?: string }) {
    const res = await fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Email verification failed');
    return json;
  },

  async resendVerification(data: { email?: string; uid?: string }) {
    const res = await fetch(`${API_BASE}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to resend verification email');
    return json;
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Request failed');
    return json;
  },

  async resetPassword(token: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to reset password');
    return json;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to load user profile');
    return json;
  },

  async updateProfile(data: { fullName?: string; phone?: string; photoURL?: string }) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Profile update failed');
    return json;
  },

  // Hierarchy
  async getHierarchy(): Promise<{
    universities: University[];
    courses: Course[];
    semesters: Semester[];
    subjects: Subject[];
  }> {
    try {
      const res = await fetch(`${API_BASE}/hierarchy`);
      if (!res.ok) throw new Error('Failed to fetch hierarchy');
      return await res.json();
    } catch (err) {
      console.warn('getHierarchy fetch error:', err);
      return { universities: [], courses: [], semesters: [], subjects: [] };
    }
  },

  async getUniversities(): Promise<University[]> {
    try {
      const res = await fetch(`${API_BASE}/universities`);
      if (!res.ok) throw new Error('Failed to fetch universities');
      return await res.json();
    } catch (err) {
      console.warn('getUniversities fetch error:', err);
      return [];
    }
  },

  async getCourses(universityId?: string): Promise<Course[]> {
    try {
      const url = universityId ? `${API_BASE}/courses?universityId=${universityId}` : `${API_BASE}/courses`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch courses');
      return await res.json();
    } catch (err) {
      console.warn('getCourses fetch error:', err);
      return [];
    }
  },

  async getSemesters(courseId?: string): Promise<Semester[]> {
    try {
      const url = courseId ? `${API_BASE}/semesters?courseId=${courseId}` : `${API_BASE}/semesters`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch semesters');
      return await res.json();
    } catch (err) {
      console.warn('getSemesters fetch error:', err);
      return [];
    }
  },

  async getSubjects(params?: { courseId?: string; semesterId?: string; universityId?: string }): Promise<Subject[]> {
    try {
      const qs = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/subjects?${qs}`);
      if (!res.ok) throw new Error('Failed to fetch subjects');
      return await res.json();
    } catch (err) {
      console.warn('getSubjects fetch error:', err);
      return [];
    }
  },

  // Products
  async getProducts(params?: {
    search?: string;
    universityId?: string;
    courseId?: string;
    semesterId?: string;
    subjectId?: string;
    language?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: (Product & { universityName: string; courseName: string; semesterName: string; subjectName: string })[]; total: number; page: number; totalPages: number }> {
    try {
      const cleanParams: Record<string, string> = {};
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            cleanParams[k] = String(v);
          }
        });
      }
      const qs = new URLSearchParams(cleanParams).toString();
      const res = await fetch(`${API_BASE}/products?${qs}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('getProducts fetch error:', err);
      return { products: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products/featured`);
    return res.json();
  },

  async getProductBySlug(slug: string): Promise<Product & { university?: University; course?: Course; semester?: Semester; subject?: Subject; reviews?: Review[] }> {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Product not found');
    return json;
  },

  async getAutocomplete(query: string) {
    const res = await fetch(`${API_BASE}/products/search/autocomplete?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  // Coupons
  async validateCoupon(code: string, cartItems: any[]) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartItems }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Invalid coupon');
    return json;
  },

  // Orders & Payment
  async createOrder(data: {
    items: any[];
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    couponCode?: string;
  }): Promise<{ order: Order; razorpay: any }> {
    const res = await fetch(`${API_BASE}/orders/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Order creation failed');
    return json;
  },

  async verifyPayment(data: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
  }): Promise<{ success: boolean; order: Order; message: string }> {
    const res = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Payment verification failed');
    return json;
  },

  // Purchases & Secure Downloads
  async getMyPurchases(): Promise<{ purchases: Purchase[] }> {
    const res = await fetch(`${API_BASE}/purchases/my`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch purchases');
    return json;
  },

  async checkHasPurchased(productId: string): Promise<{ hasPurchased: boolean }> {
    const res = await fetch(`${API_BASE}/purchases/check/${productId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async generateDownloadToken(productId: string): Promise<{ downloadToken: string; expiresInMinutes: number; downloadUrl: string; filename: string }> {
    const res = await fetch(`${API_BASE}/purchases/generate-download-token`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Download generation failed');
    return json;
  },

  // Account
  async getMyOrders(): Promise<{ orders: Order[] }> {
    const res = await fetch(`${API_BASE}/account/orders`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch orders');
    return json;
  },

  async getAccountStats() {
    const res = await fetch(`${API_BASE}/account/stats`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getNotifications(): Promise<{ notifications: Notification[] }> {
    const res = await fetch(`${API_BASE}/account/notifications`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`${API_BASE}/account/notifications/${id}/read`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Reviews
  async submitReview(data: { productId: string; rating: number; comment: string }) {
    const res = await fetch(`${API_BASE}/reviews/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit review');
    return json;
  },

  // Contact & Settings
  async submitContact(data: { name: string; email: string; subject?: string; message: string }) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit message');
    return json;
  },

  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  // Admin APIs
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Unauthorized admin access');
    return json;
  },

  async getAdminProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async createAdminProduct(productData: any): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create product');
    return json;
  },

  async updateAdminProduct(id: string, updates: any): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update product');
    return json;
  },

  async deleteAdminProduct(id: string) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getAdminOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateOrderStatus(id: string, status: { status?: string; paymentStatus?: string }): Promise<Order> {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(status),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update order status');
    return json;
  },

  async getAdminUsers(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async toggleUserStatus(uid: string) {
    const res = await fetch(`${API_BASE}/admin/users/${uid}/toggle-status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getAdminCoupons(): Promise<Coupon[]> {
    const res = await fetch(`${API_BASE}/admin/coupons`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async createAdminCoupon(coupon: any): Promise<Coupon> {
    const res = await fetch(`${API_BASE}/admin/coupons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(coupon),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create coupon');
    return json;
  },

  async deleteAdminCoupon(code: string) {
    const res = await fetch(`${API_BASE}/admin/coupons/${code}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getAdminAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async resetDatabaseToSeed() {
    const res = await fetch(`${API_BASE}/admin/seed-reset`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};
