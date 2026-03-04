// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Building2,
  Wallet,
  ArrowRight,
  PlusCircle,
  Clock,
  Briefcase,
  Layers,
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

// --- Tipe Data ---
interface Lead {
  created_at: string;
  id: string;
  name: string; // Disesuaikan dengan skema tabel leads kamu
  domisili?: string;
  phone: string;
}

const StatCard = ({ title, value, icon, color, loading }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden relative">
    <div
      className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-110 ${color.bg}`}
    />
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${color.bg} ${color.text}`}
    >
      {loading ? (
        <div className="w-6 h-6 bg-current/20 animate-pulse rounded-md" />
      ) : (
        React.cloneElement(icon, { size: 28 })
      )}
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      {loading ? (
        <div className="h-7 bg-slate-100 animate-pulse rounded w-20" />
      ) : (
        <p className="text-2xl font-black text-[#0F1F4A] tracking-tight">
          {value}
        </p>
      )}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [
          propsRes,
          leadsCountRes,
          recentLeadsRes,
          dailyLeadsRes,
          servicesRes,
          portfolioRes,
        ] = await Promise.all([
          supabase.from("properties").select("status"),
          supabase.from("leads").select("*", { count: "exact", head: true }),
          supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(6),
          supabase
            .from("leads")
            .select("created_at")
            .gte("created_at", sevenDaysAgo.toISOString()),
          supabase.from("services").select("*", { count: "exact", head: true }),
          supabase
            .from("portfolios")
            .select("*", { count: "exact", head: true }),
        ]);

        const properties = propsRes.data || [];

        setStats({
          totalUnits: properties.length,
          available: properties.filter((p) =>
            ["active", "pending"].includes(p.status),
          ).length,
          sold: properties.filter((p) => p.status === "sold").length,
          totalLeads: leadsCountRes.count || 0,
          totalServices: servicesRes.count || 0,
          totalPortfolio: portfolioRes.count || 0,
        });

        setRecentLeads((recentLeadsRes.data as Lead[]) || []);
        setDailyLeads(dailyLeadsRes.data || []);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const isoDate = date.toISOString().slice(0, 10);
      const count = dailyLeads.filter((l) =>
        l.created_at.startsWith(isoDate),
      ).length;
      data.push({
        name: date.toLocaleDateString("id-ID", { weekday: "short" }),
        value: count,
      });
    }
    return data;
  }, [dailyLeads]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F1F4A] tracking-tighter">
            {greeting}, Hasyim!
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Pantau ekosistem OmzetNaik.id dari properti hingga performa agensi.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-slate-400">
            <Clock size={20} />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Update Terakhir
            </p>
            <p className="text-xs font-bold text-[#0F1F4A]">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              WIB
            </p>
          </div>
        </div>
      </div>

      {/* Statistik Grid - Dioptimalkan untuk 6 Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Unit Properti"
          value={stats.totalUnits}
          icon={<Building2 />}
          color={{ bg: "bg-indigo-50", text: "text-indigo-600" }}
          loading={loading}
        />
        <StatCard
          title="Status Ready"
          value={stats.available}
          icon={<CheckCircle />}
          color={{ bg: "bg-emerald-50", text: "text-emerald-600" }}
          loading={loading}
        />
        <StatCard
          title="Total Prospek"
          value={stats.totalLeads}
          icon={<Users />}
          color={{ bg: "bg-sky-50", text: "text-sky-600" }}
          loading={loading}
        />
        <StatCard
          title="Jasa Agency"
          value={stats.totalServices}
          icon={<Briefcase />}
          color={{ bg: "bg-amber-50", text: "text-amber-600" }}
          loading={loading}
        />
        <StatCard
          title="Case Studies"
          value={stats.totalPortfolio}
          icon={<Layers />}
          color={{ bg: "bg-rose-50", text: "text-rose-600" }}
          loading={loading}
        />
        <StatCard
          title="Closing Rate"
          value={`${((stats.sold / (stats.totalUnits || 1)) * 100).toFixed(0)}%`}
          icon={<TrendingUp />}
          color={{ bg: "bg-violet-50", text: "text-violet-600" }}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Grafik Perolehan Leads */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2 className="font-black text-[#0F1F4A] tracking-tight">
                  Performa Inbound
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Leads 7 Hari Terakhir
                </p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      fontWeight: "bold",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={32}>
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

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/portfolio"
              className="group bg-[#0F1F4A] p-6 rounded-3xl text-white flex items-center justify-between transition-all hover:bg-black"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-[#FF3B3B]">
                  Update Portofolio
                </h3>
                <p className="text-slate-400 text-xs">
                  Tambah Case Study terbaru.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#FF3B3B] transition-colors">
                <PlusCircle size={20} />
              </div>
            </Link>
            <Link
              to="/admin/services"
              className="group bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between transition-all hover:border-[#FF3B3B] shadow-sm"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-[#0F1F4A]">
                  Kelola Layanan
                </h3>
                <p className="text-slate-400 text-xs">
                  Optimasi paket jasa agency.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-slate-400 group-hover:bg-[#FF3B3B] group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </div>
            </Link>
          </div>
        </div>

        {/* Sidebar: Recent Leads */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#FF3B3B]/10 text-[#FF3B3B] flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <h2 className="font-black text-[#0F1F4A] tracking-tight">
                Leads Masuk
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Update Real-time
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="group p-4 rounded-2xl bg-[#F8FAFC] border border-transparent hover:border-[#FF3B3B]/20 hover:bg-white transition-all flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#0F1F4A] font-black text-sm group-hover:bg-[#0F1F4A] group-hover:text-white transition-all">
                    {(lead.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#0F1F4A] truncate text-sm">
                      {lead.name}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      {new Date(lead.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${lead.phone}`}
                    target="_blank"
                    className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    <span className="text-[8px] font-black">WA</span>
                  </a>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-10 text-xs font-bold uppercase tracking-widest">
                Belum ada leads.
              </p>
            )}
          </div>

          <Link
            to="/admin/leads"
            className="mt-8 py-4 bg-[#F8FAFC] text-[#0F1F4A] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0F1F4A] hover:text-white transition-all text-center"
          >
            Semua Leads
          </Link>
        </div>
      </div>
    </div>
  );
}
