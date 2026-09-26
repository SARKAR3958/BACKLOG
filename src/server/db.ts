import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  University,
  Course,
  Semester,
  Subject,
  Product,
  Order,
  Purchase,
  Payment,
  DownloadLog,
  Coupon,
  Review,
  Notification,
  SiteSettings,
  AuditLog,
  ContactSubmission,
} from '../types';

interface DatabaseData {
  users: User[];
  universities: University[];
  courses: Course[];
  semesters: Semester[];
  subjects: Subject[];
  products: Product[];
  orders: Order[];
  purchases: Purchase[];
  payments: Payment[];
  downloads: DownloadLog[];
  coupons: Coupon[];
  reviews: Review[];
  notifications: Notification[];
  settings: SiteSettings;
  auditLogs: AuditLog[];
  contactSubmissions: ContactSubmission[];
  userPasswords: Record<string, string>; // uid -> hashedPassword
  verificationTokens: Record<string, string>; // token -> uid
  resetTokens: Record<string, { uid: string; expiresAt: number }>; // token -> { uid, expiresAt }
  downloadTokens: Record<string, { purchaseId: string; userId: string; productId: string; expiresAt: number }>;
}

function getDbFilePath(): string {
  const tmpPath = path.resolve('/tmp', '.backlog-db.json');
  if (fs.existsSync(tmpPath)) {
    return tmpPath;
  }
  const rootPath = path.resolve(process.cwd(), '.backlog-db.json');
  if (fs.existsSync(rootPath)) {
    return rootPath;
  }
  return tmpPath;
}

const DB_FILE_PATH = path.resolve(process.cwd(), '.backlog-db.json');

