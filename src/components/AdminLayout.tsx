// src/components/AdminLayout.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import { supabase } from "../utils/supabase";
import {
  LayoutDashboard,
  Home,
  Users,
  BarChart,
  LogOut,
  Target,
  Menu,
  X,
  ChevronRight,
  FileText,
  Briefcase,
  Layers, // Icon untuk Portfolio
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

// --- Menu Konfigurasi Terintegrasi ---
const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/property", label: "Listing Properti", icon: Home },
  { href: "/admin/services", label: "Layanan Agency", icon: Briefcase },
  { href: "/admin/portfolio", label: "Case Studies", icon: Layers }, // Menu Baru
  { href: "/admin/posts", label: "Kelola Blog", icon: FileText },
  { href: "/admin/leads", label: "Manajemen Prospek", icon: Users },
  { href: "/admin/analytics", label: "Analitik Performa", icon: BarChart },
];

const SidebarContent = ({
  user,
  onLogout,
  onClose,
}: {
  user: User | null;
  onLogout: () => void;
  onClose?: () => void;
}) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <Link
          to="/admin"
          className="flex items-center gap-3 group"
          onClick={onClose}
        >
          <div className="bg-[#0F1F4A] p-2 rounded-xl text-white group-hover:bg-[#FF3B3B] transition-all duration-300 shadow-lg shadow-primary/20">
            <Target size={20} />
          </div>
          <span className="text-xl font-heading font-extrabold tracking-tighter text-[#0F1F4A]">
            Omzet<span className="text-[#FF3B3B]">Naik</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
          Core Management
        </p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.href === "/admin"}
              onClick={onClose}
              className={({ isActive: linkActive }) =>
                `flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                  linkActive
                    ? "bg-[#0F1F4A] text-white shadow-xl shadow-primary/20 translate-x-1"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#0F1F4A]"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={20}
                  className={`shrink-0 transition-colors ${
                    isActive ? "text-[#FF3B3B]" : "group-hover:text-[#FF3B3B]"
                  }`}
                />
                {item.label}
              </div>
              <ChevronRight
                size={14}
                className={`transition-all duration-300 ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              />
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-100 bg-[#F8FAFC]">
        <div className="flex items-center gap-3 px-3 py-4 mb-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#0F1F4A] text-white flex items-center justify-center font-black shadow-md shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-[#0F1F4A] truncate uppercase">
              {user?.email?.split("@")[0]}
            </p>
            <p className="text-[9px] text-[#FF3B3B] font-black uppercase tracking-widest">
              Verified Admin
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        navigate("/login");
      } else if (session) {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Gagal logout: " + error.message);
    } else {
      toast.success("Logout Berhasil");
      navigate("/login");
    }
  }, [navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-[#FF3B3B]" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: "16px", fontWeight: "bold", fontSize: "14px" },
        }}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-slate-100 bg-white">
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#0F1F4A]/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 z-[110] shadow-2xl lg:hidden"
            >
              <SidebarContent
                user={user}
                onLogout={handleLogout}
                onClose={() => setIsSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 text-[#0F1F4A] bg-[#F8FAFC] rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:block">
              <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                OmzetNaik Dashboard
              </h2>
              <p className="text-sm font-bold text-[#0F1F4A]">
                System Controller v2.0
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-[#0F1F4A] uppercase tracking-widest">
                {user?.email?.split("@")[0]}
              </p>
              <p className="text-[9px] font-bold text-emerald-500 uppercase flex items-center justify-end gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                Active
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-black text-[#0F1F4A] text-xs">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-[#F8FAFC] custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}
