// src/components/MarketingLayout.tsx
import React, { useState, useEffect, useMemo } from "react";
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
  MessageSquare,
  LogOut,
  Target,
  Menu,
  X,
  Zap,
  User,
  Settings,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// Item Menu khusus untuk Marketing Agent
const MARKETING_MENU = [
  { href: "/marketing/dashboard", label: "Performance", icon: LayoutDashboard },
  { href: "/marketing/leads", label: "My Leads", icon: MessageSquare },
  { href: "/marketing/inventory", label: "Property Catalog", icon: Home },
];

const MarketingSidebar = ({ user, profile, onLogout, onClose }: any) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-white font-sans border-r border-slate-100">
      {/* Branding Section */}
      <div className="h-24 px-8 flex items-center justify-between">
        <Link
          to="/marketing/dashboard"
          className="flex items-center gap-3 group"
          onClick={onClose}
        >
          <div className="bg-accent p-2.5 rounded-2xl text-white shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
            <Target size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-primary uppercase leading-none">
              Marketing<span className="text-accent italic">Hub</span>
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Terminal v2.7
            </span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8 space-y-2">
        <p className="px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">
          Agent Terminal
        </p>
        {MARKETING_MENU.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-4 rounded-[1.25rem] text-[13px] font-bold transition-all duration-300 group ${
                isActive
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-primary"
              }`
            }
          >
            <div className="flex items-center gap-4">
              <item.icon
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
              {item.label}
            </div>
            <ChevronRight
              size={14}
              className="opacity-30 group-hover:opacity-100 transition-all"
            />
          </NavLink>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="p-8 bg-slate-50/50 border-t border-slate-50">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-primary shadow-sm uppercase">
            {profile?.name?.charAt(0) || <User size={20} />}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-primary truncate uppercase tracking-tight">
              {profile?.name || "Agent"}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck size={10} className="text-emerald-500" />
              <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">
                Verified
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
        >
          <LogOut size={14} /> Sign Out Terminal
        </button>
      </div>
    </div>
  );
};

export default function MarketingLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/marketing/login");
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setUser(session.user);
      setProfile(prof);
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    const loadingToast = toast.loading("Closing session...");
    await supabase.auth.signOut();
    toast.success("Terminal Closed", { id: loadingToast });
    navigate("/marketing/login");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 shrink-0">
        <MarketingSidebar
          user={user}
          profile={profile}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar */}
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
              className="fixed inset-0 w-80 z-[110] lg:hidden"
            >
              <MarketingSidebar
                user={user}
                profile={profile}
                onLogout={handleLogout}
                onClose={() => setIsSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-primary bg-slate-50 rounded-xl"
          >
            <Menu size={20} />
          </button>
          <Target className="text-accent" size={24} />
          <div className="w-10" /> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-12 no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
