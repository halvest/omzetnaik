// src/pages/AdminAnalytics.tsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Globe,
  MousePointerClick,
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

// --- Mock Data Agensi (OmzetNaik) ---
const sourceData = [
  { name: "Meta Ads", value: 55, color: "#FF3B3B" }, // Growth Red
  { name: "Google Ads", value: 25, color: "#0F1F4A" }, // Midnight Navy
  { name: "SEO / Organic", value: 15, color: "#64748B" },
  { name: "Others", value: 5, color: "#CBD5E1" },
];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    {
      title: "Total Impressions",
      value: "142.8K",
      trend: "+18%",
      up: true,
      icon: <Target />,
    },
    {
      title: "WhatsApp Leads",
      value: "1,204",
      trend: "+12.4%",
      up: true,
      icon: <MessageSquare />,
    },
    {
      title: "CPL (Avg)",
      value: "Rp 14.200",
      trend: "-5.2%",
      up: true, // Turun biaya = bagus
      icon: <Zap />,
    },
    {
      title: "Overall ROAS",
      value: "4.8x",
      trend: "+0.3",
      up: true,
      icon: <TrendingUp />,
    },
  ];

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#FF3B3B] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-[#0F1F4A] tracking-tighter">
            Performance <span className="text-[#FF3B3B]">Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm font-sans">
            Monitoring ROI dan efisiensi kanal pemasaran OmzetNaik.id
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar size={16} /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#0F1F4A] text-white rounded-2xl text-xs font-bold hover:bg-black transition-all shadow-lg shadow-primary/20">
            <Filter size={16} /> Advanced Filter
          </button>
        </div>
      </div>

      {/* --- TOP METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-neutral-soft text-[#0F1F4A] flex items-center justify-center group-hover:bg-[#FF3B3B] group-hover:text-white transition-all duration-500 shadow-inner">
                {React.cloneElement(m.icon as React.ReactElement, { size: 28 })}
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full ${
                  m.up
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {m.up ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {m.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
              {m.title}
            </p>
            <h3 className="text-3xl font-heading font-extrabold text-[#0F1F4A] tracking-tight">
              {m.value}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversion Trend Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h3 className="text-xl font-heading font-extrabold text-[#0F1F4A]">
                Conversion Funnel Trend
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Leads vs Website Visitors
              </p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <div className="w-3 h-3 rounded-full bg-[#0F1F4A]" /> Visitors
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <div className="w-3 h-3 rounded-full bg-[#FF3B3B]" /> Leads
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={Array.from({ length: 12 }).map((_, i) => ({
                  name: `Week ${i + 1}`,
                  visitors: Math.floor(Math.random() * 2000) + 3000,
                  leads: Math.floor(Math.random() * 200) + 150,
                }))}
              >
                <defs>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F1F4A" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#0F1F4A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgba(15, 31, 74, 0.25)",
                    padding: "16px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#0F1F4A"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorVis)"
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#FF3B3B"
                  strokeWidth={4}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Source Breakdown */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-heading font-extrabold text-[#0F1F4A] mb-2">
            Acquisition Source
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">
            Channel Efficiency
          </p>
          <div className="h-64 w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  innerRadius={80}
                  outerRadius={105}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            {sourceData.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-soft transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-[#0F1F4A]">
                    {s.name}
                  </span>
                </div>
                <span className="text-sm font-black text-[#0F1F4A]">
                  {s.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- INSIGHTS & LOCATION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-heading font-extrabold text-[#0F1F4A] mb-8 flex items-center gap-3">
            <Globe className="text-[#FF3B3B]" /> Audience Geography
          </h3>
          <div className="space-y-6">
            {[
              { loc: "Yogyakarta", val: "48%", width: "w-[48%]" },
              { loc: "Jakarta / Jabodetabek", val: "32%", width: "w-[32%]" },
              { loc: "Jawa Tengah", val: "12%", width: "w-[12%]" },
              { loc: "Lainnya", val: "8%", width: "w-[8%]" },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                  <span>{item.loc}</span>
                  <span className="text-[#0F1F4A]">{item.val}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: item.val }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-[#0F1F4A] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0F1F4A] p-10 rounded-[3rem] text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3B3B]/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-[#FF3B3B]/20 transition-all duration-700" />
          <h3 className="text-xl font-heading font-extrabold tracking-tight mb-8 flex items-center gap-3">
            <Zap className="text-[#FF3B3B]" /> Growth AI Insight
          </h3>
          <div className="space-y-6 relative z-10 font-sans">
            <p className="text-slate-300 text-sm leading-relaxed">
              Berdasarkan performa 7 hari terakhir, kampanye{" "}
              <strong className="text-white">Meta Ads - Kavling Premium</strong>{" "}
              mengalami kenaikan CTR sebesar 24%.
            </p>
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-black text-[#FF3B3B] uppercase tracking-[0.2em] mb-3">
                Strategic Action Plan
              </p>
              <p className="text-sm text-slate-100 leading-relaxed italic">
                "Alokasikan kembali 15% budget dari Google Display ke Meta
                Advantage+ Shopping Campaign untuk menurunkan CPL sebesar
                estimasi Rp 2.400 per lead."
              </p>
            </div>
            <button className="w-full py-4 bg-[#FF3B3B] hover:bg-white hover:text-[#0F1F4A] transition-all duration-300 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-red-600/20">
              Apply Optimization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
