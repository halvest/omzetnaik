// src/components/PropertyCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  ArrowUpRight,
  CheckCircle2,
  TrendingUp,
  Layout,
} from "lucide-react";
import { formatHarga } from "../utils/idr";
import { motion } from "framer-motion";

export interface Property {
  id: string;
  slug: string;
  title: string;
  city: string;
  district?: string;
  price: number;
  listing_type: "jual" | "sewa";
  status: "active" | "pending" | "sold" | "inactive";
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  land_size: number;
  building_size: number;
  is_featured: boolean;
  property_images?: { image_url: string }[];
}

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

// OPTIMASI: Refined Color Palette untuk kesan lebih Premium
const statusTheme = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
  pending: "bg-amber-500/10 text-amber-600 border-amber-200/50",
  sold: "bg-slate-900 text-white border-transparent",
  inactive: "bg-rose-500/10 text-rose-600 border-rose-200/50",
};

export default function PropertyCard({
  property,
  priority = false,
}: PropertyCardProps) {
  const displayImage =
    property.property_images?.[0]?.image_url || "/placeholder-property.jpg";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
    >
      <Link
        to={`/properti/${property.slug}`}
        className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-premium-hover h-full"
      >
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={displayImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-premium group-hover:scale-110"
            loading={priority ? "eager" : "lazy"}
          />

          {/* TOP OVERLAY: Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            <div className="flex flex-col gap-2">
              <span
                className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] backdrop-blur-md border shadow-sm transition-colors ${statusTheme[property.status]}`}
              >
                {property.status}
              </span>
              {property.is_featured && (
                <span className="bg-primary text-white px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] shadow-lg flex items-center gap-1.5 border border-white/10">
                  <TrendingUp size={10} className="text-accent" /> Featured
                </span>
              )}
            </div>

            <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-md border border-white/20 text-emerald-500">
              <CheckCircle2 size={16} strokeWidth={2.5} />
            </div>
          </div>

          {/* PRICE TAG OVERLAY (Bottom Right Style) */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/20">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                Start From
              </p>
              <p className="text-sm font-bold text-primary tracking-tight">
                {formatHarga(property.price)}
              </p>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* CONTENT BOX */}
        <div className="p-6 lg:p-8 flex flex-col flex-grow">
          {/* Metadata Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-accent/5 text-[9px] font-black text-accent uppercase tracking-widest rounded-md border border-accent/10">
                {property.listing_type === "jual" ? "For Sale" : "For Rent"}
              </span>
              <span className="w-1 h-1 bg-slate-200 rounded-full" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {property.property_type}
              </span>
            </div>
            <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <MapPin size={12} className="mr-1 text-accent" />
              {property.city}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-primary mb-6 line-clamp-2 group-hover:text-accent transition-colors tracking-tight leading-snug">
            {property.title}
          </h3>

          {/* Specs Grid: Optimized with Building Size */}
          <div className="grid grid-cols-4 gap-2 mb-8 py-5 border-y border-slate-50">
            <div className="flex flex-col items-center border-r border-slate-100">
              <BedDouble size={16} className="text-slate-400 mb-1" />
              <span className="text-xs font-bold text-primary">
                {property.bedrooms}
              </span>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-0.5">
                Beds
              </p>
            </div>
            <div className="flex flex-col items-center border-r border-slate-100">
              <Bath size={16} className="text-slate-400 mb-1" />
              <span className="text-xs font-bold text-primary">
                {property.bathrooms}
              </span>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-0.5">
                Baths
              </p>
            </div>
            <div className="flex flex-col items-center border-r border-slate-100">
              <Square size={14} className="text-slate-400 mb-1" />
              <span className="text-xs font-bold text-primary">
                {property.land_size}
              </span>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-0.5">
                Land
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Layout size={14} className="text-slate-400 mb-1" />
              <span className="text-xs font-bold text-primary">
                {property.building_size}
              </span>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-0.5">
                Build
              </p>
            </div>
          </div>

          {/* CTA Row */}
          <div className="mt-auto flex items-center justify-between group/footer">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                <CheckCircle2 size={10} /> Verified Asset
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                View detailed metrics
              </span>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:rotate-45 transition-all duration-500 shadow-sm">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
