// src/pages/LandingPage.tsx
import React, { useRef, useEffect, lazy, Suspense } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { OutletContextType } from "../components/MainLayout";

// ✨ Hero diload Eager untuk LCP (Largest Contentful Paint) optimization
import Hero from "../components/Hero";

// ✨ Lazy Load komponen sesuai struktur materi OmzetNaik.id
const About = lazy(() => import("../components/About"));
const DigitalServices = lazy(() => import("../components/DigitalServices"));
const WeServe = lazy(() => import("../components/WeServe")); // Komponen Spesialisasi Industri
const AgencyPortfolio = lazy(() => import("../components/AgencyPortfolio"));
const WhyChooseUs = lazy(() => import("../components/WhyChooseUs"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const BlogSection = lazy(() => import("../components/BlogSection"));
const ConsultationForm = lazy(() => import("../components/ConsultationForm"));
const FAQ = lazy(() => import("../components/FAQ"));

// Loader Minimalis bertema Midnight Navy
const SectionLoader = () => (
  <div className="py-24 flex justify-center items-center w-full bg-[#F8FAFC]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-[#FF3B3B] rounded-full animate-spin"></div>
      <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
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
    about: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    industries: useRef<HTMLDivElement>(null),
    portfolio: useRef<HTMLDivElement>(null),
    why: useRef<HTMLDivElement>(null),
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

  // 2. SCROLL HANDLER (Deep Linking)
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
          OmzetNaik.id | Digital Agency Partner - Meroketkan Omzet Bisnis Anda
        </title>
        <meta
          name="description"
          content="OmzetNaik.id membantu brand Anda mendominasi pasar melalui strategi Digital Marketing, Advertising (Meta & Google Ads), Branding, dan Promosi yang terukur. [cite: 3]"
        />
        <link rel="canonical" href="https://omzetnaik.id/" />
      </Helmet>

      {/* 1. HERO: STRATEGIC VALUE PROPOSITION */}
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

      {/* 2. ABOUT: VISION & MISSION [cite: 6, 8] */}
      <Suspense fallback={<SectionLoader />}>
        <div id="about" ref={sectionRefs.about}>
          <About />
        </div>
      </Suspense>

      {/* 3. INDUSTRIES: SECTOR SPECIALIZATION  */}
      <Suspense fallback={<SectionLoader />}>
        <div id="industries" ref={sectionRefs.industries}>
          <WeServe />
        </div>
      </Suspense>

      {/* 4. SERVICES: DIGITAL SOLUTIONS */}
      <Suspense fallback={<SectionLoader />}>
        <div id="services" ref={sectionRefs.services}>
          <DigitalServices />
        </div>
      </Suspense>

      {/* 5. PORTFOLIO: CASE STUDIES  */}
      <Suspense fallback={<SectionLoader />}>
        <div id="portfolio" ref={sectionRefs.portfolio}>
          <AgencyPortfolio />
        </div>
      </Suspense>

      {/* 6. WHY CHOOSE US: DATA-DRIVEN STRATEGY [cite: 38, 41] */}
      <Suspense fallback={<SectionLoader />}>
        <div id="why" ref={sectionRefs.why}>
          <WhyChooseUs />
        </div>
      </Suspense>

      {/* 7. TESTIMONIALS */}
      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      {/* 8. BLOG: INSIGHTS & EDUCATION */}
      <Suspense fallback={<SectionLoader />}>
        <div id="blog" ref={sectionRefs.blog}>
          <BlogSection />
        </div>
      </Suspense>

      {/* 9. CONTACT: CONSULTATION FORM [cite: 54] */}
      <Suspense fallback={<SectionLoader />}>
        <div id="contact" ref={sectionRefs.contact}>
          <ConsultationForm />
        </div>
      </Suspense>

      {/* 10. FAQ */}
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
    </>
  );
}
