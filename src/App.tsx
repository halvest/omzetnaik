// src/App.tsx
import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

// Layouts
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/AdminLayout";

// Components & Utils
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy Loading untuk performa (Halaman Admin yang berat dimuat saat dibutuhkan saja)
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

// Import Halaman Publik (Eager Loading untuk SEO & LCP)
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

// --- SCROLL RESTORATION UTILITY ---
// Mencegah bug dimana saat pindah halaman, posisi scroll tetap di bawah
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// --- GLOBAL LOADING STATE ---
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
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "16px",
              background: "#0F1F4A",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600",
            },
          }}
        />

        <Routes>
          {/* --- RUTE PUBLIK (OmzetNaik.id Main Interface) --- */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />

            {/* Unit Bisnis: Jasa Agency & Performance Marketing */}
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:slug" element={<ServiceDetailPage />} />

            {/* Case Studies / Portofolio */}
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="portfolio/:id" element={<PortfolioDetailPage />} />

            {/* Unit Bisnis: Real Estate & Properti */}
            <Route path="properti" element={<ListingsPage />} />
            <Route path="properti/:slug" element={<PropertyDetailPage />} />

            {/* Insights & Content Marketing */}
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogDetailPage />} />

            {/* Catch All - 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* --- RUTE AUTHENTICATION --- */}
          <Route path="/login" element={<LoginPage />} />

          {/* --- RUTE ADMIN (Midnight Navy CMS Dashboard) --- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Menggunakan Suspense untuk Admin Pages agar Bundle Awal Lebih Ringan */}
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminDashboard />
                </Suspense>
              }
            />

            <Route
              path="services"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminServicesManager />
                </Suspense>
              }
            />

            <Route
              path="portfolio"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminPortfolioManager />
                </Suspense>
              }
            />

            <Route
              path="property"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminPropertyManager />
                </Suspense>
              }
            />

            <Route
              path="posts"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminPostsManager />
                </Suspense>
              }
            />

            <Route
              path="leads"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminLeadsManager />
                </Suspense>
              }
            />

            <Route
              path="analytics"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminAnalytics />
                </Suspense>
              }
            />
          </Route>
        </Routes>

        {/* Monitoring Trafik Real-time & Web Vitals */}
        <Analytics />
      </BrowserRouter>
    </HelmetProvider>
  );
}
