// src/App.tsx
import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// --- LAZY LOADING ADMIN ONLY ---
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const AdminPropertyManager = React.lazy(
  () => import("./pages/AdminPropertyManager"),
);
const AdminServicesManager = React.lazy(
  () => import("./pages/AdminServicesManager"),
);
const AdminPortfolioManager = React.lazy(
  () => import("./pages/AdminPortfolioManager"),
);
const AdminPostsManager = React.lazy(() => import("./pages/AdminPostsManager"));
const AdminLeadsManager = React.lazy(() => import("./pages/AdminLeadsManager"));
const AdminAnalytics = React.lazy(() => import("./pages/AdminAnalytics"));

// Import Halaman Publik
import LandingPage from "./pages/LandingPage";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import PortfolioPage from "./pages/PortfolioPage";
import PortfolioDetailPage from "./pages/PortfolioDetailPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
    <Loader2 className="w-10 h-10 text-accent animate-spin" />
    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
      Initializing Orbit...
    </p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* RUTE PUBLIK */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:slug" element={<ServiceDetailPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="portfolio/:id" element={<PortfolioDetailPage />} />
            <Route path="properti" element={<ListingsPage />} />
            <Route path="properti/:slug" element={<PropertyDetailPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* LOGIN ADMIN */}
          <Route path="/login" element={<LoginPage />} />

          {/* RUTE ADMIN TERMINAL */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<AdminServicesManager />} />
            <Route path="portfolio" element={<AdminPortfolioManager />} />
            <Route path="property" element={<AdminPropertyManager />} />
            <Route path="posts" element={<AdminPostsManager />} />
            <Route path="leads" element={<AdminLeadsManager />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Routes>
      </Suspense>

      <Analytics />
    </BrowserRouter>
  );
}
