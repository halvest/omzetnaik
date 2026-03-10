// src/components/FAQ.tsx
import React, { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  <div className="border-b border-slate-100 last:border-0">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left gap-6 py-8 transition-all group"
    >
      <h3
        className={`text-lg lg:text-xl font-bold leading-tight transition-colors duration-300 ${
          isOpen ? "text-accent" : "text-primary group-hover:text-accent"
        }`}
      >
        {item.question}
      </h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        className={`flex-shrink-0 p-2 rounded-full transition-colors duration-300 ${
          isOpen
            ? "bg-accent text-white"
            : "bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white"
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
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="overflow-hidden"
        >
          <div className="pb-8 pr-6">
            <p className="text-slate-500 leading-relaxed font-medium text-base lg:text-lg italic border-l-2 border-accent/20 pl-6">
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

  return (
    <section
      id="faq"
      className="py-24 lg:py-40 bg-white relative overflow-hidden font-sans"
    >
      {/* Refined Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          {/* LEFT COLUMN: Sticky Intro */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
            >
              <HelpCircle size={14} className="text-accent" />
              <span>Knowledge Base</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.2, 0, 0, 1] }}
              className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-[1.05] tracking-tighter"
            >
              Hal yang Sering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400 italic">
                Ditanyakan.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-lg lg:text-xl font-medium mb-12 leading-relaxed"
            >
              Kami percaya transparansi adalah kunci kemitraan. Berikut adalah
              ringkasan informasi untuk membantu Anda memahami bagaimana
              strategi kami mempercepat pertumbuhan bisnis Anda.
            </motion.p>

            {/* Premium CTA Card (Vercel Style) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="hidden lg:block bg-primary p-10 rounded-[bento] shadow-premium relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/20 transition-colors" />
              <p className="text-2xl font-bold text-white mb-4 relative z-10 tracking-tight">
                Masih butuh penjelasan?
              </p>
              <p className="text-slate-400 mb-10 relative z-10 font-medium leading-relaxed">
                Tim strategist kami siap memberikan sesi brainstorming gratis
                selama 15 menit untuk membedah potensi bisnis Anda.
              </p>
              <a
                href="#contact"
                className="btn-primary w-full !py-4 text-sm flex items-center justify-center gap-3 shadow-accent-glow"
              >
                Tanya Lewat WhatsApp <ArrowRight size={18} />
              </a>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: FAQ List */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[bento] border border-slate-100 p-8 md:p-14 shadow-premium hover:shadow-premium-hover transition-all duration-700"
            >
              {faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  item={item}
                  isOpen={activeIndex === index}
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                />
              ))}
            </motion.div>

            {/* Mobile CTA */}
            <div className="mt-12 text-center lg:hidden">
              <p className="text-slate-500 text-base mb-6 font-medium">
                Belum menemukan jawaban yang dicari?
              </p>
              <a
                href="#contact"
                className="btn-primary w-full !py-4 rounded-2xl flex items-center justify-center gap-3 shadow-accent-glow"
              >
                <MessageCircle size={20} /> Konsultasi Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
