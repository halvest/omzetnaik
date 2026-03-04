// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

// Layouts
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/AdminLayout";

// Public Pages
import LandingPage from "./pages/LandingPage";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import PortfolioPage from "./pages/PortfolioPage";
import PortfolioDetailPage from "./pages/PortfolioDetailPage";
import ServicesPage from "./pages/ServicesPage"; // Baru: Katalog Jasa
import ServiceDetailPage from "./pages/ServiceDetailPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin Pages
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPropertyManager from "./pages/AdminPropertyManager";
import AdminServicesManager from "./pages/AdminServicesManager";
import AdminPortfolioManager from "./pages/AdminPortfolioManager";
import AdminPostsManager from "./pages/AdminPostsManager";
import AdminLeadsManager from "./pages/AdminLeadsManager";
import AdminAnalytics from "./pages/AdminAnalytics";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- RUTE PUBLIK (OmzetNaik.id Main Interface) --- */}
        <Route path="/" element={<MainLayout />}>
          {/* Beranda */}
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
          {/* Overview Dashboard */}
          <Route index element={<AdminDashboard />} />

          {/* Manajemen Jasa & Produk Digital */}
          <Route path="services" element={<AdminServicesManager />} />

          {/* Manajemen Portofolio & Case Studies */}
          <Route path="portfolio" element={<AdminPortfolioManager />} />

          {/* Manajemen Inventory Properti */}
          <Route path="property" element={<AdminPropertyManager />} />

          {/* Manajemen Blog & Artikel SEO */}
          <Route path="posts" element={<AdminPostsManager />} />

          {/* CRM: Leads & Prospek Management */}
          <Route path="leads" element={<AdminLeadsManager />} />

          {/* Business Analytics & Reporting */}
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>

      {/* Monitoring Trafik Real-time */}
      <Analytics />
    </BrowserRouter>
  );
}
