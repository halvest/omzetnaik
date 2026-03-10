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
  MessageSquare,
  TrendingUp,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

// --- Custom Colors ---
const COLORS = {
  primary: "#0F1F4A",
  accent: "#FF3B3B",
  slate: "#64748B",
  emerald: "#10B981",
  rose: "#F43F5E",
};

const sourceData = [
  { name: "Meta Ads", value: 55, color: COLORS.accent },
  { name: "Google Ads", value: 25, color: COLORS.primary },
  { name: "SEO / Organic", value: 15, color: COLORS.slate },
  { name: "Others", value: 5, color: "#CBD5E1" },
];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
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
      up: true,
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
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Processing Intelligence...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tighter">
            Intelligence <span className="text-accent italic">Overview.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Monitoring ROI dan efisiensi kanal pemasaran OmzetNaik.id secara
            real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
            <button className="px-4 py-2 bg-slate-50 text-primary text-xs font-bold rounded-lg border border-slate-100 shadow-sm">
              Real-time
            </button>
            <button className="px-4 py-2 text-slate-400 text-xs font-bold hover:text-primary transition-colors">
              Historical
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-premium hover:bg-slate-900 transition-all">
            <Calendar size={16} className="text-accent" /> Export Report
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.2, 0, 0, 1] }}
            key={i}
            className="bg-white p-8 rounded-[bento] border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />

            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-primary">
                {React.cloneElement(m.icon as React.ReactElement, { size: 22 })}
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm border ${
                  m.up
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-rose-50 text-rose-600 border-rose-100"
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

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
              {m.title}
            </p>
            <h3 className="text-3xl font-bold text-primary tracking-tighter">
              {m.value}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* --- CHARTS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Trend Area Chart */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[bento] border border-slate-100 shadow-premium">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-xl font-bold text-primary tracking-tight">
                Conversion Funnel Trend
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Acquisition vs conversion over time
              </p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" /> Visitors
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase">
                <div className="w-2.5 h-2.5 rounded-full bg-accent" /> Leads
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
                    <stop
                      offset="5%"
                      stopColor={COLORS.primary}
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.accent}
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.accent}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f8fafc"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{
                    stroke: COLORS.primary,
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
                    padding: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVis)"
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke={COLORS.accent}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Breakdown Pie */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[bento] border border-slate-100 shadow-premium flex flex-col h-full">
          <div className="mb-10">
            <h3 className="text-xl font-bold text-primary tracking-tight">
              Traffic Acquisition
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Source distribution
            </p>
          </div>

          <div className="h-64 w-full flex-grow relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-primary tracking-tighter">
                55%
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                Main Source
              </span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  innerRadius={85}
                  outerRadius={105}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {sourceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      cornerRadius={4}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-10 space-y-3">
            {sourceData.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-primary transition-colors">
                    {s.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-primary">
                  {s.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- GEOGRAPHY & AI --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
        {/* Geography Card */}
        <div className="lg:col-span-7 bg-white p-10 rounded-[bento] border border-slate-100 shadow-premium">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-primary tracking-tight">
                Audience Geography
              </h3>
            </div>
            <ChevronDown className="text-slate-300" />
          </div>

          <div className="space-y-8">
            {[
              { loc: "Yogyakarta", val: "48%", color: COLORS.accent },
              {
                loc: "Jakarta / Jabodetabek",
                val: "32%",
                color: COLORS.primary,
              },
              { loc: "Jawa Tengah", val: "12%", color: COLORS.slate },
              { loc: "Lainnya", val: "8%", color: "#E2E8F0" },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-3">
                  <span>{item.loc}</span>
                  <span className="text-primary">{item.val}</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50 p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: item.val }}
                    transition={{ duration: 1.5, ease: [0.2, 0, 0, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Card (Modern Dark) */}
        <div className="lg:col-span-5 bg-primary p-12 rounded-[bento] text-white overflow-hidden relative shadow-premium group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-accent/20 transition-all duration-700" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center">
                <Zap className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                Growth AI Insight
              </h3>
            </div>

            <div className="space-y-8 flex-grow">
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                Berhubungan dengan performa 7 hari terakhir, kampanye{" "}
                <span className="text-white font-bold underline decoration-accent underline-offset-4">
                  Meta Ads Kavling Premium
                </span>{" "}
                mengalami lonjakan CTR yang signifikan.
              </p>

              <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] backdrop-blur-md relative group/action">
                <div className="absolute top-0 right-0 p-4 opacity-30 group-hover/action:opacity-100 transition-opacity">
                  <TrendingUp size={20} className="text-accent" />
                </div>
                <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-4">
                  Strategic Recommendation
                </p>
                <p className="text-base text-slate-200 leading-relaxed italic">
                  "Alokasikan kembali 15% budget dari kanal Google Display ke
                  Meta Advantage+ Shopping untuk menurunkan CPL estimasi sebesar
                  Rp 2.400."
                </p>
              </div>
            </div>

            <button className="mt-10 w-full py-5 bg-accent hover:bg-white hover:text-primary transition-all duration-500 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-accent-glow active:scale-95">
              Execute Optimization Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
