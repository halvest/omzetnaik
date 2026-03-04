// src/pages/LandingPage.tsx
import React, { useRef, useEffect, lazy, Suspense } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { OutletContextType } from "../components/MainLayout";

// ✨ Hero diload Eager (LCP optimization)
import Hero from "../components/Hero";

// ✨ Lazy Load komponen sesuai fungsi Agensi baru
const DigitalServices = lazy(() => import("../components/DigitalServices"));
const AgencyPortfolio = lazy(() => import("../components/AgencyPortfolio"));
const WhyChooseUs = lazy(() => import("../components/WhyChooseUs"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const About = lazy(() => import("../components/About"));
const BlogSection = lazy(() => import("../components/BlogSection"));
const ConsultationForm = lazy(() => import("../components/ConsultationForm"));
const FAQ = lazy(() => import("../components/FAQ"));

// Loader Minimalis bertema OmzetNaik (Midnight Navy)
const SectionLoader = () => (
  <div className="py-24 flex justify-center items-center w-full bg-[#F5F7FB]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0F1F4A] rounded-full animate-spin"></div>
      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
        Sinkronisasi...
      </span>
    </div>
  </div>
);

export default function LandingPage() {
  const { setCurrentSection } = useOutletContext<OutletContextType>();
  const location = useLocation();

  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    portfolio: useRef<HTMLDivElement>(null),
    why: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    blog: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  // 1. INTERSECTION OBSERVER (Untuk Navigasi Aktif)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [setCurrentSection]);

  // 2. SCROLL HANDLER
  useEffect(() => {
    if (location.state?.scrollToSection) {
      const sectionId = location.state.scrollToSection;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 500);
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>
          OmzetNaik.id | Digital Marketing Agency & Property Performance
        </title>
        <meta
          name="description"
          content="Tingkatkan omzet bisnis properti Anda dengan strategi Performance Marketing, Meta Ads, dan SEO dari OmzetNaik.id. Solusi data-driven untuk pertumbuhan eksponensial."
        />
        <link rel="canonical" href="https://omzetnaik.id/" />
      </Helmet>

      {/* 1. HERO: DIGITAL MARKETING FOCUS */}
      <div id="home" ref={sectionRefs.home}>
        <Hero
          onSectionChange={(id) => {
            const el = document.getElementById(id);
            if (el) {
              const y = el.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          }}
        />
      </div>

      {/* 2. SERVICES: LAYANAN AGENSI */}
      <Suspense fallback={<SectionLoader />}>
        <div id="services" ref={sectionRefs.services}>
          <DigitalServices />
        </div>
      </Suspense>

      {/* 3. PORTFOLIO: CASE STUDIES */}
      <Suspense fallback={<SectionLoader />}>
        <div id="portfolio" ref={sectionRefs.portfolio}>
          <AgencyPortfolio />
        </div>
      </Suspense>

      {/* 4. WHY US: CORE VALUES & STATS */}
      <Suspense fallback={<SectionLoader />}>
        <div id="why" ref={sectionRefs.why}>
          <WhyChooseUs />
        </div>
      </Suspense>

      {/* 5. TESTIMONIALS */}
      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      {/* 6. ABOUT & VISION */}
      <Suspense fallback={<SectionLoader />}>
        <div id="about" ref={sectionRefs.about}>
          <About />
        </div>
      </Suspense>

      {/* 7. BLOG: SEO & EDUKASI */}
      <Suspense fallback={<SectionLoader />}>
        <div id="blog" ref={sectionRefs.blog}>
          <BlogSection />
        </div>
      </Suspense>

      {/* 8. CTA: CONSULTATION FORM */}
      <Suspense fallback={<SectionLoader />}>
        <div id="contact" ref={sectionRefs.contact}>
          <ConsultationForm />
        </div>
      </Suspense>

      {/* 9. FAQ */}
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
    </>
  );
}
