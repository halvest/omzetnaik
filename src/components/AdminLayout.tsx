// src/components/AdminLayout.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  FileText,
  Briefcase,
  Layers,
  Loader2,
  Bell,
  Settings,
  Circle,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const MENU_ITEMS = [
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
  const userDisplayName = useMemo(
    () => user?.email?.split("@")[0].toUpperCase() || "ADMIN",
    [user],
  );

  return (
    <div className="flex flex-col h-full bg-white font-sans border-r border-slate-100">
      {/* BRANDING SECTION */}
      <div className="h-24 px-8 flex items-center justify-between">
        <Link
          to="/admin"
          className="flex items-center gap-3 group"
          onClick={onClose}
        >
          <div className="bg-[#0F1F4A] p-2.5 rounded-2xl text-white group-hover:bg-[#FF3B3B] transition-all duration-500 shadow-lg shadow-blue-900/10">
            <Target size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-[#0F1F4A] uppercase leading-none">
              Omzet<span className="text-[#FF3B3B] italic">Naik</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">
              Admin Panel v1.0
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-[#FF3B3B] transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-2 no-scrollbar">
        <p className="px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">
          Main Control
        </p>
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            end={item.href === "/admin"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-5 py-4 rounded-2xl text-[13px] font-bold transition-all duration-300 group ${
                isActive
                  ? "bg-[#0F1F4A] text-white shadow-xl shadow-blue-900/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#0F1F4A]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-4">
                  <item.icon
                    size={18}
                    className={`shrink-0 transition-colors duration-300 ${
                      isActive
                        ? "text-[#FF3B3B]"
                        : "group-hover:text-[#FF3B3B] text-slate-400"
                    }`}
                  />
                  {item.label}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className="w-1.5 h-1.5 bg-[#FF3B3B] rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-8 border-t border-slate-50 bg-slate-50/50">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-[#0F1F4A] shadow-sm uppercase tracking-tighter">
            {user?.email?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-[#0F1F4A] truncate uppercase tracking-tight">
              {userDisplayName}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Circle
                size={8}
                fill="#10B981"
                className="text-[#10B981] animate-pulse"
              />
              <p className="text-[9px] text-[#10B981] font-black uppercase tracking-widest">
                Authorized Admin
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white border border-slate-200 hover:bg-[#FF3B3B] hover:text-white hover:border-[#FF3B3B] transition-all shadow-sm"
        >
          <LogOut size={14} />
          Sign Out Portal
        </button>
      </div>
    </div>
  );
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        if (!session) navigate("/login");
        else {
          setUser(session.user);
          setLoading(false);
        }
      }
    };
    checkUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        if (!session) navigate("/login");
        else setUser(session.user);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    const loadingToast = toast.loading("Closing Portal...");
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully", { id: loadingToast });
      navigate("/login");
    } catch (error: any) {
      toast.error("Logout failed", { id: loadingToast });
    }
  }, [navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="animate-spin text-[#FF3B3B]" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0F1F4A]">
          Loading Dashboard...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden font-sans">
      <aside className="hidden lg:flex w-80 shrink-0">
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

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

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 text-[#0F1F4A] bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:block">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
                Property Management System
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-[#0F1F4A] uppercase tracking-tighter">
                  Dashboard{" "}
                  <span className="text-[#FF3B3B] italic">Admin v1.0</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 pr-6 border-r border-slate-100">
              <button className="p-3 text-slate-400 hover:text-[#0F1F4A] transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-3 text-slate-400 hover:text-[#0F1F4A] transition-colors">
                <Settings size={20} />
              </button>
            </div>
            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block font-black">
                <p className="text-xs text-[#0F1F4A] uppercase tracking-tight">
                  {user?.email?.split("@")[0]}
                </p>
                <p className="text-[9px] text-[#FF3B3B] uppercase tracking-widest">
                  Super Admin
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center font-black text-[#0F1F4A] text-xs shadow-sm">
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 no-scrollbar bg-[#F8FAFC]">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
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
