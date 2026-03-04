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
} from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logoLight from "../assets/images/main_logo_white.png";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleFooterNavClick = (to: string) => {
    const [path, hash] = to.split("#");
    if (path === "" && hash) {
      if (location.pathname === "/") {
        const element = document.getElementById(hash);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      } else {
        navigate("/", { state: { scrollToSection: hash } });
      }
    } else {
      navigate(path || "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#0F1F4A] text-slate-400 font-sans border-t border-white/5 relative">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Brand & Social - Lebih Ramping */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              to="/"
              onClick={() => handleFooterNavClick("/")}
              className="block"
            >
              <img
                src={logoLight}
                alt="Logo"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-xs leading-relaxed max-w-xs text-slate-500">
              Akselerasi pertumbuhan bisnis melalui strategi digital marketing
              berbasis data.
            </p>
            <div className="flex gap-4 pt-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-slate-500 hover:text-[#FF3B3B] transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links - Inline Style */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2 text-[13px]">
              {["Services", "Portfolio", "Property", "Blog"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() =>
                      handleFooterNavClick(`/${item.toLowerCase()}`)
                    }
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Compact */}
          <div className="lg:col-span-3">
            <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-4">
              Kontak
            </h4>
            <ul className="space-y-3 text-[13px]">
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-[#FF3B3B]" />
                <span className="truncate">admin@omzetnaik.id</span>
              </li>
              <li className="flex items-center gap-3 font-bold text-white">
                <Phone size={14} className="text-[#FF3B3B]" />
                <span>+62 831 4494 0611</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={14} className="text-[#FF3B3B]" />
                <span className="truncate text-[11px]">
                  Seturan No. 18, Yogyakarta
                </span>
              </li>
            </ul>
          </div>

          {/* CTA - Small Card */}
          <div className="lg:col-span-3">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <p className="text-[11px] text-slate-300 font-bold mb-3">
                Siap Scale Up Bisnis?
              </p>
              <button
                onClick={() => handleFooterNavClick("/#contact")}
                className="w-full py-2.5 bg-[#FF3B3B] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white hover:text-[#0F1F4A] transition-all flex items-center justify-center gap-2"
              >
                Free Strategy Call <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Ultra Slim */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          <p>© {new Date().getFullYear()} OmzetNaik.id</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
