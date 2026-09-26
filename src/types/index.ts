export type UserRole = 'customer' | 'admin' | 'super_admin';

export interface User {
  uid: string;
  fullName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  role: UserRole;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  code: string;
  logo?: string;
  description?: string;
  state: string;
  isActive: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string; // e.g. B.A. (Bachelor of Arts), B.A. (Hons), B.Com, etc.
  slug: string;
  code: string;
  universityId: string;
  durationYears: number;
  totalSemesters: number;
  isActive: boolean;
  createdAt: string;
}

export interface Semester {
  id: string;
  name: string; // Semester 1, Semester 2, etc.
  number: number;
  courseId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string; // Political Science, History, Sociology, etc.
  code: string;
  slug: string;
  courseId: string;
  semesterId: string;
  universityId?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface Product {
  productId: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number; // in INR ₹
  compareAtPrice?: number;
  thumbnail: string;
  previewImages: string[]; // watermarked 3-5 pages preview
  pdfFileKey: string;
  universityId: string;
  courseId: string;
  semesterId: string;
  subjectId: string;
  categoryId?: string;
  language: string; // e.g. "English", "Hindi", "Bilingual"
  pages: number;
  fileSize: string; // e.g. "4.8 MB"
  edition: string; // e.g. "2026 Revised CBCS/NEP Edition"
  author: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  salesCount: number;
  viewCount: number;
  rating?: number;
  ratingCount?: number;
  sampleTopics?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number; // always 1 for digital products
}

export type OrderStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled' | 'refunded';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  thumbnail: string;
  subjectName?: string;
  universityName?: string;
}

export interface Order {
  orderId: string;
  id?: string;
  orderNumber: string; // BS-YYYYMMDD-XXXXXX
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  currency: string; // 'INR'
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface Purchase {
  purchaseId: string;
  id?: string;
  userId: string;
  productId: string;
  orderId: string;
  paymentId?: string;
  productTitle: string;
  thumbnail: string;
  subjectName: string;
  universityName: string;
  purchasedAt: string;
  status: 'active' | 'revoked';
}

export interface Payment {
  paymentId: string;
  orderId: string;
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface DownloadLog {
  downloadId: string;
  userId: string;
  productId: string;
  orderId: string;
  timestamp: string;
  ipHash?: string;
  userAgent?: string;
}

export interface Coupon {
  couponCode: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumAmount: number;
  maximumDiscount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

export interface Review {
  reviewId: string;
  id?: string;
  userId: string;
  userName: string;
  productId: string;
  orderId: string;
  rating: number; // 1-5
  comment: string;
  status: 'approved' | 'pending' | 'hidden';
  createdAt: string;
}

export interface Notification {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'system' | 'promotion';
  isRead: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  supportPhone?: string;
  announcementText?: string;
  showAnnouncement: boolean;
  maintenanceMode: boolean;
  allowRegistrations?: boolean;
  currency: string;
  razorpayTestMode: boolean;
  aboutText?: string;
  digitalProductNotice?: string;
  refundPolicySummary?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'replied' | 'archived';
}
