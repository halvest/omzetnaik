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
  Navigation2,
  Share2,
  Heart,
  TrendingUp,
  Tag,
} from "lucide-react";

// --- Swiper ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- Types Sesuai Skema Database Baru ---
interface PropertyPhoto {
  url: string;
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
  lokasi_maps_url?: string; // Menyesuaikan jika ada field tambahan
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
        .select(
          `
          *,
          property_images (
            image_url,
            is_primary
          )
        `,
        )
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
    return `https://wa.me/6283144940611?text=Halo,%20saya%20tertarik%20dengan%20listing%20"${property.title}"%20di%20${property.city}.%20Bisa%20dibantu%20jelaskan%20potensi%20ROI-nya?`;
  }, [property]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0F1F4A] rounded-full animate-spin" />
      </div>
    );

  if (!property)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">
          Listing Tidak Ditemukan
        </h2>
        <Link
          to="/properti"
          className="px-8 py-3 bg-primary text-white rounded-xl font-bold"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );

  return (
    <div className="bg-[#F5F7FB] min-h-screen text-dark pb-20 lg:pb-10">
      <Helmet>
        <title>{`${property.title} | OmzetNaik.id Property`}</title>
        <meta
          name="description"
          content={property.description.substring(0, 160)}
        />
      </Helmet>

      {/* --- HEADER NAV (Fixed & Translucent) --- */}
      <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-md border-b border-border h-20 shadow-sm">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link
            to="/properti"
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors py-2"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="font-bold text-sm hidden sm:inline uppercase tracking-widest">
              Kembali ke Katalog
            </span>
          </Link>
          <div className="flex gap-2">
            <span
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                property.listing_type === "jual"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              {property.listing_type}
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        <div className="container mx-auto px-4 lg:px-6">
          {/* --- GALLERY SECTION (Bento Style) --- */}
          <section className="mb-10 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/5">
            <div className="hidden md:grid grid-cols-4 gap-3 h-[550px] bg-white p-3">
              <div
                className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden rounded-3xl"
                onClick={() => {
                  setActivePhotoIdx(0);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={property.property_images[0]?.image_url}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={property.title}
                />
                <div className="absolute top-6 left-6 bg-primary text-white text-[10px] px-4 py-2 rounded-full uppercase font-black tracking-widest">
                  Featured Image
                </div>
              </div>
              {property.property_images.slice(1, 4).map((img, idx) => (
                <div
                  key={idx}
                  className={`relative group cursor-pointer overflow-hidden rounded-3xl ${idx === 2 ? "col-span-2" : ""}`}
                  onClick={() => {
                    setActivePhotoIdx(idx + 1);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={img.image_url}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Gallery"
                  />
                  {idx === 2 && property.property_images.length > 4 && (
                    <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="bg-white text-primary px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl">
                        <ImageIcon size={20} /> +
                        {property.property_images.length - 4} Foto Lainnya
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Swiper */}
            <div className="md:hidden relative aspect-[4/3]">
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
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
            {/* --- LEFT: CONTENT --- */}
            <div className="lg:col-span-8 space-y-10">
              <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-border">
                <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase mb-4">
                  <TrendingUp size={16} /> Potensi Investasi Tinggi
                </div>
                <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary mb-4 leading-tight">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <MapPin size={20} className="text-accent" />
                  {property.district}, {property.city}
                </div>

                {/* Specs Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-10 border-t border-slate-100">
                  {[
                    {
                      label: "LT",
                      val: `${property.land_size}m²`,
                      ico: <Ruler />,
                    },
                    {
                      label: "LB",
                      val: `${property.building_size}m²`,
                      ico: <Home />,
                    },
                    {
                      label: "K. Tidur",
                      val: property.bedrooms,
                      ico: <BedDouble />,
                    },
                    {
                      label: "K. Mandi",
                      val: property.bathrooms,
                      ico: <Bath />,
                    },
                  ].map((spec, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {spec.label}
                      </span>
                      <div className="flex items-center gap-2 text-primary font-bold text-lg">
                        {React.cloneElement(spec.ico as React.ReactElement, {
                          size: 20,
                          className: "text-accent",
                        })}
                        {spec.val}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-border">
                <h2 className="text-2xl font-heading font-bold text-primary mb-6">
                  Deskripsi Unit
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                  {property.description}
                </div>
              </section>

              <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-border">
                <h2 className="text-2xl font-heading font-bold text-primary mb-8">
                  Informasi Lengkap
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                  {[
                    { label: "Sertifikat", value: property.certificate },
                    { label: "Furnishing", value: property.furnishing },
                    { label: "Lokasi", value: property.city },
                    { label: "Alamat Lengkap", value: property.address },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-5 border-b border-slate-50"
                    >
                      <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        {item.label}
                      </span>
                      <span className="font-bold text-primary text-sm">
                        {item.value || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* --- RIGHT: STICKY CARD --- */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16 blur-2xl" />

                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Penawaran Terbaik
                    </p>
                    <h3 className="text-4xl font-heading font-extrabold mb-8 tracking-tighter">
                      {formatHarga(property.price)}
                    </h3>

                    <div className="space-y-4 pt-8 border-t border-white/10 mb-10">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">
                          Status Listing
                        </span>
                        <span className="px-3 py-1 bg-accent rounded-full text-[10px] font-black uppercase">
                          {property.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">
                          Tipe Properti
                        </span>
                        <span className="text-sm font-bold uppercase tracking-widest">
                          {property.property_type}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <a
                        href={whatsappLink}
                        target="_blank"
                        className="w-full py-5 bg-accent hover:bg-accent-hover text-white rounded-2xl font-heading font-bold text-center transition-all shadow-lg shadow-accent/30 flex items-center justify-center gap-3"
                      >
                        <MessageCircle size={24} /> Konsultasi Sekarang
                      </a>
                      <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                        <Share2 size={18} /> Bagikan Unit
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-border flex items-center gap-4">
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-primary uppercase tracking-widest">
                      Legalitas Aman
                    </p>
                    <p className="text-xs text-slate-500">
                      Sertifikat terverifikasi oleh tim OmzetNaik.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- LIGHTBOX --- */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-4 md:p-10"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-8 right-8 z-[110] p-4 bg-white text-primary rounded-full shadow-2xl"
            >
              <X size={24} strokeWidth={3} />
            </button>
            <Swiper
              modules={[Navigation, Keyboard]}
              navigation
              keyboard
              initialSlide={activePhotoIdx}
              className="w-full h-full"
            >
              {property.property_images.map((photo, i) => (
                <SwiperSlide
                  key={i}
                  className="flex items-center justify-center"
                >
                  <img
                    src={photo.image_url}
                    className="max-w-full max-h-[85vh] object-contain rounded-3xl"
                    alt=""
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MOBILE ACTION --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border lg:hidden z-50 flex gap-3">
        <a
          href={whatsappLink}
          className="flex-1 py-4 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
        >
          <MessageCircle size={20} /> Konsultasi
        </a>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-14 bg-neutral-soft text-primary rounded-2xl flex items-center justify-center"
        >
          <ChevronUp size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
