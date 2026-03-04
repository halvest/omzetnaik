// src/pages/ListingsPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  X,
  Filter,
  LayoutGrid,
  MapPin,
  TrendingUp,
  RotateCcw,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import PropertyCard from "../components/PropertyCard";
import Pagination from "../components/Pagination";
import { supabase } from "../utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { formatHarga } from "../utils/idr";

const ITEMS_PER_PAGE = 9;

// ==== Hook Debounce ====
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// ==== Komponen Skeleton Modern ====
const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-slate-100"></div>
    <div className="p-8 space-y-4">
      <div className="h-3 bg-slate-100 rounded w-1/4"></div>
      <div className="h-6 bg-slate-100 rounded w-3/4"></div>
      <div className="h-4 bg-slate-100 rounded w-1/2"></div>
      <div className="pt-6 border-t border-slate-50 flex justify-between">
        <div className="h-6 bg-slate-100 rounded w-24"></div>
        <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State Filter disesuaikan dengan Skema SQL Baru
  const [filters, setFilters] = useState({
    term: searchParams.get("search") || "",
    status: searchParams.get("status") || "active",
    type: searchParams.get("type") || "All", // jual / sewa
    category: searchParams.get("category") || "All", // property_type
    sort: searchParams.get("sort") || "created_at-desc",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10),
  );
  const [properties, setProperties] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearchTerm = useDebounce(filters.term, 500);

  // FETCH DATA DENGAN FULL TEXT SEARCH (search_vector)
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      const [sortField, sortOrder] = filters.sort.split("-");

      // Menarik data beserta gambar primer
      let query = supabase
        .from("properties")
        .select(`*, property_images(image_url)`, { count: "exact" });

      // 1. Integrasi Search Vector (Postgres Full Text Search)
      if (debouncedSearchTerm) {
        query = query.textSearch("search_vector", debouncedSearchTerm, {
          config: "simple",
          type: "websearch",
        });
      }

      // 2. Filter Berdasarkan Skema Kolom Baru
      if (filters.status !== "All") query = query.eq("status", filters.status);
      if (filters.type !== "All")
        query = query.eq("listing_type", filters.type);
      if (filters.category !== "All")
        query = query.eq("property_type", filters.category);
      if (filters.minPrice)
        query = query.gte("price", parseInt(filters.minPrice));
      if (filters.maxPrice)
        query = query.lte("price", parseInt(filters.maxPrice));

      // 3. Sorting & Pagination
      query = query
        .order(sortField, { ascending: sortOrder === "asc" })
        .range(from, to);

      try {
        const { data, error, count } = await query;
        if (error) throw error;
        setProperties(data || []);
        setTotalCount(count || 0);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [currentPage, debouncedSearchTerm, filters]);

  // Sync URL Params
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (debouncedSearchTerm) newParams.set("search", debouncedSearchTerm);
    if (filters.type !== "All") newParams.set("type", filters.type);
    if (filters.category !== "All") newParams.set("category", filters.category);
    if (currentPage > 1) newParams.set("page", currentPage.toString());
    setSearchParams(newParams);
  }, [debouncedSearchTerm, filters, currentPage, setSearchParams]);

  const handleFilterChange = useCallback(
    (key: keyof typeof filters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      term: "",
      status: "active",
      type: "All",
      category: "All",
      sort: "created_at-desc",
      minPrice: "",
      maxPrice: "",
    });
    setCurrentPage(1);
  }, []);

  return (
    <div className="bg-neutral-soft min-h-screen">
      <Helmet>
        <title>Katalog Properti Eksklusif | OmzetNaik.id Agency</title>
        <meta
          name="description"
          content="Cari properti investasi terbaik di Yogyakarta. Listing terverifikasi dengan ROI tinggi."
        />
      </Helmet>

      {/* --- HERO HEADER --- */}
      <div className="bg-white border-b border-border pt-32 pb-16">
        <div className="container mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest mb-8 transition-all"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-primary mb-6 leading-tight">
              Katalog{" "}
              <span className="text-accent italic font-medium">Investasi</span>{" "}
              Properti.
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-sans">
              Menampilkan {totalCount} unit pilihan yang telah melalui proses
              kurasi ketat untuk memastikan keamanan legalitas dan potensi
              profit masa depan.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* --- SEARCH & FILTER BAR --- */}
          <div className="sticky top-24 z-40 mb-12">
            <div className="bg-white/90 backdrop-blur-xl border border-white p-3 rounded-[2.5rem] shadow-2xl shadow-primary/5 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full flex-grow">
                <Search
                  size={18}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Cari lokasi, nama proyek, atau spesifikasi..."
                  value={filters.term}
                  onChange={(e) => handleFilterChange("term", e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-neutral-soft border-none rounded-3xl text-sm focus:ring-2 focus:ring-primary transition-all font-medium"
                />
              </div>

              <div className="flex w-full md:w-auto gap-3">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex-grow md:flex-initial flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-3xl font-bold text-sm hover:bg-secondary transition-all shadow-lg shadow-primary/20"
                >
                  <Filter size={18} className="text-accent" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* --- GRID LISTING --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))
            ) : properties.length > 0 ? (
              properties.map((p) => <PropertyCard key={p.id} property={p} />)
            ) : (
              <div className="col-span-full py-40 text-center bg-white rounded-[3rem] border border-border">
                <RotateCcw size={48} className="mx-auto text-slate-200 mb-6" />
                <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                  Listing Tidak Ditemukan
                </h3>
                <p className="text-slate-500 mb-10 font-sans">
                  Coba ubah kata kunci atau reset filter pencarian Anda.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-primary px-10 py-4"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </div>

          {/* --- PAGINATION --- */}
          {!loading && totalCount > ITEMS_PER_PAGE && (
            <div className="mt-24 border-t border-border pt-12 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </section>

      {/* --- FILTER SLIDE OVER (MODAL) --- */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed inset-y-0 right-0 z-[110] w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              <div className="p-10 border-b border-border flex justify-between items-center bg-neutral-soft/50">
                <h2 className="text-2xl font-heading font-extrabold text-primary">
                  Filter Properti
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-white rounded-full transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                {/* Tipe Listing */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 block">
                    Tipe Penawaran
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["All", "jual", "sewa"].map((t) => (
                      <button
                        key={t}
                        onClick={() => handleFilterChange("type", t)}
                        className={`py-4 rounded-2xl text-sm font-bold border transition-all ${filters.type === t ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white text-slate-500 border-border hover:border-primary"}`}
                      >
                        {t === "All" ? "Semua" : t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Range Harga */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 block">
                    Budget (IDR)
                  </label>
                  <div className="space-y-4">
                    <input
                      type="number"
                      placeholder="Harga Minimum"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                      className="w-full p-5 bg-neutral-soft rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Harga Maksimum"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                      className="w-full p-5 bg-neutral-soft rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                {/* Urutan */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 block">
                    Urutkan Berdasarkan
                  </label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="w-full p-5 bg-neutral-soft rounded-2xl text-sm font-bold text-primary outline-none appearance-none cursor-pointer"
                  >
                    <option value="created_at-desc">Listing Terbaru</option>
                    <option value="price-asc">Harga Terendah</option>
                    <option value="price-desc">Harga Tertinggi</option>
                  </select>
                </div>
              </div>

              <div className="p-10 border-t border-border bg-neutral-soft/30 flex gap-4">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-5 font-bold text-slate-400 hover:text-primary transition-colors uppercase text-xs tracking-widest"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-[2] btn-primary py-5 text-sm"
                >
                  Terapkan Filter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
