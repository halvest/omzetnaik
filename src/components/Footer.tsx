// src/components/Footer.tsx
import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logoLight from "../assets/images/main_logo_white.png";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleFooterNavClick = (to: string) => {
    const [path, hash] = to.split("#");

    // Logic untuk scroll ke section jika di halaman yang sama, atau navigasi lintas halaman
    if (path === "" || path === location.pathname) {
      if (hash) {
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
      // Auto scroll ke atas saat pindah halaman
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return (
    <footer className="bg-[#0F1F4A] text-slate-400 font-sans border-t border-white/5 relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3B3B]/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />

      <div className="container mx-auto px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-10 items-start">
          {/* --- BRAND COLUMN --- */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              to="/"
              onClick={() => handleFooterNavClick("/")}
              className="inline-block group"
            >
              <img
                src={logoLight}
                alt="OmzetNaik.id"
                className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <p className="text-[13px] leading-relaxed max-w-xs text-slate-400 font-medium">
              Partner akselerasi bisnis Anda. Kami mengintegrasikan data,
              kreativitas, dan teknologi untuk mendominasi pasar digital.
            </p>
            <div className="flex gap-4 pt-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#FF3B3B] hover:text-white transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* --- NAVIGATION COLUMN --- */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-4 h-px bg-[#FF3B3B]"></span> Navigasi
            </h4>
            <ul className="space-y-4 text-[13px] font-bold">
              {[
                { name: "Services", to: "/#services" },
                { name: "Portfolio", to: "/#portfolio" },
                { name: "Property", to: "/properti" },
                { name: "Insights", to: "/blog" },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleFooterNavClick(item.to)}
                    className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* --- CONTACT COLUMN --- */}
          <div className="lg:col-span-3">
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-4 h-px bg-[#FF3B3B]"></span> Headquarters
            </h4>
            <ul className="space-y-5 text-[13px]">
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#FF3B3B]/20 transition-colors">
                  <Mail size={14} className="text-[#FF3B3B]" />
                </div>
                <span className="text-slate-300 font-medium">
                  partnership@omzetnaik.id
                </span>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#FF3B3B]/20 transition-colors">
                  <Phone size={14} className="text-[#FF3B3B]" />
                </div>
                <span className="text-white font-bold tracking-tight">
                  +62 831 4494 0611
                </span>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#FF3B3B]/20 transition-colors">
                  <MapPin size={14} className="text-[#FF3B3B]" />
                </div>
                <span className="text-[12px] leading-relaxed text-slate-400">
                  Business Park Seturan No. 18, <br />
                  Sleman, DIY 55281
                </span>
              </li>
            </ul>
          </div>

          {/* --- CTA CARD --- */}
          <div className="lg:col-span-3">
            <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp size={120} />
              </div>
              <p className="text-sm text-white font-bold mb-2">
                Ready to dominate?
              </p>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Amankan slot konsultasi gratis dengan pakar growth marketing
                kami.
              </p>
              <button
                onClick={() => handleFooterNavClick("/#contact")}
                className="w-full py-4 bg-[#FF3B3B] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-[#0F1F4A] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 active:scale-95"
              >
                Start Your Journey <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <ShieldCheck size={14} className="text-emerald-500/50" />
            <span>
              © {new Date().getFullYear()} OmzetNaik Performance Agency.
            </span>
          </div>

          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a
              href="#"
              className="text-slate-600 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/admin"
              className="text-[#FF3B3B]/60 hover:text-[#FF3B3B] transition-colors flex items-center gap-1"
            >
              Admin Access <ArrowUpRight size={10} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
