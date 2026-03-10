// src/pages/PropertyDetailPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { Helmet } from "react-helmet-async";
import { formatHarga } from "../utils/idr";
import { motion, AnimatePresence } from "framer-motion";

// --- Icons ---
import {
  MapPin,
  ArrowLeft,
  Image as ImageIcon,
  X,
  ChevronUp,
  BedDouble,
  Bath,
  Ruler,
  Home,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Share2,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";

// --- Swiper ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- Types ---
interface PropertyPhoto {
  image_url: string; // Sesuai kolom di tabel property_images
  is_primary: boolean;
}

interface PropertyDetail {
  id: string;
  title: string;
  slug: string;
  property_type: string;
  listing_type: "jual" | "sewa";
  status: "active" | "pending" | "sold" | "inactive";
  price: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  land_size: number;
  building_size: number;
  certificate: string;
  furnishing: string;
  address: string;
  city: string;
  district: string;
  property_images: PropertyPhoto[];
}

export default function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!slug) return;
      window.scrollTo(0, 0);

      const { data, error } = await supabase
        .from("properties")
        .select(`*, property_images(image_url, is_primary)`)
        .eq("slug", slug)
        .single();

      if (!error && data) {
        setProperty(data);
      }
      setLoading(false);
    };
    fetchProperty();
  }, [slug]);

  const whatsappLink = useMemo(() => {
    if (!property) return "";
    return `https://wa.me/6283144940611?text=Halo OmzetNaik.id, saya tertarik dengan listing "${property.title}" di ${property.city}. Bisa dibantu jelaskan detail unitnya?`;
  }, [property]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          Synchronizing Units...
        </p>
      </div>
    );

  if (!property) return null;

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-24">
      <Helmet>
        <title>{`${property.title} | OmzetNaik.id Property`}</title>
        <meta
          name="description"
          content={
            property.description?.substring(0, 160) ||
            "Detail properti eksklusif"
          }
        />
      </Helmet>

      {/* --- PREMIUM STICKY NAV --- */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-100 h-20 shadow-sm">
        <div className="container flex items-center justify-between h-full px-6">
          <Link
            to="/properti"
            className="flex items-center gap-3 text-slate-400 hover:text-primary transition-all group font-bold text-[10px] uppercase tracking-[0.2em]"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <span
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${property.listing_type === "jual" ? "bg-accent/10 text-accent border border-accent/10" : "bg-primary/10 text-primary border border-primary/10"}`}
            >
              {property.listing_type}
            </span>
            <button
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
              className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary rounded-xl transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 container max-w-6xl">
        {/* --- LUXURY GALLERY (Bento Grid) --- */}
        <section className="mb-12 overflow-hidden rounded-[3rem] shadow-premium bg-white p-3 border border-slate-100">
          <div className="hidden md:grid grid-cols-4 gap-3 h-[600px]">
            <div
              className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-[2.5rem]"
              onClick={() => {
                setActivePhotoIdx(0);
                setLightboxOpen(true);
              }}
            >
              <img
                src={property.property_images[0]?.image_url}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt={property.title}
              />
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md text-primary text-[9px] px-4 py-2 rounded-full uppercase font-black tracking-widest shadow-sm">
                Master Showcase
              </div>
            </div>
            {property.property_images.slice(1, 4).map((img, idx) => (
              <div
                key={idx}
                className={`relative group cursor-pointer overflow-hidden rounded-[2.5rem] ${idx === 2 ? "col-span-2" : ""}`}
                onClick={() => {
                  setActivePhotoIdx(idx + 1);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={img.image_url}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt="Gallery"
                />
                {idx === 2 && property.property_images.length > 4 && (
                  <div className="absolute inset-0 bg-primary/40 backdrop-blur-[3px] flex items-center justify-center">
                    <div className="bg-white text-primary px-8 py-4 rounded-2xl font-bold text-xs flex items-center gap-3 shadow-2xl uppercase tracking-widest">
                      <ImageIcon size={18} /> View All{" "}
                      {property.property_images.length} Photos
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Swiper (Luxury Touch) */}
          <div className="md:hidden relative aspect-[4/3] rounded-[2rem] overflow-hidden">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              className="h-full w-full"
            >
              {property.property_images.map((photo, i) => (
                <SwiperSlide
                  key={i}
                  onClick={() => {
                    setActivePhotoIdx(i);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={photo.image_url}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- LEFT: PROPERTY NARRATIVE --- */}
          <div className="lg:col-span-8 space-y-10">
            <section className="bg-white p-10 md:p-16 rounded-[bento] shadow-premium border border-slate-50">
              <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-[0.25em] mb-6">
                <TrendingUp size={14} /> High Growth Potential Unit
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tighter leading-[1.05]">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-400 font-medium italic mb-12">
                <MapPin size={20} className="text-accent" /> {property.district}
                , {property.city}
              </div>

              {/* Specs Bento Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-slate-50">
                {[
                  {
                    label: "Land Area",
                    val: `${property.land_size} m²`,
                    ico: <Ruler />,
                  },
                  {
                    label: "Building",
                    val: `${property.building_size} m²`,
                    ico: <Home />,
                  },
                  {
                    label: "Bedrooms",
                    val: property.bedrooms,
                    ico: <BedDouble />,
                  },
                  {
                    label: "Bathrooms",
                    val: property.bathrooms,
                    ico: <Bath />,
                  },
                ].map((spec, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                      {spec.ico}
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {spec.label}
                      </p>
                      <p className="text-lg font-bold text-primary tracking-tight">
                        {spec.val}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-accent" /> unit
                  Description
                </h3>
                <div className="prose prose-slate max-w-none text-slate-500 font-medium leading-relaxed whitespace-pre-line">
                  {property.description}
                </div>
              </div>
            </section>

            {/* Logistics Card */}
            <section className="bg-white p-10 md:p-16 rounded-[bento] shadow-premium border border-slate-50">
              <h3 className="text-xl font-bold text-primary mb-10 uppercase tracking-tight">
                Technical Logistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
                {[
                  {
                    label: "Ownership Certificate",
                    value: property.certificate,
                  },
                  { label: "Furnishing Status", value: property.furnishing },
                  { label: "Province/City", value: property.city },
                  { label: "Detailed Coordinates", value: property.address },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-5 border-b border-slate-50 items-center"
                  >
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                      {item.label}
                    </span>
                    <span className="font-bold text-primary text-sm tracking-tight">
                      {item.value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* --- RIGHT: INVESTMENT STICKY --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              <div className="bg-primary rounded-[bento] p-10 text-white shadow-premium relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full -mr-20 -mt-20 blur-3xl transition-transform duration-1000 group-hover:scale-150" />

                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">
                    Commercial Value
                  </p>
                  <h3 className="text-5xl font-bold mb-10 tracking-tighter">
                    <span className="text-xl font-medium text-slate-400 mr-2">
                      Rp
                    </span>
                    {formatHarga(property.price).replace("Rp", "")}
                  </h3>

                  <div className="space-y-4 pt-8 border-t border-white/10 mb-10">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[11px] text-slate-300 font-medium uppercase tracking-widest">
                        Market Status
                      </span>
                      <span className="px-3 py-1 bg-accent rounded-lg text-[9px] font-black uppercase shadow-accent-glow">
                        {property.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      className="btn-primary !bg-accent !text-white !py-5 !text-xs shadow-accent-glow flex items-center justify-center gap-3 group/wa"
                    >
                      <MessageCircle size={20} /> Connect with Tim Ahli
                      <ChevronRight
                        size={18}
                        className="group-hover/wa:translate-x-1 transition-transform"
                      />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[bento] p-10 border border-slate-100 flex items-center gap-6 shadow-premium">
                <div className="w-16 h-16 bg-accent/5 rounded-[1.5rem] flex items-center justify-center text-accent">
                  <ShieldCheck size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
                    Secure Transaction
                  </p>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Legalitas dan verifikasi unit telah diaudit sepenuhnya oleh
                    tim OmzetNaik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- FULLSCREEN LIGHTBOX --- */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-8 right-8 z-[110] w-14 h-14 bg-white text-primary rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all"
            >
              <X size={24} strokeWidth={3} />
            </button>
            <Swiper
              modules={[Navigation, Keyboard]}
              navigation
              keyboard
              initialSlide={activePhotoIdx}
              className="w-full h-full max-w-7xl"
            >
              {property.property_images.map((photo, i) => (
                <SwiperSlide
                  key={i}
                  className="flex items-center justify-center"
                >
                  <img
                    src={photo.image_url}
                    className="max-w-full max-h-[85vh] object-contain rounded-[2rem] shadow-2xl border-4 border-white/10"
                    alt=""
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MOBILE STICKY CTA --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 lg:hidden z-50 flex gap-3">
        <a
          href={whatsappLink}
          className="flex-1 py-4 bg-accent text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest text-center flex items-center justify-center gap-2 shadow-accent-glow"
        >
          <MessageCircle size={18} /> Inquiry Unit
        </a>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-14 bg-slate-50 text-primary border border-slate-200 rounded-2xl flex items-center justify-center"
        >
          <ChevronUp size={24} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
