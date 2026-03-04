// src/components/Testimonials.tsx
import React from "react";
import { Star, Quote } from "lucide-react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper modules
import { Pagination, Autoplay } from "swiper/modules";

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
    <section className="py-20 bg-neutral-soft relative overflow-hidden">
      {/* Dekorasi Background */}
      <Quote className="absolute top-10 left-10 text-primary/5 w-48 h-48 -rotate-12 select-none pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-border rounded-full mb-6">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
              Client Success
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-4">
            Suara <span className="text-accent italic">Partner</span> Kami
          </h2>
          <p className="text-slate-600 font-sans">
            Keberhasilan kami diukur dari seberapa besar pertumbuhan bisnis yang
            Anda capai melalui strategi digital kami.
          </p>
        </div>

        {/* SWIPER CAROUSEL */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-16 !px-4"
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx} className="h-auto">
              <div className="bg-white p-10 rounded-[2.5rem] border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col group">
                {/* Bintang */}
                <div className="flex gap-1 mb-6 text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                {/* Isi Review */}
                <p className="text-slate-600 font-sans italic mb-8 leading-relaxed flex-grow text-lg">
                  "{review.text}"
                </p>

                {/* Profil User */}
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-heading font-bold text-white group-hover:bg-accent transition-colors duration-500">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-primary text-base">
                      {review.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* CSS Navigation Override */}
      <style>{`
        .swiper-pagination-bullet-active {
          background: #FF3B3B !important;
        }
      `}</style>
    </section>
  );
}
