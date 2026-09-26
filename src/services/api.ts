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

const FALLBACK_UNIVERSITIES: University[] = [
  { id: 'univ-du', name: 'Delhi University (DU)', slug: 'delhi-university', code: 'DU', state: 'New Delhi', logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&h=200&fit=crop&q=80', description: 'University of Delhi, recognized for prestigious undergraduate arts, humanities, and social sciences programs.', isActive: true, createdAt: new Date().toISOString() },
  { id: 'univ-mu', name: 'University of Mumbai (MU)', slug: 'mumbai-university', code: 'MU', state: 'Maharashtra', logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop&q=80', description: 'One of the oldest premier universities in India offering diverse B.A. curriculum patterns.', isActive: true, createdAt: new Date().toISOString() },
  { id: 'univ-pu', name: 'Panjab University (PU)', slug: 'panjab-university', code: 'PU', state: 'Chandigarh', logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&h=200&fit=crop&q=80', description: 'Renowned university known for deep academic scholarship across social sciences and humanities.', isActive: true, createdAt: new Date().toISOString() },
  { id: 'univ-cu', name: 'University of Calcutta (CU)', slug: 'calcutta-university', code: 'CU', state: 'West Bengal', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=200&fit=crop&q=80', description: 'Heritage university with comprehensive arts and literature curriculum.', isActive: true, createdAt: new Date().toISOString() },
  { id: 'univ-sppu', name: 'Savitribai Phule Pune University (SPPU)', slug: 'pune-university', code: 'SPPU', state: 'Maharashtra', logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=200&fit=crop&q=80', description: 'Leading university known for progressive arts and modern interdisciplinary studies.', isActive: true, createdAt: new Date().toISOString() },
];

const FALLBACK_COURSES: Course[] = [
  { id: 'course-ba-prog', name: 'B.A. (Programme)', slug: 'ba-programme', code: 'BAPROG', universityId: 'univ-du', durationYears: 3, totalSemesters: 6, isActive: true, createdAt: new Date().toISOString() },
  { id: 'course-ba-polsci', name: 'B.A. (Hons) Political Science', slug: 'ba-hons-political-science', code: 'BAPOL', universityId: 'univ-du', durationYears: 3, totalSemesters: 6, isActive: true, createdAt: new Date().toISOString() },
  { id: 'course-ba-history', name: 'B.A. (Hons) History', slug: 'ba-hons-history', code: 'BAHIST', universityId: 'univ-du', durationYears: 3, totalSemesters: 6, isActive: true, createdAt: new Date().toISOString() },
  { id: 'course-ba-mu', name: 'B.A. (Arts General) Mumbai', slug: 'ba-arts-mumbai', code: 'MUBARTS', universityId: 'univ-mu', durationYears: 3, totalSemesters: 6, isActive: true, createdAt: new Date().toISOString() },
  { id: 'course-ba-pu', name: 'B.A. General Panjab Univ', slug: 'ba-general-pu', code: 'PUBARTS', universityId: 'univ-pu', durationYears: 3, totalSemesters: 6, isActive: true, createdAt: new Date().toISOString() },
];

const FALLBACK_SEMESTERS: Semester[] = [
  { id: 'sem-1', name: 'Semester 1', number: 1, courseId: 'course-ba-prog', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sem-2', name: 'Semester 2', number: 2, courseId: 'course-ba-prog', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sem-3', name: 'Semester 3', number: 3, courseId: 'course-ba-prog', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sem-4', name: 'Semester 4', number: 4, courseId: 'course-ba-prog', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sem-5', name: 'Semester 5', number: 5, courseId: 'course-ba-prog', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sem-6', name: 'Semester 6', number: 6, courseId: 'course-ba-prog', isActive: true, createdAt: new Date().toISOString() },
];

const FALLBACK_SUBJECTS: Subject[] = [
  { id: 'sub-poltheory', name: 'Introduction to Political Theory', code: 'POL-101', slug: 'introduction-to-political-theory', courseId: 'course-ba-prog', semesterId: 'sem-1', universityId: 'univ-du', description: 'Foundations of political theory, democracy, liberty, equality, justice and rights under UGC CBCS/NEP syllabus.', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sub-ancient-hist', name: 'History of India from Earliest Times up to c. 300 CE', code: 'HIST-101', slug: 'ancient-indian-history-earliest-300ce', courseId: 'course-ba-prog', semesterId: 'sem-1', universityId: 'univ-du', description: 'Prehistoric cultures, Indus valley civilization, Vedic age, Mauryan empire and socio-economic formations.', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sub-microecon', name: 'Principles of Microeconomics - I', code: 'ECO-101', slug: 'principles-of-microeconomics-1', courseId: 'course-ba-prog', semesterId: 'sem-1', universityId: 'univ-du', description: 'Demand-supply analysis, consumer theory, elasticity, production functions, cost curves, and competitive markets.', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sub-ind-gov', name: 'Indian Government & Politics', code: 'POL-201', slug: 'indian-government-and-politics', courseId: 'course-ba-prog', semesterId: 'sem-2', universityId: 'univ-du', description: 'Constitutional development, fundamental rights, directive principles, judiciary, federalism, caste and regional politics in India.', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sub-medieval-hist', name: 'History of India c. 300 to 1206 CE', code: 'HIST-201', slug: 'medieval-indian-history-300-1206', courseId: 'course-ba-prog', semesterId: 'sem-2', universityId: 'univ-du', description: 'Guptas, Harsha, regional kingdoms, agrarian expansion, temple economy, and early medieval transitions.', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sub-sociology-intro', name: 'Introduction to Sociology', code: 'SOC-101', slug: 'introduction-to-sociology', courseId: 'course-ba-mu', semesterId: 'sem-1', universityId: 'univ-mu', description: 'Sociological imagination, social structure, culture, institutions, stratification, social control and social change.', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sub-pub-admin', name: 'Public Administration: Concepts & Principles', code: 'PADM-301', slug: 'public-administration-concepts', courseId: 'course-ba-pu', semesterId: 'sem-3', universityId: 'univ-pu', description: 'Classical, human relations and bureaucratic administrative theories, decision making, accountability, and governance.', isActive: true, createdAt: new Date().toISOString() },
  { id: 'sub-intl-relations', name: 'Themes in Comparative Political Theory & Global Politics', code: 'POL-501', slug: 'themes-comparative-political-theory', courseId: 'course-ba-polsci', semesterId: 'sem-5', universityId: 'univ-du', description: 'Post-Cold War order, globalization, security, environment, multilateral organizations, and non-Western perspectives.', isActive: true, createdAt: new Date().toISOString() },
];

const FALLBACK_PRODUCTS: any[] = [
  {
    productId: 'prod-poltheory-sem1',
    id: 'prod-poltheory-sem1',
    title: 'Political Theory Complete Exam Notes (CBCS/NEP 2026)',
    slug: 'political-theory-complete-exam-notes-sem1',
    shortDescription: 'High-yield exam revision guide & solved previous 7-year questions specifically crafted to clear backlogs.',
    description: 'Comprehensive, point-wise study material covering all units of Introduction to Political Theory for Delhi University & central university B.A. Semester 1.',
    price: 149,
    compareAtPrice: 299,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=800&fit=crop&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=800&auto=format&fit=crop&q=80',
    ],
    pdfFileKey: 'products/prod-poltheory-sem1/original.pdf',
    universityId: 'univ-du',
    courseId: 'course-ba-prog',
    semesterId: 'sem-1',
    subjectId: 'sub-poltheory',
    language: 'English',
    authorName: 'Prof. R.K. Sharma',
    authorBio: 'Senior Academician, Delhi University',
    ratingAverage: 4.9,
    ratingCount: 124,
    salesCount: 1850,
    filePageCount: 84,
    fileFormat: 'PDF',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    universityName: 'Delhi University (DU)',
    courseName: 'B.A. (Programme)',
    semesterName: 'Semester 1',
    subjectName: 'Introduction to Political Theory',
  },
  {
    productId: 'prod-ancient-hist-sem1',
    id: 'prod-ancient-hist-sem1',
    title: 'Ancient Indian History (Earliest Times to 300 CE) Master Guide',
    slug: 'ancient-indian-history-earliest-300ce-guide',
    shortDescription: 'Detailed timelines, map diagrams, and solved exam questions for B.A. History Semester 1.',
    description: 'Master ancient Indian history with structured notes covering Indus Valley Civilization, Vedic Period, Rise of Mahajanapadas, Mauryan Empire, and Ashoka\'s Dhamma.',
    price: 199,
    compareAtPrice: 349,
    thumbnail: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&h=800&fit=crop&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=800&auto=format&fit=crop&q=80',
    ],
    pdfFileKey: 'products/prod-ancient-hist-sem1/original.pdf',
    universityId: 'univ-du',
    courseId: 'course-ba-prog',
    semesterId: 'sem-1',
    subjectId: 'sub-ancient-hist',
    language: 'English',
    authorName: 'Dr. Meenakshi Sundaram',
    authorBio: 'Department of History, DU',
    ratingAverage: 4.8,
    ratingCount: 98,
    salesCount: 1420,
    filePageCount: 112,
    fileFormat: 'PDF',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    universityName: 'Delhi University (DU)',
    courseName: 'B.A. (Programme)',
    semesterName: 'Semester 1',
    subjectName: 'History of India up to 300 CE',
  },
  {
    productId: 'prod-ind-gov-sem2',
    id: 'prod-ind-gov-sem2',
    title: 'Indian Government & Politics - Solved 7-Year Papers & Revision Notes',
    slug: 'indian-government-politics-solved-papers-sem2',
    shortDescription: 'Constitutional framework, Fundamental Rights, Judiciary debates & Electoral politics simplified.',
    description: 'Detailed analysis of Indian Constitution, Parliamentary democracy, Supreme Court landmark judgements, Federalism, and Party system in India.',
    price: 179,
    compareAtPrice: 299,
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=800&fit=crop&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    ],
    pdfFileKey: 'products/prod-ind-gov-sem2/original.pdf',
    universityId: 'univ-du',
    courseId: 'course-ba-prog',
    semesterId: 'sem-2',
    subjectId: 'sub-ind-gov',
    language: 'English',
    authorName: 'Dr. Alok Verma',
    authorBio: 'Political Analyst & DU Educator',
    ratingAverage: 4.9,
    ratingCount: 156,
    salesCount: 2100,
    filePageCount: 96,
    fileFormat: 'PDF',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    universityName: 'Delhi University (DU)',
    courseName: 'B.A. (Programme)',
    semesterName: 'Semester 2',
    subjectName: 'Indian Government & Politics',
  },
  {
    productId: 'prod-sociology-sem1',
    id: 'prod-sociology-sem1',
    title: 'Introduction to Sociology - Mumbai University Exam Pack',
    slug: 'introduction-to-sociology-mumbai-university',
    shortDescription: 'Culture, Social Structure, Stratification & Institutions notes for MU B.A. Arts.',
    description: 'Specially compiled for Mumbai University B.A. Semester 1 students. Includes concepts of Weber, Durkheim, Marx, and Indian Sociological traditions.',
    price: 149,
    compareAtPrice: 249,
    thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=800&fit=crop&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
    ],
    pdfFileKey: 'products/prod-sociology-sem1/original.pdf',
    universityId: 'univ-mu',
    courseId: 'course-ba-mu',
    semesterId: 'sem-1',
    subjectId: 'sub-sociology-intro',
    language: 'English',
    authorName: 'Prof. Anjali Kulkarni',
    authorBio: 'Sociology Department, St. Xavier\'s Mumbai',
    ratingAverage: 4.7,
    ratingCount: 82,
    salesCount: 940,
    filePageCount: 78,
    fileFormat: 'PDF',
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    universityName: 'University of Mumbai (MU)',
    courseName: 'B.A. (Arts General)',
    semesterName: 'Semester 1',
    subjectName: 'Introduction to Sociology',
  },
];

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
      const data = await res.json();
      if (data.universities?.length) return data;
      return { universities: FALLBACK_UNIVERSITIES, courses: FALLBACK_COURSES, semesters: FALLBACK_SEMESTERS, subjects: FALLBACK_SUBJECTS };
    } catch (err) {
      console.warn('getHierarchy fetch error:', err);
      return { universities: FALLBACK_UNIVERSITIES, courses: FALLBACK_COURSES, semesters: FALLBACK_SEMESTERS, subjects: FALLBACK_SUBJECTS };
    }
  },

  async getUniversities(): Promise<University[]> {
    try {
      const res = await fetch(`${API_BASE}/universities`);
      if (!res.ok) throw new Error('Failed to fetch universities');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_UNIVERSITIES;
    } catch (err) {
      console.warn('getUniversities fetch error:', err);
      return FALLBACK_UNIVERSITIES;
    }
  },

  async getCourses(universityId?: string): Promise<Course[]> {
    try {
      const url = universityId ? `${API_BASE}/courses?universityId=${universityId}` : `${API_BASE}/courses`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_COURSES;
    } catch (err) {
      console.warn('getCourses fetch error:', err);
      return FALLBACK_COURSES;
    }
  },

  async getSemesters(courseId?: string): Promise<Semester[]> {
    try {
      const url = courseId ? `${API_BASE}/semesters?courseId=${courseId}` : `${API_BASE}/semesters`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch semesters');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_SEMESTERS;
    } catch (err) {
      console.warn('getSemesters fetch error:', err);
      return FALLBACK_SEMESTERS;
    }
  },

  async getSubjects(params?: { courseId?: string; semesterId?: string; universityId?: string }): Promise<Subject[]> {
    try {
      const qs = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/subjects?${qs}`);
      if (!res.ok) throw new Error('Failed to fetch subjects');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_SUBJECTS;
    } catch (err) {
      console.warn('getSubjects fetch error:', err);
      return FALLBACK_SUBJECTS;
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
      const data = await res.json();
      if (data.products && data.products.length > 0) return data;
      return { products: FALLBACK_PRODUCTS, total: FALLBACK_PRODUCTS.length, page: 1, totalPages: 1 };
    } catch (err) {
      console.warn('getProducts fetch error:', err);
      return { products: FALLBACK_PRODUCTS, total: FALLBACK_PRODUCTS.length, page: 1, totalPages: 1 };
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products/featured`);
      if (!res.ok) throw new Error('Failed to fetch featured');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_PRODUCTS;
    } catch {
      return FALLBACK_PRODUCTS;
    }
  },

  async getProductBySlug(slug: string): Promise<Product & { university?: University; course?: Course; semester?: Semester; subject?: Subject; reviews?: Review[] }> {
    try {
      const res = await fetch(`${API_BASE}/products/${slug}`);
      const json = await res.json();
      if (res.ok && json && json.slug) return json;
    } catch (e) {
      console.warn('getProductBySlug fetch error:', e);
    }
    const found = FALLBACK_PRODUCTS.find((p) => p.slug === slug || p.productId === slug) || FALLBACK_PRODUCTS[0];
    return {
      ...found,
      university: FALLBACK_UNIVERSITIES.find((u) => u.id === found.universityId),
      course: FALLBACK_COURSES.find((c) => c.id === found.courseId),
      semester: FALLBACK_SEMESTERS.find((s) => s.id === found.semesterId),
      subject: FALLBACK_SUBJECTS.find((sub) => sub.id === found.subjectId),
      reviews: [],
    };
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
