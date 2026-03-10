// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Menu,
  X,
  MessageCircle,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import logoLight from "../assets/images/main_logo_white.png";
import logoDark from "../assets/images/main_logo_dark.png";

interface MenuItem {
  id: string;
  label: string;
  to: string;
}

// URUTAN MENU BARU
const menuItems: MenuItem[] = [
  { id: "home", label: "Beranda", to: "/" },
  { id: "about", label: "Tentang Kami", to: "/#about" }, // Menuju section about di landing
  { id: "services", label: "Produk", to: "/services" }, // Katalog Jasa/Produk
  { id: "portfolio", label: "Portofolio", to: "/portfolio" },
  { id: "blog", label: "Blog & Tips", to: "/blog" },
];

const mobileDropdownVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.2, 0, 0, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
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

  // Memaksa Header menjadi mode "Dark/Solid" jika tidak di halaman Home (/)
  const isNotHome = location.pathname !== "/";
  const shouldBeSolid = hasScrolled || isMenuOpen || isNotHome;

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 40);
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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out flex items-center ${
          shouldBeSolid
            ? "h-20 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg shadow-primary/5"
            : "h-28 bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between px-6 mx-auto">
          {/* --- LOGO AREA --- */}
          <Link to="/" className="flex items-center gap-4 group shrink-0">
            <div className="relative h-10 w-auto overflow-hidden md:h-12">
              <img
                src={logoLight}
                alt="OmzetNaik.id"
                className={`h-full w-auto object-contain transition-all duration-500 ${
                  shouldBeSolid
                    ? "opacity-0 -translate-y-full"
                    : "opacity-100 translate-y-0"
                }`}
              />
              <img
                src={logoDark}
                alt="OmzetNaik.id"
                className={`h-full w-auto object-contain absolute top-0 left-0 transition-all duration-500 ${
                  shouldBeSolid
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-full"
                }`}
              />
            </div>

            <div className="flex flex-col">
              <span
                className={`text-2xl font-bold tracking-tighter leading-none transition-colors duration-500 ${
                  shouldBeSolid ? "text-primary" : "text-white"
                }`}
              >
                Omzet
                <span
                  className={
                    shouldBeSolid ? "text-accent italic" : "text-white italic"
                  }
                >
                  Naik
                </span>
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    shouldBeSolid ? "bg-accent" : "bg-white"
                  }`}
                />
                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.25em] transition-colors duration-700 ${
                    shouldBeSolid ? "text-slate-400" : "text-white/60"
                  }`}
                >
                  Growth Agency
                </span>
              </div>
            </div>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <nav className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-6 px-4 py-2">
              {menuItems.map((item) => {
                const [path, hash] = item.to.split("#");
                const isActive = hash
                  ? currentSection === hash
                  : location.pathname === (path || "/");

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.to)}
                    className={`text-[13px] font-bold tracking-wide transition-all duration-300 relative group/nav ${
                      shouldBeSolid
                        ? isActive
                          ? "text-accent"
                          : "text-slate-600 hover:text-primary"
                        : isActive
                          ? "text-white"
                          : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover/nav:w-full ${
                        isActive ? "w-full" : ""
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleWhatsApp}
              className={`group flex items-center gap-3 px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-md active:scale-95 ${
                shouldBeSolid
                  ? "bg-primary text-white hover:bg-slate-900 shadow-primary/10"
                  : "bg-white text-primary hover:shadow-accent-glow"
              }`}
            >
              <Sparkles
                size={14}
                className="text-accent group-hover:rotate-12 transition-transform"
              />
              Kontak Kami
            </button>
          </nav>

          {/* --- MOBILE TOGGLE --- */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-3 rounded-2xl transition-all duration-500 ${
              shouldBeSolid
                ? "text-primary bg-slate-100"
                : "text-white bg-white/10 backdrop-blur-md border border-white/20"
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* --- MOBILE DROPDOWN --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileDropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-[calc(100%+12px)] left-6 right-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden lg:hidden p-4 z-[110]"
            >
              <div className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.to)}
                    className="group w-full flex items-center justify-between px-8 py-5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-accent rounded-[1.5rem] transition-all"
                  >
                    {item.label}
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </button>
                ))}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-3 bg-primary text-white py-6 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.3em] shadow-lg active:scale-95 transition-all"
                  >
                    <MessageCircle size={20} className="text-accent" />
                    Free Strategy Call
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- BLUR OVERLAY --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-[90] bg-primary/40 backdrop-blur-md lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
