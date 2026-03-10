// src/components/Testimonials.tsx
import React from "react";
import { Star, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const reviews = [
  {
    name: "Andi Wijaya",
    role: "CEO Sasmaya Residence",
    text: "Sejak ditangani OmzetNaik.id, ROAS kami stabil di angka 5.4x. Leads yang masuk sangat berkualitas dan tim marketing kami kewalahan closing. Strategi Meta Ads-nya benar-benar tajam!",
  },
  {
    name: "Rina Kusuma",
    role: "Marketing Manager Villa Jogja",
    text: "Landing page yang dibuat sangat konversi-sentris. User experience-nya bagus dan integrasi ke WhatsApp-nya membuat kami tidak kehilangan satu prospek pun. Profesional dan responsif!",
  },
  {
    name: "Budi Santoso",
    role: "Owner Property Agent Jogja",
    text: "Dominasi SEO kami di Google meningkat drastis dalam 3 bulan. Sekarang kami muncul di halaman pertama untuk kata kunci properti strategis. Partner digital marketing terbaik untuk skala bisnis kami.",
  },
  {
    name: "Ibu Maya",
    role: "Founder Lodji Svarga",
    text: "Sangat puas dengan transparansi laporannya. Setiap rupiah budget iklan dijelaskan dengan data, bukan sekadar asumsi. Benar-benar fokus pada kenaikan omzet klien.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-40 bg-slate-50 relative overflow-hidden font-sans">
      {/* BACKGROUND AMBIANCE (Premium Polish) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <Quote className="absolute -top-10 -left-10 text-primary/[0.03] w-64 h-64 -rotate-12" />
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full mb-8"
          >
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
              Partner Success
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.2, 0, 0, 1] }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary mb-6 tracking-tighter leading-tight"
          >
            Suara{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 italic">
              Partner
            </span>{" "}
            Kami
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Keberhasilan kami diukur dari seberapa besar pertumbuhan bisnis yang
            Anda capai melalui strategi digital kami.
          </motion.p>
        </div>

        {/* SWIPER CAROUSEL (Bento-style Cards) */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{
            delay: 7000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-20 !px-4"
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-white p-10 lg:p-12 rounded-[bento] border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 h-full flex flex-col group relative"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Rating Stars (Silicon Valley Minimalist) */}
                <div className="flex gap-1.5 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-accent fill-accent"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-900 font-medium text-lg lg:text-xl mb-10 leading-relaxed flex-grow tracking-tight italic">
                  "{review.text}"
                </p>

                {/* Profil User */}
                <div className="flex items-center gap-5 mt-auto pt-8 border-t border-slate-100">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm overflow-hidden">
                    <span className="text-xl">{review.name.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-primary text-lg tracking-tight">
                      {review.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-1">
                      {review.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modern Pagination CSS Override */}
      <style>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
        }
        .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          background: #FF3B3B !important;
        }
        .swiper-horizontal > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
            bottom: 20px;
        }
      `}</style>
    </section>
  );
}
