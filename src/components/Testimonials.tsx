import React from "react";
import { Star, Quote, Sparkles } from "lucide-react";
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
    text: "Sejak ditangani OmzetNaik.id, ROAS kami stabil di angka 5.4x. Leads yang masuk berkualitas dan tim marketing kami kewalahan closing.",
  },
  {
    name: "Rina Kusuma",
    role: "Marketing Manager Villa Jogja",
    text: "Landing page konversi-sentris. User experience bagus dan integrasi WhatsApp membuat kami tidak kehilangan satu prospek pun.",
  },
  {
    name: "Budi Santoso",
    role: "Owner Property Agent Jogja",
    text: "Dominasi SEO di Google meningkat drastis dalam 3 bulan. Kami muncul di halaman pertama untuk kata kunci properti strategis.",
  },
  {
    name: "Ibu Maya",
    role: "Founder Lodji Svarga",
    text: "Sangat puas dengan transparansi laporannya. Setiap rupiah budget iklan dijelaskan dengan data, bukan sekadar asumsi.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative min-h-screen lg:h-screen flex items-center py-12 lg:py-0 bg-slate-50 overflow-hidden font-sans lg:max-h-[850px]">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <Quote className="absolute -top-10 -left-10 text-primary/[0.05] w-64 h-64 -rotate-12" />
        <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 px-6 mx-auto">
        {/* --- HEADER SECTION --- */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 shadow-sm rounded-full mb-4"
          >
            <Sparkles size={12} className="text-accent" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
              Partner Success
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tighter leading-tight"
          >
            Suara{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-orange-400 italic">
                Partner&nbsp; 
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-2 bg-accent/10 -z-10 rounded-full" />
            </span>{" "}
            Kami
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-500 text-sm lg:text-lg font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Keberhasilan kami diukur dari seberapa besar pertumbuhan bisnis yang
            Anda capai melalui strategi digital kami.
          </motion.p>
        </div>

        {/* --- SWIPER CAROUSEL --- */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16 !px-2 lg:!px-4"
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col group relative"
              >
                {/* Rating Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className="text-accent fill-accent"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-800 font-semibold text-base lg:text-lg mb-8 leading-snug flex-grow tracking-tight italic">
                  "{review.text}"
                </p>

                {/* Profil User */}
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <span className="text-lg">{review.name.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="font-bold text-primary text-base lg:text-lg leading-none mb-1">
                      {review.name}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      {review.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #cbd5e1;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          width: 20px;
          border-radius: 4px;
          background: #FF3B3B !important;
        }
        .swiper-horizontal > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic {
          bottom: 10px;
        }
      `}</style>
    </section>
  );
}
