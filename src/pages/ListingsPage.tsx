// src/pages/ListingsPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  X,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import PropertyCard from "../components/PropertyCard";
import Pagination from "../components/Pagination";
import { supabase } from "../utils/supabase";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 9;

// ==== OPTIMASI: Custom Hook untuk URL Logic (Clean Architecture) ====
const usePropertyFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentFilters = useMemo(
    () => ({
      term: searchParams.get("search") || "",
      status: searchParams.get("status") || "active",
      type: searchParams.get("type") || "All",
      category: searchParams.get("category") || "All",
      sort: searchParams.get("sort") || "created_at-desc",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      page: parseInt(searchParams.get("page") || "1", 10),
    }),
    [searchParams],
  );

  const updateFilters = (updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "All" || value === "" || (key === "page" && value === 1)) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });
    setSearchParams(newParams);
  };

  return { currentFilters, updateFilters };
};

export default function ListingsPage() {
  const { currentFilters, updateFilters } = usePropertyFilters();
  const [properties, setProperties] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(currentFilters.term);

  // FETCH DATA: Dengan Optimasi Postgres Search Vector
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const from = (currentFilters.page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      const [sortField, sortOrder] = currentFilters.sort.split("-");

      let query = supabase
        .from("properties")
        .select(`*, property_images(image_url)`, { count: "exact" });

      // Search Logic
      if (currentFilters.term) {
        query = query.textSearch("search_vector", currentFilters.term, {
          config: "simple",
          type: "websearch",
        });
      }

      // Categorical Filters
      if (currentFilters.status !== "All")
        query = query.eq("status", currentFilters.status);
      if (currentFilters.type !== "All")
        query = query.eq("listing_type", currentFilters.type);
      if (currentFilters.category !== "All")
        query = query.eq("property_type", currentFilters.category);
      if (currentFilters.minPrice)
        query = query.gte("price", currentFilters.minPrice);
      if (currentFilters.maxPrice)
        query = query.lte("price", currentFilters.maxPrice);

      query = query
        .order(sortField, { ascending: sortOrder === "asc" })
        .range(from, to);

      const { data, count, error } = await query;
      if (!error) {
        setProperties(data || []);
        setTotalCount(count || 0);
      }
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    fetchProperties();
  }, [currentFilters]);

  // Debounced Search Handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== currentFilters.term) {
        updateFilters({ search: localSearch, page: 1 });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [localSearch]);

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans">
      <Helmet>
        <title>
          {currentFilters.term
            ? `Hasil Cari: ${currentFilters.term}`
            : "Katalog Properti"}{" "}
          | OmzetNaik.id
        </title>
        <meta
          name="description"
          content="Temukan properti investasi pilihan dengan legalitas terjamin di Yogyakarta."
        />
      </Helmet>

      {/* --- PREMIUM HEADER --- */}
      <header className="bg-white border-b border-slate-100 pt-32 pb-12">
        <div className="container mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-8 transition-all group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Home
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-primary tracking-tighter leading-[0.9]">
                Investment{" "}
                <span className="text-accent italic font-medium">Assets.</span>
              </h1>
              <p className="text-slate-500 text-lg mt-6 leading-relaxed max-w-xl font-medium">
                Menampilkan{" "}
                <span className="text-primary font-bold">
                  {totalCount} unit
                </span>{" "}
                pilihan yang siap mengakselerasi portofolio Anda.
              </p>
            </div>
            {/* Quick Sorting Dropdown */}
            <div className="relative group min-w-[200px]">
              <select
                value={currentFilters.sort}
                onChange={(e) =>
                  updateFilters({ sort: e.target.value, page: 1 })
                }
                className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-primary appearance-none cursor-pointer focus:ring-2 focus:ring-primary/5 transition-all"
              >
                <option value="created_at-desc">Listing Terbaru</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={14}
              />
            </div>
          </div>
        </div>
      </header>

      {/* --- SEARCH & FLOATING FILTERS --- */}
      <section className="sticky top-20 z-30 py-6 -mt-8">
        <div className="container mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-2xl border border-white p-2 rounded-[2rem] shadow-premium flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow group">
              <Search
                size={18}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors"
              />
              <input
                type="text"
                placeholder="Cari lokasi, nama proyek, atau tipe properti..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-none rounded-[1.5rem] text-sm font-bold placeholder:text-slate-300 focus:ring-0"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/95 transition-all shadow-lg shadow-primary/10 active:scale-95"
            >
              <SlidersHorizontal size={16} /> Advanced Filter
            </button>
          </div>
        </div>
      </section>

      {/* --- LISTING GRID --- */}
      <main className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))
            ) : properties.length > 0 ? (
              properties.map((p) => <PropertyCard key={p.id} property={p} />)
            ) : (
              <EmptyState
                onReset={() =>
                  updateFilters({
                    search: "",
                    type: "All",
                    category: "All",
                    page: 1,
                  })
                }
              />
            )}
          </div>

          {/* PAGINATION */}
          {!loading && totalCount > ITEMS_PER_PAGE && (
            <div className="mt-20 flex justify-center border-t border-slate-100 pt-12">
              <Pagination
                currentPage={currentFilters.page}
                totalCount={totalCount}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={(page) => updateFilters({ page })}
              />
            </div>
          )}
        </div>
      </main>

      {/* --- FILTER DRAWER (MODERN SIDEBAR) --- */}
      <AnimatePresence>
        {showFilters && (
          <FilterDrawer
            filters={currentFilters}
            onClose={() => setShowFilters(false)}
            onApply={(updates) => {
              updateFilters({ ...updates, page: 1 });
              setShowFilters(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==== SUB-COMPONENTS (Clean Code) ====

const FilterDrawer = ({ filters, onClose, onApply }: any) => (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-sm"
    />
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 z-[110] w-full max-w-md bg-white shadow-2xl flex flex-col"
    >
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-2xl font-bold text-primary tracking-tighter">
            Filter Criteria
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Refine your asset discovery
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-3 bg-white border border-slate-100 rounded-full hover:bg-slate-50 transition-all shadow-sm"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
        {/* Filter Section: Listing Type */}
        <FilterSection label="Tipe Penawaran">
          <div className="grid grid-cols-2 gap-2">
            {["All", "jual", "sewa"].map((t) => (
              <button
                key={t}
                onClick={() => onApply({ type: t })}
                className={`py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${filters.type === t ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white text-slate-400 border-slate-100 hover:border-primary"}`}
              >
                {t === "All" ? "Semua" : t}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Price Range Section */}
        <FilterSection label="Range Budget (IDR)">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => onApply({ minPrice: e.target.value })}
              className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/5 transition-all border-none"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => onApply({ maxPrice: e.target.value })}
              className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/5 transition-all border-none"
            />
          </div>
        </FilterSection>
      </div>

      <div className="p-8 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={onClose}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/10 active:scale-95 transition-all"
        >
          Show Results
        </button>
      </div>
    </motion.div>
  </>
);

const FilterSection = ({ label, children }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
      {label}
    </label>
    {children}
  </div>
);

const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] border border-slate-50 overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-slate-100" />
    <div className="p-8 space-y-4">
      <div className="h-2 bg-slate-100 rounded w-1/4" />
      <div className="h-6 bg-slate-100 rounded w-3/4" />
      <div className="h-4 bg-slate-100 rounded w-1/2" />
    </div>
  </div>
);

const EmptyState = ({ onReset }: any) => (
  <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
    <RotateCcw
      size={48}
      className="mx-auto text-slate-200 mb-6 animate-spin-slow"
    />
    <h3 className="text-2xl font-bold text-primary tracking-tight">
      Listing Tidak Ditemukan
    </h3>
    <p className="text-slate-400 font-medium mt-2 mb-8">
      Maaf, aset dengan kriteria tersebut belum tersedia saat ini.
    </p>
    <button
      onClick={onReset}
      className="px-10 py-4 bg-slate-100 text-primary rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
    >
      Reset Semua Parameter
    </button>
  </div>
);
