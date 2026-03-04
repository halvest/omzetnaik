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
} from "lucide-react";
import { formatHarga } from "../utils/idr";

// Interface disesuaikan dengan Skema SQL Terbaru
export interface Property {
  id: string;
  slug: string;
  title: string; // Menggantikan nama_unit
  city: string; // Menggantikan lokasi_singkat
  district?: string; // Sesuai skema
  price: number; // Menggantikan harga
  listing_type: "jual" | "sewa";
  status: "active" | "pending" | "sold" | "inactive";
  property_type: string; // Menggantikan kategori
  bedrooms: number; // Menggantikan kamar_tidur
  bathrooms: number; // Menggantikan kamar_mandi
  land_size: number; // Menggantikan luas_tanah
  building_size: number; // Menggantikan luas_bangunan
  is_featured: boolean;
  property_images?: { image_url: string }[]; // Relasi gambar
}

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

const statusTheme = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  sold: "bg-slate-100 text-slate-500 border-slate-200",
  inactive: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function PropertyCard({
  property,
  priority = false,
}: PropertyCardProps) {
  // Ambil gambar utama dari relasi atau fallback
  const displayImage =
    property.property_images?.[0]?.image_url || "/placeholder-property.jpg";

  return (
    <Link
      to={`/properti/${property.slug}`}
      className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={displayImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading={priority ? "eager" : "lazy"}
        />

        {/* TOP OVERLAY: Badges */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <span
              className={`backdrop-blur-md border px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${statusTheme[property.status] || "bg-white/90 text-slate-700"}`}
            >
              {property.status}
            </span>
            {property.is_featured && (
              <span className="bg-primary text-white border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                <TrendingUp size={12} className="text-accent" /> Featured
              </span>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-sm border border-white/50 text-accent">
            <CheckCircle2 size={18} />
          </div>
        </div>

        {/* LISTING TYPE TAG */}
        <div className="absolute bottom-5 left-5">
          <span
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-lg ${
              property.listing_type === "jual"
                ? "bg-orange-500 text-white"
                : "bg-purple-600 text-white"
            }`}
          >
            {property.listing_type === "jual" ? "DIJUAL" : "DISEWAKAN"}
          </span>
        </div>
      </div>

      {/* CONTENT BOX */}
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        {/* Category & Branding */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
            {property.property_type}
          </span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {property.district || property.city}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-heading font-extrabold text-primary mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-slate-400 text-sm mb-6">
          <MapPin size={16} className="mr-1.5 shrink-0 text-accent" />
          <span className="truncate font-medium">{property.city}</span>
        </div>

        {/* Specs: Modern Grid */}
        <div className="grid grid-cols-3 gap-2 mb-8 py-5 border-y border-neutral-soft">
          <div className="flex flex-col items-center border-r border-slate-100">
            <BedDouble size={18} className="text-primary mb-1" />
            <span className="text-sm font-bold text-primary">
              {property.bedrooms}
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
              Beds
            </span>
          </div>
          <div className="flex flex-col items-center border-r border-slate-100">
            <Bath size={18} className="text-primary mb-1" />
            <span className="text-sm font-bold text-primary">
              {property.bathrooms}
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
              Baths
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Square size={16} className="text-primary mb-1" />
            <span className="text-sm font-bold text-primary">
              {property.land_size}
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
              m²
            </span>
          </div>
        </div>

        {/* Bottom Section: Pricing & Action */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
              Investment Value
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-heading font-black text-primary tracking-tight leading-none">
                {formatHarga(property.price)}
              </span>
            </div>
          </div>

          {/* Action Button: Growth Red Color */}
          <div className="w-14 h-14 rounded-[1.25rem] bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/10 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
            <ArrowUpRight size={26} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
}
