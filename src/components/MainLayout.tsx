// src/components/MainLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

// ✨ Export tipe ini agar bisa di-import di LandingPage.tsx
export type OutletContextType = {
  setCurrentSection: (section: string) => void;
  handleSectionChange: (sectionId: string) => void;
};

export default function MainLayout() {
  const [currentSection, setCurrentSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  // Cek apakah sedang di halaman utama untuk logika padding header
  const isHomePage = location.pathname === "/";

  // 1. Reset section state saat pindah halaman & Scroll to Top
  useEffect(() => {
    if (!isHomePage) {
      setCurrentSection("");
    } else {
      setCurrentSection("home");
    }

    // ✨ Scroll to Top setiap ganti halaman (Kecuali jika ada hash/scroll state)
    // Ini penting agar user tidak 'mendarat' di tengah halaman saat pindah menu
    if (!location.state?.scrollToSection && !location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, isHomePage, location.state, location.hash]);

  // 2. Handle Scroll ke Section (saat navigate dari halaman lain ke Home)
  useEffect(() => {
    if (isHomePage && location.state?.scrollToSection) {
      const targetSection = location.state.scrollToSection;

      // Delay sedikit untuk memastikan DOM sudah dirender sepenuhnya
      setTimeout(() => {
        const element = document.getElementById(targetSection);
        if (element) {
          // Offset sedikit (-80px) agar judul section tidak tertutup Header Fixed
          const y = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);

      // Opsional: Bersihkan state agar tidak scroll ulang saat refresh
      // window.history.replaceState({}, document.title);
    }
  }, [location, isHomePage]);

  const handleSectionChange = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollToSection: sectionId } });
    }
  };

  return (
    // Gunakan background tema (secondary-50) dan struktur flex column
    <div className="bg-secondary-50 min-h-screen flex flex-col font-sans text-primary-950">
      <Header
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
      />

      {/* ✨ Logika Padding Konten:
         - Jika Home: Padding 0 (agar Hero image bisa full screen di belakang header transparan)
         - Jika Halaman Lain: Padding top 24/28 (agar konten tulisan tidak tertutup header fixed)
      */}
      <main
        className={`flex-grow w-full ${isHomePage ? "" : "pt-24 lg:pt-28"}`}
      >
        <Outlet
          context={
            {
              setCurrentSection,
              handleSectionChange,
            } satisfies OutletContextType
          }
        />
      </main>

      <Footer />
    </div>
  );
}