// Helper for hashing passwords
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_backlog_saver_salt_2026').digest('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function getInitialData(): DatabaseData {
  const adminUid = 'admin-user-001';
  const studentUid = 'student-user-001';
  const now = new Date().toISOString();

  const universities: University[] = [
    {
      id: 'univ-du',
      name: 'Delhi University (DU)',
      slug: 'delhi-university',
      code: 'DU',
      state: 'New Delhi',
      logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&h=200&fit=crop&q=80',
      description: 'University of Delhi, recognized for prestigious undergraduate arts, humanities, and social sciences programs.',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'univ-mu',
      name: 'University of Mumbai (MU)',
      slug: 'mumbai-university',
      code: 'MU',
      state: 'Maharashtra',
      logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop&q=80',
      description: 'One of the oldest premier universities in India offering diverse B.A. curriculum patterns.',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'univ-pu',
      name: 'Panjab University (PU)',
      slug: 'panjab-university',
      code: 'PU',
      state: 'Chandigarh',
      logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&h=200&fit=crop&q=80',
      description: 'Renowned university known for deep academic scholarship across social sciences and humanities.',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'univ-cu',
      name: 'University of Calcutta (CU)',
      slug: 'calcutta-university',
      code: 'CU',
      state: 'West Bengal',
      logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=200&fit=crop&q=80',
      description: 'Heritage university with comprehensive arts and literature curriculum.',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'univ-sppu',
      name: 'Savitribai Phule Pune University (SPPU)',
      slug: 'pune-university',
      code: 'SPPU',
      state: 'Maharashtra',
      logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=200&fit=crop&q=80',
      description: 'Leading university known for progressive arts and modern interdisciplinary studies.',
      isActive: true,
      createdAt: now,
    },
  ];

  const courses: Course[] = [
    {
      id: 'course-ba-prog',
      name: 'B.A. (Programme)',
      slug: 'ba-programme',
      code: 'BAPROG',
      universityId: 'univ-du',
      durationYears: 3,
      totalSemesters: 6,
      isActive: true,
      createdAt: now,
    },
    {
      id: 'course-ba-polsci',
      name: 'B.A. (Hons) Political Science',
      slug: 'ba-hons-political-science',
      code: 'BAPOL',
      universityId: 'univ-du',
      durationYears: 3,
      totalSemesters: 6,
      isActive: true,
      createdAt: now,
    },
    {
      id: 'course-ba-history',
      name: 'B.A. (Hons) History',
      slug: 'ba-hons-history',
      code: 'BAHIST',
      universityId: 'univ-du',
      durationYears: 3,
      totalSemesters: 6,
      isActive: true,
      createdAt: now,
    },
    {
      id: 'course-ba-mu',
      name: 'B.A. (Arts General) Mumbai',
      slug: 'ba-arts-mumbai',
      code: 'MUBARTS',
      universityId: 'univ-mu',
      durationYears: 3,
      totalSemesters: 6,
      isActive: true,
      createdAt: now,
    },
    {
      id: 'course-ba-pu',
      name: 'B.A. General Panjab Univ',
      slug: 'ba-general-pu',
      code: 'PUBARTS',
      universityId: 'univ-pu',
      durationYears: 3,
      totalSemesters: 6,
      isActive: true,
      createdAt: now,
    },
  ];

  const semesters: Semester[] = [
    { id: 'sem-1', name: 'Semester 1', number: 1, courseId: 'course-ba-prog', isActive: true, createdAt: now },
    { id: 'sem-2', name: 'Semester 2', number: 2, courseId: 'course-ba-prog', isActive: true, createdAt: now },
    { id: 'sem-3', name: 'Semester 3', number: 3, courseId: 'course-ba-prog', isActive: true, createdAt: now },
    { id: 'sem-4', name: 'Semester 4', number: 4, courseId: 'course-ba-prog', isActive: true, createdAt: now },
    { id: 'sem-5', name: 'Semester 5', number: 5, courseId: 'course-ba-prog', isActive: true, createdAt: now },
    { id: 'sem-6', name: 'Semester 6', number: 6, courseId: 'course-ba-prog', isActive: true, createdAt: now },
  ];

  const subjects: Subject[] = [
    {
      id: 'sub-poltheory',
      name: 'Introduction to Political Theory',
      code: 'POL-101',
      slug: 'introduction-to-political-theory',
      courseId: 'course-ba-prog',
      semesterId: 'sem-1',
      universityId: 'univ-du',
      description: 'Foundations of political theory, democracy, liberty, equality, justice and rights under UGC CBCS/NEP syllabus.',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'sub-ancient-hist',
      name: 'History of India from Earliest Times up to c. 300 CE',
      code: 'HIST-101',
      slug: 'ancient-indian-history-earliest-300ce',
      courseId: 'course-ba-prog',
      semesterId: 'sem-1',
      universityId: 'univ-du',
      description: 'Prehistoric cultures, Indus valley civilization, Vedic age, Mauryan empire and socio-economic formations.',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'sub-microecon',
      name: 'Principles of Microeconomics - I',
      code: 'ECO-101',
      slug: 'principles-of-microeconomics-1',
      courseId: 'course-ba-prog',
      semesterId: 'sem-1',
      universityId: 'univ-du',
      description: 'Demand-supply analysis, consumer theory, elasticity, production functions, cost curves, and competitive markets.',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'sub-ind-gov',
      name: 'Indian Government & Politics',
      code: 'POL-201',
      slug: 'indian-government-and-politics',
      courseId: 'course-ba-prog',
      semesterId: 'sem-2',
      universityId: 'univ-du',
      description: 'Constitutional development, fundamental rights, directive principles, judiciary, federalism, caste and regional politics in India.',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'sub-medieval-hist',
      name: 'History of India c. 300 to 1206 CE',
      code: 'HIST-201',
      slug: 'medieval-indian-history-300-1206',
      courseId: 'course-ba-prog',
      semesterId: 'sem-2',
      universityId: 'univ-du',
      description: 'Guptas, Harsha, regional kingdoms, agrarian expansion, temple economy, and early medieval transitions.',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'sub-sociology-intro',
      name: 'Introduction to Sociology',
      code: 'SOC-101',
      slug: 'introduction-to-sociology',
      courseId: 'course-ba-mu',
      semesterId: 'sem-1',
      universityId: 'univ-mu',
      description: 'Sociological imagination, social structure, culture, institutions, stratification, social control and social change.',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'sub-pub-admin',
      name: 'Public Administration: Concepts & Principles',
      code: 'PADM-301',
      slug: 'public-administration-concepts',
      courseId: 'course-ba-prog',
      semesterId: 'sem-3',
      universityId: 'univ-pu',
      description: 'Classical, human relations and bureaucratic administrative theories, decision making, accountability, and governance.',
      isActive: true,
      createdAt: now,
    },
    {
      id: 'sub-intl-relations',
      name: 'Themes in Comparative Political Theory & Global Politics',
      code: 'POL-501',
      slug: 'themes-comparative-political-theory',
      courseId: 'course-ba-polsci',
      semesterId: 'sem-5',
      universityId: 'univ-du',
      description: 'Post-Cold War order, globalization, security, environment, multilateral organizations, and non-Western perspectives.',
      isActive: true,
      createdAt: now,
    },
  ];

  const previewPagesSample = [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
  ];

  const products: Product[] = [
    {
      productId: 'prod-poltheory-sem1',
      title: 'Political Theory Complete Exam Notes (CBCS/NEP 2026)',
      slug: 'political-theory-complete-exam-notes-sem1',
      shortDescription: 'High-yield exam revision guide & solved previous 7-year questions specifically crafted to clear backlogs.',
      description: 'Comprehensive, point-wise study material covering all units of Introduction to Political Theory for Delhi University & central university B.A. Semester 1. Includes key debates (Rawlsian Justice, Berlin\'s Two Concepts of Liberty, Gramscian Hegemony, Feminist critique), 15 marks model answers, flowchart summaries, and expected exam questions for 2026.',
      price: 149,
      compareAtPrice: 299,
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=800&fit=crop&q=80',
      previewImages: previewPagesSample,
      pdfFileKey: 'products/prod-poltheory-sem1/original.pdf',
      universityId: 'univ-du',
      courseId: 'course-ba-prog',
      semesterId: 'sem-1',
      subjectId: 'sub-poltheory',
      language: 'English (Point-wise easy language)',
      pages: 124,
      fileSize: '5.2 MB',
      edition: '2026 Revised Exam Edition',
      author: 'Prof. R. K. Sharma & Editorial Board',
      tags: ['B.A.', 'Semester 1', 'Political Science', 'DU', 'Backlog Booster', 'Solved PYQs'],
      isPublished: true,
      isFeatured: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      salesCount: 342,
      viewCount: 1890,
      rating: 4.9,
      ratingCount: 88,
      sampleTopics: [
        'Unit 1: What is Politics & Theorizing the Political',
        'Unit 2: Traditions of Political Theory: Liberal, Marxist, Anarchist & Conservative',
        'Unit 3: Critical Perspectives: Feminist and Postmodern',
        'Unit 4: Liberty, Equality, Justice (John Rawls Theory)',
        'Unit 5: Rights, Democracy & Citizenship',
        'Special Section: 10 Sure-shot 15-Mark Questions with Model Answers',
      ],
    },
    {
      productId: 'prod-ancient-hist-sem1',
      title: 'Ancient Indian History up to 300 CE — Rapid Revision Booster',
      slug: 'ancient-indian-history-rapid-revision-booster',
      shortDescription: 'Master archaeological sources, Indus Valley, Mauryas & Guptas with chronological timelines & solved maps.',
      description: 'The ultimate survival and scoring guide for B.A. History Semester 1. Structured according to the latest university syllabus. Features clear comparative tables (Vedic vs Harappan), Mauryan administrative framework, Ashokan edicts analysis, and step-by-step 15-mark essay frameworks.',
      price: 129,
      compareAtPrice: 249,
      thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&h=800&fit=crop&q=80',
      previewImages: previewPagesSample,
      pdfFileKey: 'products/prod-ancient-hist-sem1/original.pdf',
      universityId: 'univ-du',
      courseId: 'course-ba-prog',
      semesterId: 'sem-1',
      subjectId: 'sub-ancient-hist',
      language: 'English',
      pages: 148,
      fileSize: '6.8 MB',
      edition: '2026 Edition',
      author: 'Dr. Ananya Sen (Ex-Faculty History DU)',
      tags: ['History', 'Ancient India', 'B.A. 1st Year', 'Semester 1', 'PYQ Solved'],
      isPublished: true,
      isFeatured: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      salesCount: 285,
      viewCount: 1420,
      rating: 4.8,
      ratingCount: 64,
      sampleTopics: [
        'Unit 1: Sources and Historiographical Interpretations',
        'Unit 2: Harappan Civilization: Origins, Extent, Urban Planning & Decline',
        'Unit 3: The Vedic Age: Early vs Later Vedic Transformations',
        'Unit 4: Janapadas, Mahajanapadas and Rise of Magadha',
        'Unit 5: Mauryan State, Economy, and Ashoka\'s Dhamma',
      ],
    },
    {
      productId: 'prod-microecon-sem1',
      title: 'Principles of Microeconomics — Diagram & Formula Guide',
      slug: 'principles-of-microeconomics-diagram-formula-guide',
      shortDescription: 'Clear mathematical backlogs with hand-drawn diagrams, elasticity step-by-step solving & theory notes.',
      description: 'Microeconomics is often the toughest obstacle for B.A. students facing backlogs. This study guide simplifies every complex diagram, consumer indifference curve, production isoquant, and monopoly pricing model into plain, easy-to-reproduce exam answers.',
      price: 169,
      compareAtPrice: 349,
      thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=800&fit=crop&q=80',
      previewImages: previewPagesSample,
      pdfFileKey: 'products/prod-microecon-sem1/original.pdf',
      universityId: 'univ-du',
      courseId: 'course-ba-prog',
      semesterId: 'sem-1',
      subjectId: 'sub-microecon',
      language: 'English',
      pages: 110,
      fileSize: '4.5 MB',
      edition: '2026 Fast-Track Edition',
      author: 'V. Mehta (M.Sc. Economics, DSE)',
      tags: ['Economics', 'Microeconomics', 'Diagrams', 'Semester 1', 'DU', 'MU'],
      isPublished: true,
      isFeatured: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      salesCount: 412,
      viewCount: 2310,
      rating: 4.9,
      ratingCount: 115,
      sampleTopics: [
        'Unit 1: Demand, Supply and Market Equilibrium with Shifts',
        'Unit 2: Elasticity of Demand and Supply (Numerical solving methods)',
        'Unit 3: Consumer Behavior: Cardinal vs Ordinal Utility Analysis',
        'Unit 4: Production and Cost Curves in Short & Long Run',
        'Unit 5: Perfect Competition vs Monopoly: Price-Output Determination',
      ],
    },
    {
      productId: 'prod-ind-gov-sem2',
      title: 'Indian Government & Politics (Semester 2) High-Scoring Guide',
      slug: 'indian-government-and-politics-high-scoring-guide',
      shortDescription: 'Constitutional debates, judicial activism, federal dynamics & election politics with landmark Supreme Court cases.',
      description: 'Targeted study material for B.A. Semester 2 students. Covers the Making of the Indian Constitution, Preamble, Fundamental Rights vs DPSPs, President-Prime Minister relationship, Coalition politics, and Regional assertions in contemporary India.',
      price: 139,
      compareAtPrice: 279,
      thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&h=800&fit=crop&q=80',
      previewImages: previewPagesSample,
      pdfFileKey: 'products/prod-ind-gov-sem2/original.pdf',
      universityId: 'univ-du',
      courseId: 'course-ba-prog',
      semesterId: 'sem-2',
      subjectId: 'sub-ind-gov',
      language: 'English & Hindi Key Concepts',
      pages: 136,
      fileSize: '5.9 MB',
      edition: '2026 Updated Edition',
      author: 'Dr. S. K. Dwivedi',
      tags: ['Political Science', 'Semester 2', 'Constitution', 'Indian Polity', 'DU'],
      isPublished: true,
      isFeatured: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      salesCount: 198,
      viewCount: 940,
      rating: 4.7,
      ratingCount: 42,
      sampleTopics: [
        'Unit 1: Approaches to Study Indian Politics (Liberal, Marxist, Gandhian)',
        'Unit 2: Constitution: Preamble, Fundamental Rights and Judicial Review',
        'Unit 3: Institutional Functioning: Parliament, Executive and Supreme Court',
        'Unit 4: Federal Dynamics: Center-State Relations & Sarkaria Commission',
        'Unit 5: Religion, Caste, and Tribe in Indian Politics',
      ],
    },
    {
      productId: 'prod-sociology-sem1',
      title: 'Introduction to Sociology — Mumbai University Master Notes',
      slug: 'introduction-to-sociology-mumbai-university-master-notes',
      shortDescription: 'Tailored specifically for University of Mumbai CBCS syllabus with thinker summaries (Durkheim, Marx, Weber).',
      description: 'Essential revision notes for first-year Mumbai University B.A. students. Packed with key definitions, sociological theories of social stratification, caste vs class distinctions, institutions of marriage and family, and solved model exam papers.',
      price: 119,
      compareAtPrice: 229,
      thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=800&fit=crop&q=80',
      previewImages: previewPagesSample,
      pdfFileKey: 'products/prod-sociology-sem1/original.pdf',
      universityId: 'univ-mu',
      courseId: 'course-ba-mu',
      semesterId: 'sem-1',
      subjectId: 'sub-sociology-intro',
      language: 'English',
      pages: 115,
      fileSize: '4.2 MB',
      edition: '2026 Mumbai Edition',
      author: 'Prof. Meera Kulkarni',
      tags: ['Sociology', 'Mumbai University', 'Semester 1', 'B.A. Arts'],
      isPublished: true,
      isFeatured: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      salesCount: 174,
      viewCount: 880,
      rating: 4.7,
      ratingCount: 39,
      sampleTopics: [
        'Module 1: Sociology as an Academic Discipline and Sociological Imagination',
        'Module 2: Basic Concepts: Society, Community, Association, Institution, Role & Status',
        'Module 3: Social Stratification: Hierarchy, Social Mobility, Caste and Class',
        'Module 4: Socialization and Agencies of Social Control',
      ],
    },
    {
      productId: 'prod-pubadmin-sem3',
      title: 'Public Administration: Concepts & Theories — Panjab & Central Univs',
      slug: 'public-administration-concepts-theories-master-notes',
      shortDescription: 'Taylor, Fayol, Weber, Elton Mayo & Simon decision theory explained in point-wise exam format.',
      description: 'Ideal preparation material for B.A. Semester 3 students of Panjab University, DU, and SPPU. Bridges theory and Indian administrative reality with easy examples, flowcharts, and 20-mark model answers.',
      price: 139,
      compareAtPrice: 269,
      thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=800&fit=crop&q=80',
      previewImages: previewPagesSample,
      pdfFileKey: 'products/prod-pubadmin-sem3/original.pdf',
      universityId: 'univ-pu',
      courseId: 'course-ba-pu',
      semesterId: 'sem-3',
      subjectId: 'sub-pub-admin',
      language: 'English',
      pages: 132,
      fileSize: '5.1 MB',
      edition: '2026 Edition',
      author: 'Col. J. S. Gill & Associates',
      tags: ['Public Administration', 'Semester 3', 'PU', 'Administrative Theories'],
      isPublished: true,
      isFeatured: false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      salesCount: 142,
      viewCount: 710,
      rating: 4.8,
      ratingCount: 31,
      sampleTopics: [
        'Unit 1: Meaning, Scope and Significance of Public Administration',
        'Unit 2: Classical Theory: Scientific Management (Taylor) and Administrative Management (Fayol)',
        'Unit 3: Bureaucratic Model of Max Weber and its Critics',
        'Unit 4: Human Relations School: Elton Mayo and Hawthorne Experiments',
        'Unit 5: Herbert Simon\'s Decision-Making Model & New Public Management',
      ],
    },
  ];

  const coupons: Coupon[] = [
    {
      couponCode: 'FIRST50',
      discountType: 'fixed',
      discountValue: 50,
      minimumAmount: 199,
      maximumDiscount: 50,
      usageLimit: 1000,
      usedCount: 42,
      perUserLimit: 1,
      startDate: '2026-01-01',
      expiryDate: '2027-12-31',
      isActive: true,
    },
    {
      couponCode: 'BACKLOG10',
      discountType: 'percentage',
      discountValue: 10,
      minimumAmount: 99,
      maximumDiscount: 100,
      usageLimit: 5000,
      usedCount: 128,
      perUserLimit: 3,
      startDate: '2026-01-01',
      expiryDate: '2027-12-31',
      isActive: true,
    },
    {
      couponCode: 'EXAMCLEAR',
      discountType: 'percentage',
      discountValue: 15,
      minimumAmount: 149,
      maximumDiscount: 75,
      usageLimit: 2000,
      usedCount: 89,
      perUserLimit: 2,
      startDate: '2026-01-01',
      expiryDate: '2027-12-31',
      isActive: true,
    },
  ];

  const adminUser: User = {
    uid: adminUid,
    fullName: 'System Administrator',
    email: 'admin@backlogsaver.in',
    role: 'super_admin',
    emailVerified: true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };

  const studentUser: User = {
    uid: studentUid,
    fullName: 'Rahul Verma',
    email: 'student@example.com',
    phone: '+91 98765 43210',
    role: 'customer',
    emailVerified: true,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };

  const userPasswords: Record<string, string> = {
    [adminUid]: hashPassword('Admin123!'),
    [studentUid]: hashPassword('Student123!'),
  };

  // Seed sample order & purchase for demo student
  const sampleOrder: Order = {
    orderId: 'order-demo-001',
    orderNumber: 'BS-20260920-001042',
    userId: studentUid,
    customerName: 'Rahul Verma',
    customerEmail: 'student@example.com',
    customerPhone: '+91 98765 43210',
    items: [
      {
        productId: 'prod-poltheory-sem1',
        title: 'Political Theory Complete Exam Notes (CBCS/NEP 2026)',
        price: 149,
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=800&fit=crop&q=80',
        subjectName: 'Introduction to Political Theory',
        universityName: 'Delhi University (DU)',
      },
    ],
    subtotal: 149,
    discount: 0,
    total: 149,
    currency: 'INR',
    status: 'paid',
    paymentStatus: 'paid',
    razorpayOrderId: 'order_test_987654321',
    razorpayPaymentId: 'pay_test_123456789',
    createdAt: '2026-09-20T10:14:00.000Z',
    updatedAt: '2026-09-20T10:15:30.000Z',
    paidAt: '2026-09-20T10:15:30.000Z',
  };

  const samplePurchase: Purchase = {
    purchaseId: 'purch-demo-001',
    userId: studentUid,
    productId: 'prod-poltheory-sem1',
    orderId: 'order-demo-001',
    paymentId: 'pay-demo-001',
    productTitle: 'Political Theory Complete Exam Notes (CBCS/NEP 2026)',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=800&fit=crop&q=80',
    subjectName: 'Introduction to Political Theory',
    universityName: 'Delhi University (DU)',
    purchasedAt: '2026-09-20T10:15:30.000Z',
    status: 'active',
  };

  const samplePayment: Payment = {
    paymentId: 'pay-demo-001',
    orderId: 'order-demo-001',
    userId: studentUid,
    razorpayOrderId: 'order_test_987654321',
    razorpayPaymentId: 'pay_test_123456789',
    amount: 149,
    currency: 'INR',
    status: 'paid',
    method: 'upi',
    createdAt: '2026-09-20T10:14:00.000Z',
    verifiedAt: '2026-09-20T10:15:30.000Z',
  };

  const reviews: Review[] = [
    {
      reviewId: 'rev-01',
      userId: studentUid,
      userName: 'Rahul Verma (DU B.A. Prog)',
      productId: 'prod-poltheory-sem1',
      orderId: 'order-demo-001',
      rating: 5,
      comment: 'Saved my year! Had a critical backlog in Political Theory from Sem 1. The 15-mark structured model answers matched the question paper pattern directly. Scored an A grade in the re-exam!',
      status: 'approved',
      createdAt: '2026-09-21T14:20:00.000Z',
    },
    {
      reviewId: 'rev-02',
      userId: 'usr-student-002',
      userName: 'Priya Sharma (Mumbai Univ)',
      productId: 'prod-microecon-sem1',
      orderId: 'order-sample-002',
      rating: 5,
      comment: 'The hand-drawn diagrams and step-by-step consumer equilibrium explanations made microeconomics so easy. 100% recommended for anyone struggling with economics backlogs.',
      status: 'approved',
      createdAt: '2026-09-22T09:12:00.000Z',
    },
    {
      reviewId: 'rev-03',
      userId: 'usr-student-003',
      userName: 'Amanpreet Singh (PU)',
      productId: 'prod-ancient-hist-sem1',
      orderId: 'order-sample-003',
      rating: 5,
      comment: 'Super fast PDF delivery. Directly downloaded into my account after payment. The chronological timelines helped me write crisp 15-marker answers.',
      status: 'approved',
      createdAt: '2026-09-23T16:45:00.000Z',
    },
  ];

  const notifications: Notification[] = [
    {
      notificationId: 'notif-01',
      userId: studentUid,
      title: 'Welcome to BACKLOG SAVER!',
      message: 'Explore authorized B.A. study notes by University, Course, Semester and Subject. Clear your backlogs with confidence!',
      type: 'system',
      isRead: false,
      createdAt: now,
    },
    {
      notificationId: 'notif-02',
      userId: studentUid,
      title: 'Purchase Successful 🎉',
      message: 'Your purchase of Political Theory Complete Exam Notes is ready in My Purchases. You can download your PDF anytime.',
      type: 'order',
      isRead: true,
      createdAt: '2026-09-20T10:16:00.000Z',
    },
  ];

  const settings: SiteSettings = {
    siteName: 'BACKLOG SAVER',
    tagline: 'Clear Backlogs. Prepare Smarter. Move Forward.',
    supportEmail: 'support@backlogsaver.in',
    supportPhone: '+91 98765 43210',
    announcementText: '🔥 New 2026 CBCS Exam Notes uploaded! Use code FIRST50 for ₹50 off on orders above ₹199.',
    showAnnouncement: true,
    maintenanceMode: false,
    currency: 'INR',
    razorpayTestMode: true,
    aboutText: 'BACKLOG SAVER is India\'s dedicated educational digital marketplace for university students. We curate high-yield, exam-oriented notes to help B.A. students clear backlogs and score higher with structured, syllabus-aligned PDF materials.',
    digitalProductNotice: 'This is a digital educational product. After successful payment, your purchased PDF will immediately become available in your account under "My Purchases". You can download it securely anytime.',
    refundPolicySummary: 'Due to the immediate digital delivery nature of PDF study materials, downloads are non-returnable once generated. However, if technical issues prevent file access or if duplicate payments occur, we offer full replacements or refunds within 48 hours.',
  };

  return {
    users: [adminUser, studentUser],
    universities,
    courses,
    semesters,
    subjects,
    products,
    orders: [sampleOrder],
    purchases: [samplePurchase],
    payments: [samplePayment],
    downloads: [],
    coupons,
    reviews,
    notifications,
    settings,
    auditLogs: [],
    contactSubmissions: [],
    userPasswords,
    verificationTokens: {},
    resetTokens: {},
    downloadTokens: {},
  };
}

