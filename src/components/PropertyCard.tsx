// src/components/PropertyCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { formatHarga } from "../utils/idr";

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

const statusTheme = {
  active: "bg-emerald-500 text-white border-transparent",
  pending: "bg-amber-500 text-white border-transparent",
  sold: "bg-slate-900 text-white border-transparent",
  inactive: "bg-rose-500 text-white border-transparent",
};

export default function PropertyCard({
  property,
  priority = false,
}: PropertyCardProps) {
  const displayImage =
    property.property_images?.[0]?.image_url || "/placeholder-property.jpg";

  return (
    <Link
      to={`/properti/${property.slug}`}
      className="group relative flex flex-col bg-white rounded-[bento] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-premium-hover hover:-translate-y-2"
    >
      {/* IMAGE CONTAINER (Optimized for Visual Depth) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-premium group-hover:scale-110"
          loading={priority ? "eager" : "lazy"}
        />

        {/* TOP OVERLAY: Badges (Minimalist Silicon Valley Style) */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] shadow-md border ${statusTheme[property.status]}`}
            >
              {property.status}
            </span>
            {property.is_featured && (
              <span className="bg-white/95 backdrop-blur-md text-primary px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] shadow-md flex items-center gap-1.5 border border-white/20">
                <TrendingUp size={10} className="text-accent" /> Featured
              </span>
            )}
          </div>

          <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-md border border-white/20 text-emerald-500">
            <CheckCircle2 size={16} strokeWidth={2.5} />
          </div>
        </div>

        {/* LISTING TYPE (Bottom Left Tag) */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] shadow-lg backdrop-blur-md ${
              property.listing_type === "jual"
                ? "bg-primary/90 text-white"
                : "bg-accent/90 text-white"
            }`}
          >
            {property.listing_type === "jual" ? "For Sale" : "For Rent"}
          </span>
        </div>

        {/* Subtle Dark Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* CONTENT BOX (Standard Premium UI) */}
      <div className="p-7 md:p-8 flex flex-col flex-grow">
        {/* Category & Location Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
            {property.property_type}
          </span>
          <span className="w-1 h-1 bg-slate-200 rounded-full" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
            {property.district || property.city}
          </span>
        </div>

        {/* Title: Sharp & Clean */}
        <h3 className="text-xl lg:text-2xl font-bold text-primary mb-2 line-clamp-1 group-hover:text-accent transition-colors tracking-tight">
          {property.title}
        </h3>

        {/* Location Text */}
        <div className="flex items-center text-slate-500 text-sm mb-6">
          <MapPin size={14} className="mr-2 shrink-0 text-slate-400" />
          <span className="truncate font-medium">{property.city}</span>
        </div>

        {/* Specs: High Contrast Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-slate-50">
          <div className="flex flex-col items-center border-r border-slate-100">
            <BedDouble size={18} className="text-primary mb-1.5 opacity-80" />
            <span className="text-sm font-bold text-primary tracking-tight">
              {property.bedrooms}
            </span>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Beds
            </p>
          </div>
          <div className="flex flex-col items-center border-r border-slate-100">
            <Bath size={18} className="text-primary mb-1.5 opacity-80" />
            <span className="text-sm font-bold text-primary tracking-tight">
              {property.bathrooms}
            </span>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Baths
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Square size={16} className="text-primary mb-1.5 opacity-80" />
            <span className="text-sm font-bold text-primary tracking-tight">
              {property.land_size}
            </span>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              m²
            </p>
          </div>
        </div>

        {/* PRICING & ACTION (Bento Footer Style) */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
              Investment Value
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl lg:text-3xl font-bold text-primary tracking-tighter leading-none">
                {formatHarga(property.price)}
              </span>
            </div>
          </div>

          {/* Premium Floating Button */}
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-110 transition-all duration-500 ease-premium">
            <ArrowRight
              size={20}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
