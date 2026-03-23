import React, { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "Bagaimana cara kerja sistem 'Omzet Naik' ini?",
    answer:
      "Kami membangun funnel pemasaran digital yang komprehensif, mulai dari riset audiens hingga menjalankan iklan Meta & Google Ads yang berbasis data untuk memastikan traffic berkualitas menjadi pembeli.",
  },
  {
    question: "Layanan mana yang paling cocok untuk bisnis saya?",
    answer:
      "Performance Marketing (Ads) cocok untuk hasil cepat. SEO & Content Strategy untuk jangka panjang. Tim kami akan memberikan audit gratis untuk menentukan strategi paling efisien bagi budget Anda.",
  },
  {
    question: "Berapa budget iklan minimal yang disarankan?",
    answer:
      "Budget sangat fleksibel. Kami menyarankan mulai dari 3-5 juta per bulan untuk fase testing awal guna mengumpulkan data audiens sebelum melakukan scaling up.",
  },
  {
    question: "Apakah OmzetNaik.id menjamin penjualan?",
    answer:
      "Kami menjamin optimasi teknis maksimal (CTR tinggi, CPC rendah). Penjualan dipengaruhi produk dan tim sales Anda, namun kami mendampingi optimasi funnel agar conversion rate meningkat drastis.",
  },
  {
    question: "Berapa lama waktu untuk melihat hasil?",
    answer:
      "Iklan (Ads) biasanya memberikan leads dalam 48-72 jam. Untuk layanan SEO dan Branding, hasil signifikan umumnya terlihat dalam rentang waktu 3 hingga 6 bulan.",
  },
  {
    question: "Bagaimana cara saya memantau performa iklan?",
    answer:
      "Transparansi adalah kunci. Anda mendapatkan akses ke dashboard laporan real-time dan laporan mingguan yang komprehensif mengenai budget dan leads yang dihasilkan.",
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
      className="w-full flex justify-between items-center text-left gap-6 py-5 lg:py-6 transition-all group"
    >
      <h3
        className={`text-base lg:text-lg font-bold leading-tight transition-colors duration-300 ${
          isOpen ? "text-accent" : "text-slate-900 group-hover:text-accent"
        }`}
      >
        {item.question}
      </h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${
          isOpen ? "bg-accent text-white" : "bg-slate-50 text-slate-400"
        }`}
      >
        <ChevronDown size={18} />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pb-6 pr-4">
            <p className="text-slate-500 leading-relaxed font-medium text-sm lg:text-base border-l-2 border-accent/20 pl-4">
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
      className="relative min-h-screen lg:h-screen flex items-center bg-white overflow-hidden font-sans py-12 lg:py-0 lg:max-h-[900px]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />

      <div className="container relative z-10 px-6 mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-24 items-center">
          {/* LEFT COLUMN: Header & Info */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <HelpCircle size={14} className="text-accent" />
              <span>Knowledge Base</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tighter"
            >
              Hal yang Sering <br />
              <span className="relative inline-block pr-8 -mr-8 py-1">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-orange-400 italic">
                  Ditanyakan.
                </span>
                <div className="absolute -bottom-1 left-0 right-8 h-2 bg-accent/10 -z-10 rounded-full" />
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-slate-500 text-base lg:text-lg font-medium mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Kami percaya transparansi adalah kunci kemitraan. Berikut
              ringkasan informasi strategi kami mempercepat pertumbuhan bisnis
              Anda.
            </motion.p>

            {/* Desktop CTA Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="hidden lg:block bg-slate-900 p-8 rounded-[2rem] relative overflow-hidden group shadow-xl"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors" />
              <p className="text-xl font-bold text-white mb-3 relative z-10">
                Butuh Penjelasan Lebih?
              </p>
              <p className="text-slate-400 text-sm mb-6 relative z-10 leading-relaxed">
                Tim strategist kami siap memberikan sesi brainstorming gratis
                selama 15 menit.
              </p>
              <a
                href="#contact"
                className="w-full bg-accent text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-slate-900 transition-all shadow-lg shadow-accent/20"
              >
                Tanya via WhatsApp <ArrowRight size={16} />
              </a>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: FAQ List - Scrollable on Desktop */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] border border-slate-100 p-6 lg:p-10 shadow-xl lg:max-h-[600px] overflow-y-auto no-scrollbar"
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
            <div className="mt-8 text-center lg:hidden px-4">
              <a
                href="#contact"
                className="w-full bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest shadow-lg"
              >
                <MessageCircle size={18} /> Konsultasi Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