class Database {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseData {
    try {
      const activePath = getDbFilePath();
      if (fs.existsSync(activePath)) {
        const fileContent = fs.readFileSync(activePath, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.error('Failed to read database file, initializing with seed data:', err);
    }
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave?: DatabaseData): void {
    const payload = JSON.stringify(dataToSave || this.data, null, 2);
    try {
      fs.writeFileSync(DB_FILE_PATH, payload, 'utf-8');
    } catch (err) {
      try {
        const tmpPath = path.resolve('/tmp', '.backlog-db.json');
        fs.writeFileSync(tmpPath, payload, 'utf-8');
      } catch (tmpErr) {
        console.error('Failed to write database file:', err);
      }
    }
  }

  public persist(): void {
    this.saveData(this.data);
  }

  public resetToSeed(): void {
    this.data = getInitialData();
    this.persist();
  }

  public getRawData(): DatabaseData {
    return this.data;
  }

  // Users
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(uid: string): User | undefined {
    return this.data.users.find((u) => u.uid === uid);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User, passwordHash: string): User {
    this.data.users.push(user);
    this.data.userPasswords[user.uid] = passwordHash;
    this.persist();
    return user;
  }

  public updateUser(uid: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex((u) => u.uid === uid);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.users[idx];
  }

  public verifyUserPassword(uid: string, passwordAttempt: string): boolean {
    const storedHash = this.data.userPasswords[uid];
    if (!storedHash) return false;
    return storedHash === hashPassword(passwordAttempt);
  }

  public setUserPassword(uid: string, newPassword: string): void {
    this.data.userPasswords[uid] = hashPassword(newPassword);
    this.persist();
  }

  // Email verification tokens
  public createVerificationToken(uid: string): string {
    const token = generateToken();
    this.data.verificationTokens[token] = uid;
    this.persist();
    return token;
  }

  public verifyEmailToken(token: string): User | null {
    const uid = this.data.verificationTokens[token];
    if (!uid) return null;
    const user = this.getUserById(uid);
    if (!user) return null;
    user.emailVerified = true;
    user.updatedAt = new Date().toISOString();
    delete this.data.verificationTokens[token];
    this.persist();
    return user;
  }

  // Password Reset Tokens
  public createResetToken(uid: string): string {
    const token = generateToken();
    this.data.resetTokens[token] = {
      uid,
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    };
    this.persist();
    return token;
  }

  public verifyResetToken(token: string): string | null {
    const entry = this.data.resetTokens[token];
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      delete this.data.resetTokens[token];
      this.persist();
      return null;
    }
    return entry.uid;
  }

