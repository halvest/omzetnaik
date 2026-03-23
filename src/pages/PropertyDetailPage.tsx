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
  Award,
  Armchair,
  Calendar,
  Info,
} from "lucide-react";

// --- Swiper ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- Types ---
interface PropertyPhoto {
  image_url: string;
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
  created_at: string;
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
          Initializing Luxury...
        </p>
      </div>
    );

  if (!property) return null;

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans pb-32">
      <Helmet>
        <title>{`${property.title} | OmzetNaik.id Property`}</title>
        <meta
          name="description"
          content={property.description?.substring(0, 160)}
        />
      </Helmet>

      {/* --- PREMIUM NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/70 backdrop-blur-2xl border-b border-slate-100 h-20">
        <div className="container max-w-7xl flex items-center justify-between h-full px-6">
          <Link
            to="/properti"
            className="flex items-center gap-3 text-slate-400 hover:text-primary transition-all group font-bold text-[10px] uppercase tracking-[0.3em]"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Assets
          </Link>
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-accent text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-accent/20">
              For {property.listing_type}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
              }}
              className="p-2.5 bg-slate-100 text-slate-500 hover:bg-primary hover:text-white rounded-xl transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-28 container max-w-7xl px-6">
        {/* --- LUXURY BENTO GALLERY --- */}
        <section className="mb-12 overflow-hidden rounded-[3rem] shadow-premium bg-white p-3 border border-slate-100">
          <div className="hidden md:grid grid-cols-4 gap-3 h-[550px]">
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
                Main Masterpiece
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
                      <ImageIcon size={18} /> +
                      {property.property_images.length - 4} More Photos
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="md:hidden relative aspect-[4/3] rounded-[2.5rem] overflow-hidden">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
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
          {/* --- LEFT SIDE: NARRATIVE & SPECS --- */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white p-10 md:p-14 rounded-[3rem] shadow-premium border border-slate-50">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest rounded-lg">
                  {property.property_type}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
                  <CheckCircle2 size={12} /> Terverifikasi
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
                  <Calendar size={12} /> Update:{" "}
                  {new Date(property.created_at).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tighter leading-tight">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-400 font-medium mb-10">
                <MapPin size={20} className="text-accent" /> {property.district}
                , {property.city}
              </div>

              {/* Specs Grid (Rumah123 Style Refined) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                <SpecItem
                  icon={<Ruler />}
                  label="Luas Tanah"
                  value={`${property.land_size} m²`}
                />
                <SpecItem
                  icon={<Home />}
                  label="Bangunan"
                  value={`${property.building_size} m²`}
                />
                <SpecItem
                  icon={<BedDouble />}
                  label="K. Tidur"
                  value={property.bedrooms}
                />
                <SpecItem
                  icon={<Bath />}
                  label="K. Mandi"
                  value={property.bathrooms}
                />
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                  <Sparkles size={20} className="text-accent" /> Deskripsi
                  Properti
                </h3>
                <div className="text-slate-500 font-medium leading-relaxed whitespace-pre-line text-base">
                  {property.description}
                </div>
              </div>
            </section>

            {/* Technical Information Table */}
            <section className="bg-white p-10 md:p-14 rounded-[3rem] shadow-premium border border-slate-50">
              <h3 className="text-xl font-bold text-primary mb-8 uppercase tracking-tight flex items-center gap-3">
                <Info size={20} className="text-accent" /> Informasi Teknis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <TechRow
                  label="Sertifikat"
                  value={property.certificate}
                  icon={<Award size={14} />}
                />
                <TechRow
                  label="Kondisi Perabot"
                  value={property.furnishing}
                  icon={<Armchair size={14} />}
                />
                <TechRow
                  label="Listing ID"
                  value={property.id.substring(0, 8).toUpperCase()}
                />
                <TechRow label="Status Pasar" value={property.status} />
              </div>
            </section>
          </div>

          {/* --- RIGHT SIDE: STICKY CONVERSION --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full -mr-20 -mt-20 blur-3xl transition-transform duration-1000 group-hover:scale-150" />

                <div className="relative z-10 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-4">
                    Investment Value
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-10">
                    <span className="text-xl font-medium text-slate-400 mt-2">
                      Rp
                    </span>
                    <span className="text-5xl font-black tracking-tighter">
                      {formatHarga(property.price).replace("Rp", "")}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      className="w-full py-5 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-accent-glow hover:scale-[1.02] transition-all group/wa"
                    >
                      <MessageCircle size={20} /> Tanya Agen Sekarang
                      <ChevronRight
                        size={18}
                        className="group-hover/wa:translate-x-1 transition-transform"
                      />
                    </a>
                    <button className="w-full py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                      Jadwalkan Survey
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex items-center gap-5 shadow-premium">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                  <ShieldCheck size={30} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                    Safe Transaction
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    Unit ini telah melewati audit legalitas 5 tahap oleh tim
                    legal OmzetNaik.id.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- LIGHTBOX & MOBILE NAV --- */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-4 backdrop-blur-xl"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-8 right-8 z-[110] w-14 h-14 bg-white text-primary rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all"
            >
              <X size={24} />
            </button>
            <Swiper
              modules={[Navigation, Keyboard]}
              navigation
              keyboard
              initialSlide={activePhotoIdx}
              className="w-full h-full max-w-6xl"
            >
              {property.property_images.map((photo, i) => (
                <SwiperSlide
                  key={i}
                  className="flex items-center justify-center"
                >
                  <img
                    src={photo.image_url}
                    className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl"
                    alt=""
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-2xl border-t border-slate-100 lg:hidden z-50 flex gap-3">
        <a
          href={whatsappLink}
          className="flex-1 py-4 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 shadow-accent-glow"
        >
          <MessageCircle size={18} /> Chat Agen
        </a>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-14 bg-slate-50 text-primary border border-slate-200 rounded-2xl flex items-center justify-center"
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
const SpecItem = ({ icon, label, value }: any) => (
  <div className="flex flex-col items-center text-center space-y-2">
    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-sm font-bold text-primary">{value}</p>
    </div>
  </div>
);

const TechRow = ({ label, value, icon }: any) => (
  <div className="flex justify-between py-4 border-b border-slate-50 items-center">
    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.2em] flex items-center gap-2">
      {icon} {label}
    </span>
    <span className="font-bold text-primary text-sm tracking-tight">
      {value || "—"}
    </span>
  </div>
);
