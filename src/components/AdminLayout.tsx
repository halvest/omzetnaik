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
  Layers,
  Loader2,
  Bell,
  Settings,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/property", label: "Listing Properti", icon: Home },
  { href: "/admin/services", label: "Layanan Agency", icon: Briefcase },
  { href: "/admin/portfolio", label: "Case Studies", icon: Layers },
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
    <div className="flex flex-col h-full bg-white font-sans border-r border-slate-100">
      {/* --- LOGO AREA --- */}
      <div className="h-20 px-8 flex items-center justify-between">
        <Link
          to="/admin"
          className="flex items-center gap-3 group"
          onClick={onClose}
        >
          <div className="bg-primary p-2.5 rounded-xl text-white group-hover:bg-accent transition-all duration-500 shadow-premium">
            <Target size={22} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-primary uppercase">
            Omzet<span className="text-accent italic">Naik</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        )}
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 no-scrollbar">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-4">
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
                `flex items-center justify-between px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all duration-300 group ${
                  linkActive
                    ? "bg-slate-50 text-primary shadow-sm"
                    : "text-slate-500 hover:bg-slate-50/80 hover:text-primary"
                }`
              }
            >
              <div className="flex items-center gap-3.5">
                <item.icon
                  size={18}
                  className={`shrink-0 transition-colors duration-300 ${
                    isActive
                      ? "text-accent"
                      : "group-hover:text-accent text-slate-400"
                  }`}
                />
                {item.label}
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="w-1.5 h-1.5 bg-accent rounded-full shadow-accent-glow"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* --- USER PROFILE FOOTER --- */}
      <div className="p-6 border-t border-slate-50 bg-slate-50/50">
        <div className="flex items-center gap-4 px-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-premium shrink-0 border border-white/10">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-primary truncate uppercase tracking-tight">
              {user?.email?.split("@")[0]}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Administrator
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-300 border border-slate-200/60 hover:border-rose-500 shadow-sm"
        >
          <LogOut size={14} />
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
    if (error) toast.error("Gagal logout: " + error.message);
    else {
      toast.success("Logout Berhasil");
      navigate("/login");
    }
  }, [navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          Initializing Terminal...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50 flex overflow-hidden font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#0F1F4A",
            color: "#fff",
            fontSize: "14px",
          },
        }}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 bg-white">
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
              className="fixed inset-0 z-[100] bg-primary/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 z-[110] lg:hidden"
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
        {/* --- PREMIUM NAVBAR --- */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 text-primary bg-slate-50 border border-slate-100 rounded-xl"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:block">
              <h2 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">
                Management Terminal
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-primary">
                  Controller v2.4
                </p>
                <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[8px] font-bold rounded uppercase">
                  PRO
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            {/* Action Icons */}
            <div className="hidden sm:flex items-center gap-2 border-r border-slate-100 pr-6">
              <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white" />
              </button>
              <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">
                <Settings size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-primary tracking-tight">
                  {user?.email?.split("@")[0].toUpperCase()}
                </p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                  Online Now
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-primary text-xs shadow-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* --- CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 no-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