  public consumeResetToken(token: string): void {
    delete this.data.resetTokens[token];
    this.persist();
  }

  // Hierarchy
  public getUniversities(): University[] {
    return this.data.universities;
  }

  public getCourses(): Course[] {
    return this.data.courses;
  }

  public getSemesters(): Semester[] {
    return this.data.semesters;
  }

  public getSubjects(): Subject[] {
    return this.data.subjects;
  }

  // Products
  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.productId === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find((p) => p.slug === slug);
  }

  public createProduct(product: Product): Product {
    this.data.products.unshift(product);
    this.persist();
    return product;
  }

  public updateProduct(productId: string, updates: Partial<Product>): Product | undefined {
    const idx = this.data.products.findIndex((p) => p.productId === productId);
    if (idx === -1) return undefined;
    this.data.products[idx] = { ...this.data.products[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.products[idx];
  }

  public deleteProduct(productId: string): boolean {
    const idx = this.data.products.findIndex((p) => p.productId === productId);
    if (idx === -1) return false;
    // Soft delete/archive
    this.data.products[idx].isActive = false;
    this.data.products[idx].isPublished = false;
    this.persist();
    return true;
  }

  // Orders
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderById(orderId: string): Order | undefined {
    return this.data.orders.find((o) => o.orderId === orderId);
  }

  public getOrderByNumber(orderNumber: string): Order | undefined {
    return this.data.orders.find((o) => o.orderNumber === orderNumber);
  }

  public createOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.persist();
    return order;
  }

  public updateOrder(orderId: string, updates: Partial<Order>): Order | undefined {
    const idx = this.data.orders.findIndex((o) => o.orderId === orderId);
    if (idx === -1) return undefined;
    this.data.orders[idx] = { ...this.data.orders[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.orders[idx];
  }

  // Purchases
  public getPurchases(userId?: string): Purchase[] {
    if (userId) {
      return this.data.purchases.filter((p) => p.userId === userId && p.status === 'active');
    }
    return this.data.purchases;
  }

  public hasPurchased(userId: string, productId: string): boolean {
    return this.data.purchases.some((p) => p.userId === userId && p.productId === productId && p.status === 'active');
  }

  public createPurchase(purchase: Purchase): Purchase {
    // Avoid duplicates
    const exists = this.data.purchases.find(
      (p) => p.userId === purchase.userId && p.productId === purchase.productId && p.status === 'active'
    );
    if (exists) return exists;
    this.data.purchases.unshift(purchase);
    // increment product salesCount
    const prod = this.getProductById(purchase.productId);
    if (prod) {
      prod.salesCount = (prod.salesCount || 0) + 1;
    }
    this.persist();
    return purchase;
  }

  // Payments
  public createPayment(payment: Payment): Payment {
    this.data.payments.unshift(payment);
    this.persist();
    return payment;
  }

  public getPayments(): Payment[] {
    return this.data.payments;
  }

  // Download Token Management (Expires in 15 mins)
  public createDownloadToken(purchaseId: string, userId: string, productId: string): string {
    const token = generateToken();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    this.data.downloadTokens[token] = {
      purchaseId,
      userId,
      productId,
      expiresAt,
    };
    this.persist();
    return token;
  }

  public verifyDownloadToken(token: string): { purchaseId: string; userId: string; productId: string } | null {
    const record = this.data.downloadTokens[token];
    if (!record) return null;
    if (Date.now() > record.expiresAt) {
      delete this.data.downloadTokens[token];
      this.persist();
      return null;
    }
    return record;
  }

  public logDownload(log: DownloadLog): void {
    this.data.downloads.unshift(log);
    this.persist();
  }

  public getDownloads(): DownloadLog[] {
    return this.data.downloads;
  }

  // Coupons
  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public getCouponByCode(code: string): Coupon | undefined {
    return this.data.coupons.find((c) => c.couponCode.toUpperCase() === code.trim().toUpperCase());
  }

  public createCoupon(coupon: Coupon): Coupon {
    this.data.coupons.unshift(coupon);
    this.persist();
    return coupon;
  }

  public updateCoupon(code: string, updates: Partial<Coupon>): Coupon | undefined {
    const idx = this.data.coupons.findIndex((c) => c.couponCode.toUpperCase() === code.toUpperCase());
    if (idx === -1) return undefined;
    this.data.coupons[idx] = { ...this.data.coupons[idx], ...updates };
    this.persist();
    return this.data.coupons[idx];
  }

  public deleteCoupon(code: string): boolean {
    const idx = this.data.coupons.findIndex((c) => c.couponCode.toUpperCase() === code.toUpperCase());
    if (idx === -1) return false;
    this.data.coupons.splice(idx, 1);
    this.persist();
    return true;
  }

  // Reviews
  public getReviews(productId?: string): Review[] {
    if (productId) {
      return this.data.reviews.filter((r) => r.productId === productId && r.status === 'approved');
    }
    return this.data.reviews;
  }

  public createReview(review: Review): Review {
    this.data.reviews.unshift(review);
    this.persist();
    return review;
  }

  public updateReview(reviewId: string, updates: Partial<Review>): Review | undefined {
    const idx = this.data.reviews.findIndex((r) => r.reviewId === reviewId);
    if (idx === -1) return undefined;
    this.data.reviews[idx] = { ...this.data.reviews[idx], ...updates };
    this.persist();
    return this.data.reviews[idx];
  }

  // Notifications
  public getNotifications(userId: string): Notification[] {
    return this.data.notifications.filter((n) => n.userId === userId);
  }

  public createNotification(notif: Notification): Notification {
    this.data.notifications.unshift(notif);
    this.persist();
    return notif;
  }

  public markNotificationAsRead(notificationId: string): void {
    const notif = this.data.notifications.find((n) => n.notificationId === notificationId);
    if (notif) {
      notif.isRead = true;
      this.persist();
    }
  }

  // Settings
  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.persist();
    return this.data.settings;
  }

  // Audit Logs
  public logAudit(log: AuditLog): void {
    this.data.auditLogs.unshift(log);
    this.persist();
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  // Contact Submissions
  public createContactSubmission(sub: ContactSubmission): ContactSubmission {
    this.data.contactSubmissions.unshift(sub);
    this.persist();
    return sub;
  }

  public getContactSubmissions(): ContactSubmission[] {
    return this.data.contactSubmissions;
  }
}

export const db = new Database();
