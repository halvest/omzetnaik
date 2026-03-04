// src/components/FAQ.tsx
import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ✨ Data FAQ diperbarui untuk konteks Digital Marketing Agency
const faqData = [
  {
    question: "Bagaimana cara kerja sistem 'Omzet Naik' ini?",
    answer:
      "Kami membangun funnel pemasaran digital yang komprehensif, mulai dari riset audiens, pembuatan landing page yang konversi-sentris, hingga menjalankan iklan Meta & Google Ads yang berbasis data. Fokus kami adalah memastikan setiap traffic yang masuk berpeluang tinggi menjadi pembeli.",
  },
  {
    question: "Layanan mana yang paling cocok untuk bisnis saya?",
    answer:
      "Jika Anda ingin hasil cepat dan terukur, Performance Marketing (Ads) adalah pilihan terbaik. Namun, jika Anda ingin membangun otoritas jangka panjang, kombinasi SEO dan Content Strategy sangat disarankan. Tim kami akan memberikan audit gratis untuk menentukan strategi yang paling efisien bagi budget Anda.",
  },
  {
    question: "Berapa budget iklan minimal yang harus saya siapkan?",
    answer:
      "Budget iklan sangat fleksibel dan tergantung pada industri serta target jangkauan Anda. Kami biasanya menyarankan budget mulai dari 3-5 juta per bulan untuk fase testing awal guna mengumpulkan data audiens sebelum melakukan scaling up.",
  },
  {
    question: "Apakah OmzetNaik.id menjamin kenaikan penjualan?",
    answer:
      "Kami menjamin optimasi teknis yang maksimal (CTR tinggi, CPC rendah, dan landing page cepat). Penjualan akhir dipengaruhi oleh kualitas produk dan tim sales Anda, namun kami akan mendampingi proses optimasi funnel agar conversion rate bisnis Anda meningkat drastis.",
  },
  {
    question: "Berapa lama waktu yang dibutuhkan untuk melihat hasil?",
    answer:
      "Untuk layanan iklan (Ads), hasil berupa leads biasanya bisa terlihat dalam 48-72 jam setelah campaign running. Untuk layanan SEO dan Branding, hasil yang signifikan umumnya terlihat dalam rentang waktu 3 hingga 6 bulan.",
  },
  {
    question: "Bagaimana cara saya memantau performa iklan?",
    answer:
      "Transparansi adalah kunci. Anda akan mendapatkan akses ke dashboard laporan real-time dan laporan mingguan/bulanan yang komprehensif. Anda bisa melihat secara jelas berapa budget yang terpakai dan berapa banyak leads/omzet yang dihasilkan.",
  },
];

interface FAQItemProps {
  item: { question: string; answer: string };
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ item, isOpen, onClick }: FAQItemProps) => (
  <div className="border-b border-border last:border-0">
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center text-left gap-4 py-7 transition-all ${
        isOpen ? "text-primary" : "text-primary hover:text-secondary"
      }`}
    >
      <h3 className="text-lg font-heading font-bold leading-tight">
        {item.question}
      </h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className={`flex-shrink-0 p-1.5 rounded-xl ${
          isOpen ? "bg-accent text-white" : "bg-neutral-soft text-slate-400"
        }`}
      >
        <ChevronDown size={20} />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pb-8 pr-4">
            <div className="w-12 h-1 bg-accent/20 mb-4 rounded-full"></div>
            <p className="text-slate-600 leading-relaxed font-sans text-base">
              {item.answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleItemClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 md:py-32 bg-white relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Kolom Kiri: Intro Agensi */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-soft border border-border text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <HelpCircle size={14} className="text-accent" />
              <span>Knowledge Base</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-primary mb-6 leading-[1.1]">
              Hal yang Sering <br />
              <span className="text-accent italic">Ditanyakan.</span>
            </h2>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-sans">
              Kami percaya transparansi adalah kunci kemitraan. Berikut adalah
              ringkasan informasi untuk membantu Anda memahami bagaimana
              OmzetNaik.id mempercepat pertumbuhan bisnis Anda.
            </p>

            {/* Desktop CTA Card */}
            <div className="hidden lg:block bg-primary p-10 rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <p className="text-xl font-heading font-bold text-white mb-3 relative z-10">
                Masih butuh penjelasan?
              </p>
              <p className="text-sm text-slate-300 mb-8 relative z-10 font-sans">
                Tim strategist kami siap memberikan sesi brainstorming gratis
                selama 15 menit untuk bisnis Anda.
              </p>
              <a
                href="#contact"
                className="btn-primary w-full py-4 text-base relative z-10"
              >
                Tanya Lewat WhatsApp
              </a>
            </div>
          </div>

          {/* Kolom Kanan: List FAQ */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[3rem] border border-border p-8 md:p-12 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
              {faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  item={item}
                  isOpen={activeIndex === index}
                  onClick={() => handleItemClick(index)}
                />
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-12 text-center lg:hidden">
              <p className="text-slate-500 text-sm mb-4 font-sans">
                Belum menemukan jawaban yang dicari?
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-accent font-bold border-b-2 border-accent/20 hover:border-accent transition-all pb-1 uppercase tracking-widest text-xs"
              >
                <MessageCircle size={16} /> Konsultasi Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
