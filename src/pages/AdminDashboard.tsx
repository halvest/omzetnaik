// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Users,
  TrendingUp,
  Building2,
  ArrowRight,
  PlusCircle,
  Briefcase,
  Layers,
  ArrowUpRight,
  MessageSquare,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

// --- TYPES ---
interface Lead {
  created_at: string;
  id: string;
  name: string;
  phone: string;
  type?: string;
}

interface DashboardStats {
  totalUnits: number;
  available: number;
  sold: number;
  totalLeads: number;
  totalServices: number;
  totalPortfolio: number;
}

// --- SUB-COMPONENTS ---
const StatCard = ({ title, value, icon, color, loading, trend }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col gap-4 shadow-premium hover:shadow-premium-hover transition-all duration-500 group relative overflow-hidden"
  >
    <div
      className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-[0.03] transition-transform group-hover:scale-150 duration-700 ${color.bg}`}
    />

    <div className="flex items-center justify-between">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${color.bg} ${color.text}`}
      >
        {loading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          React.cloneElement(icon, { size: 22 })
        )}
      </div>
      {!loading && trend && (
        <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-bold">
          <TrendingUp size={12} /> {trend}
        </div>
      )}
    </div>

    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">
        {title}
      </p>
      {loading ? (
        <div className="h-8 bg-slate-50 animate-pulse rounded-lg w-24" />
      ) : (
        <p className="text-3xl font-bold text-primary tracking-tighter">
          {value}
        </p>
      )}
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUnits: 0,
    available: 0,
    sold: 0,
    totalLeads: 0,
    totalServices: 0,
    totalPortfolio: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [dailyLeads, setDailyLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  }, []);

  // OPTIMASI 1: Centralized Fetching dengan Error Handling yang lebih baik
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      try {
        // Menggunakan Promise.all untuk eksekusi paralel (High Performance)
        const [props, leadsCount, recent, daily, services, portfolio] =
          await Promise.all([
            supabase.from("properties").select("status"),
            supabase.from("leads").select("*", { count: "exact", head: true }),
            supabase
              .from("leads")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(5),
            supabase
              .from("leads")
              .select("created_at")
              .gte("created_at", sevenDaysAgo.toISOString()),
            supabase
              .from("services")
              .select("*", { count: "exact", head: true }),
            supabase
              .from("portfolios")
              .select("*", { count: "exact", head: true }),
          ]);

        const properties = props.data || [];

        setStats({
          totalUnits: properties.length,
          available: properties.filter((p) =>
            ["active", "pending"].includes(p.status),
          ).length,
          sold: properties.filter((p) => p.status === "sold").length,
          totalLeads: leadsCount.count || 0,
          totalServices: services.count || 0,
          totalPortfolio: portfolio.count || 0,
        });

        setRecentLeads((recent.data as Lead[]) || []);
        setDailyLeads(daily.data || []);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // OPTIMASI 2: Chart Data Processing yang lebih efisien
  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const isoDate = date.toISOString().split("T")[0];

      const count = dailyLeads.filter((l) =>
        l.created_at.startsWith(isoDate),
      ).length;

      return {
        name: date.toLocaleDateString("id-ID", { weekday: "short" }),
        value: count,
        fullDate: isoDate,
      };
    });
  }, [dailyLeads]);

  return (
    <div className="space-y-10 font-sans pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold text-primary tracking-tighter">
            {greeting}, Hasyim Adani
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Ekosistem OmzetNaik.id terpantau stabil hari ini.
          </p>
        </motion.div>

        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100 pr-3">
            Live Terminal
          </span>
          <p className="text-xs font-bold text-primary">
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <StatCard
          title="Properti"
          value={stats.totalUnits}
          icon={<Building2 />}
          color={{ bg: "bg-primary/5", text: "text-primary" }}
          loading={loading}
          trend="+2%"
        />
        <StatCard
          title="Ready"
          value={stats.available}
          icon={<CheckCircle />}
          color={{ bg: "bg-emerald-50", text: "text-emerald-600" }}
          loading={loading}
        />
        <StatCard
          title="Leads"
          value={stats.totalLeads}
          icon={<Users />}
          color={{ bg: "bg-blue-50", text: "text-blue-600" }}
          loading={loading}
          trend="+12%"
        />
        <StatCard
          title="Services"
          value={stats.totalServices}
          icon={<Briefcase />}
          color={{ bg: "bg-amber-50", text: "text-amber-600" }}
          loading={loading}
        />
        <StatCard
          title="Portfolio"
          value={stats.totalPortfolio}
          icon={<Layers />}
          color={{ bg: "bg-rose-50", text: "text-rose-600" }}
          loading={loading}
        />
        <StatCard
          title="Closing Rate"
          value={`${((stats.sold / (stats.totalUnits || 1)) * 100).toFixed(0)}%`}
          icon={<TrendingUp />}
          color={{ bg: "bg-accent/10", text: "text-accent" }}
          loading={loading}
        />
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* CHART AREA */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-[bento] border border-slate-100 shadow-premium h-full">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xl font-bold text-primary tracking-tight">
                  Performa Inbound
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Aktivitas 7 Hari Terakhir
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-bold text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full" /> History
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/5 rounded-lg text-[10px] font-bold text-accent">
                  <div className="w-2 h-2 bg-accent rounded-full" /> Today
                </div>
              </div>
            </div>

            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc", radius: 8 }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)",
                      padding: "12px",
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 6 ? "#FF3B3B" : "#0F1F4A"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RECENT LEADS AREA */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[bento] border border-slate-100 shadow-premium h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-primary tracking-tight">
                Leads Baru
              </h2>
              <Link
                to="/admin/leads"
                className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400"
              >
                <ArrowUpRight size={20} />
              </Link>
            </div>

            <div className="space-y-5 flex-1">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="group p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white transition-all duration-300 flex items-center gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary font-bold text-sm border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary truncate text-sm tracking-tight">
                        {lead.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                        {new Date(lead.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                        })}{" "}
                        • Inbound
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${lead.phone}`}
                      target="_blank"
                      className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-110 transition-transform"
                    >
                      <MessageSquare size={16} />
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Belum ada leads masuk
                  </p>
                </div>
              )}
            </div>

            <Link
              to="/admin/leads"
              className="mt-10 w-full py-4 bg-slate-50 hover:bg-primary hover:text-white text-primary rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all text-center border border-slate-100"
            >
              Lihat Semua Aktivitas
            </Link>
          </div>
        </div>
      </div>

      {/* --- QUICK ACTIONS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/portfolio"
          className="group p-8 rounded-[bento] bg-primary text-white flex items-center justify-between overflow-hidden shadow-premium relative"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold tracking-tight mb-2">
              Update Case Study
            </h3>
            <p className="text-slate-400 text-sm font-medium">
              Tambah keberhasilan baru ke landing page.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-accent transition-all duration-500 shadow-xl">
            <PlusCircle size={28} />
          </div>
        </Link>

        <Link
          to="/admin/property"
          className="group p-8 rounded-[bento] bg-white border border-slate-100 flex items-center justify-between overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 relative"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-primary tracking-tight mb-2">
              Inventory Properti
            </h3>
            <p className="text-slate-500 text-sm font-medium">
              Update status unit secara real-time.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
            <ArrowRight size={28} />
          </div>
        </Link>
      </div>
    </div>
  );
}
