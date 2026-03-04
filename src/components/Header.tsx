// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Menu, X, MessageCircle, ChevronRight, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import logoLight from "../assets/images/main_logo_white.png";
import logoDark from "../assets/images/main_logo_dark.png";

interface MenuItem {
  id: string;
  label: string;
  to: string;
}

const menuItems: MenuItem[] = [
  { id: "home", label: "Beranda", to: "/" },
  { id: "services", label: "Layanan", to: "/#services" },
  { id: "portfolio", label: "Portofolio", to: "/#portfolio" },
  { id: "properti", label: "Katalog Properti", to: "/properti" },
  { id: "blog", label: "Blog & Tips", to: "/blog" },
  { id: "contact", label: "Konsultasi", to: "/#contact" },
];

const mobileDropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function Header({
  currentSection,
  onSectionChange,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleNavClick = (to: string) => {
    const [path, hash] = to.split("#");
    if (
      path === location.pathname ||
      (path === "" && location.pathname === "/")
    ) {
      if (hash) {
        onSectionChange(hash);
        const element = document.getElementById(hash);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      navigate(to);
    }
    setIsMenuOpen(false);
  };

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/6283144940611?text=Halo%20OmzetNaik.id,%20saya%20tertarik%20dengan%20layanan%20marketing%20Anda.",
      "_blank",
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 flex items-center ${
          hasScrolled || isMenuOpen
            ? "h-20 bg-white/95 backdrop-blur-md shadow-xl shadow-primary/5 border-b border-slate-100"
            : "h-24 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* LOGO AREA */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-9 md:h-11 overflow-hidden transition-all duration-500">
              <img
                src={logoLight}
                alt="OmzetNaik.id"
                className={`h-full w-auto object-contain transition-all duration-500 ${
                  hasScrolled || isMenuOpen
                    ? "opacity-0 -translate-y-full"
                    : "opacity-100 translate-y-0"
                }`}
              />
              <img
                src={logoDark}
                alt="OmzetNaik.id"
                className={`h-full w-auto object-contain absolute top-0 left-0 transition-all duration-500 ${
                  hasScrolled || isMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-full"
                }`}
              />
            </div>

            <div className="flex flex-col leading-none">
              <span
                className={`text-xl font-heading font-extrabold tracking-tighter transition-colors duration-500 ${
                  hasScrolled || isMenuOpen ? "text-[#0F1F4A]" : "text-white"
                }`}
              >
                Omzet
                <span
                  className={
                    hasScrolled || isMenuOpen ? "text-[#FF3B3B]" : "text-white"
                  }
                >
                  Naik
                </span>
              </span>
              <span
                className={`text-[8px] font-black uppercase tracking-[0.3em] mt-0.5 transition-colors duration-500 ${
                  hasScrolled || isMenuOpen ? "text-slate-400" : "text-white/60"
                }`}
              >
                Performance Agency
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV - TANPA GARIS BAWAH */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => {
              const [path, hash] = item.to.split("#");
              const isActive = hash
                ? currentSection === hash
                : location.pathname === (path || "/");

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.to)}
                  className={`text-sm font-bold transition-all duration-300 py-2 ${
                    hasScrolled
                      ? isActive
                        ? "text-[#FF3B3B] scale-105"
                        : "text-slate-600 hover:text-[#0F1F4A]"
                      : isActive
                        ? "text-white scale-105"
                        : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={handleWhatsApp}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:shadow-xl active:scale-95 ${
                hasScrolled
                  ? "bg-[#0F1F4A] text-white shadow-lg shadow-primary/20"
                  : "bg-[#FF3B3B] text-white shadow-xl shadow-red-600/20"
              }`}
            >
              <TrendingUp size={14} />
              Scale Up Now
            </button>
          </nav>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-3 rounded-2xl transition-all ${
              hasScrolled || isMenuOpen
                ? "text-[#0F1F4A] bg-slate-100"
                : "text-white bg-white/10 backdrop-blur-md border border-white/20"
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileDropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-[calc(100%+12px)] left-6 right-6 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden lg:hidden"
            >
              <div className="flex flex-col p-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.to)}
                    className="group w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#FF3B3B] rounded-2xl transition-all"
                  >
                    {item.label}
                    <ChevronRight
                      size={18}
                      className="text-slate-300 group-hover:text-[#FF3B3B] group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ))}
                <div className="mt-4 pt-2">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-3 bg-[#0F1F4A] text-white py-5 rounded-3xl text-sm font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                  >
                    <MessageCircle size={20} />
                    Free Strategy Call
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-[65] bg-[#0F1F4A]/30 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
