import React, { useEffect, useState } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingCartButton } from './components/common/FloatingCartButton';
import { api } from './services/api';
import { SiteSettings } from './types';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderFailedPage } from './pages/OrderFailedPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Customer Dashboard
import { AccountOverviewPage } from './pages/account/AccountOverviewPage';
import { MyPurchasesPage } from './pages/account/MyPurchasesPage';
import { MyOrdersPage } from './pages/account/MyOrdersPage';
import { ProfilePage } from './pages/account/ProfilePage';
import { SecurityPage } from './pages/account/SecurityPage';

// Admin Panel
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminHierarchyPage } from './pages/admin/AdminHierarchyPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

// Static / Informational Pages
import { AboutPage } from './pages/static/AboutPage';
import { ContactPage } from './pages/static/ContactPage';
import { FaqPage } from './pages/static/FaqPage';
import { RefundPolicyPage } from './pages/static/RefundPolicyPage';
import { TermsPage } from './pages/static/TermsPage';
import { PrivacyPolicyPage } from './pages/static/PrivacyPolicyPage';
import { CopyrightPolicyPage } from './pages/static/CopyrightPolicyPage';
import { DigitalProductsPolicyPage } from './pages/static/DigitalProductsPolicyPage';
import {
  UniversitiesBrowsePage,
  CoursesBrowsePage,
  SemestersBrowsePage,
  SubjectsBrowsePage,
} from './pages/static/HierarchyBrowsePages';
import { SearchPage } from './pages/static/SearchPage';
import { NotFoundPage } from './pages/static/NotFoundPage';

import { Wrench } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentPath } = useRouter();
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  const path = currentPath.split('?')[0];

  // Maintenance mode check (PRD Section 80)
  if (settings?.maintenanceMode && !path.startsWith('/admin') && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <Wrench className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Website Temporarily Unavailable</h1>
        <p className="text-slate-400 text-sm max-w-md mt-2">
          We're performing scheduled maintenance. Please check back soon.
        </p>
        <div className="mt-6 text-xs text-slate-500">
          Administrator? <a href="/admin" className="text-indigo-400 underline">Access Admin Portal</a>
        </div>
      </div>
    );
  }

  // Dynamic Route Matching
  const renderRoute = () => {
    // 1. Home
    if (path === '/' || path === '') return <HomePage />;

    // 2. Shop & Search
    if (path === '/shop') return <ShopPage />;
    if (path === '/search') return <SearchPage />;

    // 3. Product Details (e.g. /product/political-theory-complete-exam-notes-sem1)
    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '').replace(/\/$/, '');
      return <ProductDetailsPage slug={slug} />;
    }

    // 4. Cart & Checkout
    if (path === '/cart') return <CartPage />;
    if (path === '/checkout') return <CheckoutPage />;
    if (path === '/order-success') return <OrderSuccessPage />;
    if (path === '/order-failed') return <OrderFailedPage />;

    // 5. Auth Pages
    if (path === '/login') return <LoginPage />;
    if (path === '/register') return <RegisterPage />;
    if (path === '/verify-email') return <VerifyEmailPage />;
    if (path === '/forgot-password') return <ForgotPasswordPage />;

    // 6. Customer Account Pages
    if (path === '/account') return <AccountOverviewPage />;
    if (path === '/account/purchases') return <MyPurchasesPage />;
    if (path === '/account/orders') return <MyOrdersPage />;
    if (path === '/account/profile') return <ProfilePage />;
    if (path === '/account/security') return <SecurityPage />;

    // 7. Admin Panel Pages
    if (path === '/admin') return <AdminDashboardPage />;
    if (path === '/admin/products') return <AdminProductsPage />;
    if (path === '/admin/orders') return <AdminOrdersPage />;
    if (path === '/admin/users') return <AdminUsersPage />;
    if (path === '/admin/coupons') return <AdminCouponsPage />;
    if (path === '/admin/hierarchy') return <AdminHierarchyPage />;
    if (path === '/admin/settings') return <AdminSettingsPage />;
    if (path === '/admin/audit-logs') return <AdminAuditLogsPage />;

    // 8. Hierarchy Exploration
    if (path === '/universities') return <UniversitiesBrowsePage />;
    if (path === '/courses') return <CoursesBrowsePage />;
    if (path === '/semesters') return <SemestersBrowsePage />;
    if (path === '/subjects') return <SubjectsBrowsePage />;

    // 9. Static & Legal Pages
    if (path === '/about') return <AboutPage />;
    if (path === '/contact') return <ContactPage />;
    if (path === '/faq') return <FaqPage />;
    if (path === '/refund-policy') return <RefundPolicyPage />;
    if (path === '/terms') return <TermsPage />;
    if (path === '/privacy') return <PrivacyPolicyPage />;
    if (path === '/copyright') return <CopyrightPolicyPage />;
    if (path === '/digital-products') return <DigitalProductsPolicyPage />;

    // 10. Fallback 404
    return <NotFoundPage />;
  };

  const isAdminRoute = path.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden">
      {!isAdminRoute && <Navbar />}
      <div className="flex-1">{renderRoute()}</div>
      {!isAdminRoute && <Footer />}
      <FloatingCartButton />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AuthProvider>
          <CartProvider>
            <MainContent />
          </CartProvider>
        </AuthProvider>
      </RouterProvider>
    </ThemeProvider>
  );
}
