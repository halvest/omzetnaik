// src/pages/AdminLeadsManager.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../utils/supabase";
import {
  Trash2,
  Search,
  Target,
  Mail,
  Loader2,
  MessageCircle,
  ChevronDown,
  Globe,
  Filter,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// --- Tipe Data CRM ---
interface Lead {
  id: string;
  created_at: string;
  type: "property" | "service";
  name: string;
  phone: string;
  email?: string;
  domicile?: string;
  message?: string;
  status: "new" | "contacted" | "follow_up" | "survey" | "closing" | "lost";
  lead_score: number;
  utm_source?: string;
  utm_campaign?: string;
  page_url?: string;
  properties?: { title: string } | null;
  services?: { title: string } | null;
}

const STATUS_CONFIG: Record<
  Lead["status"],
  { label: string; color: string; bg: string; border: string }
> = {
  new: {
    label: "New Lead",
    color: "text-blue-600",
    bg: "bg-blue-50/50",
    border: "border-blue-100",
  },
  contacted: {
    label: "Contacted",
    color: "text-purple-600",
    bg: "bg-purple-50/50",
    border: "border-purple-100",
  },
  follow_up: {
    label: "Follow Up",
    color: "text-amber-600",
    bg: "bg-amber-50/50",
    border: "border-amber-100",
  },
  survey: {
    label: "On Survey",
    color: "text-indigo-600",
    bg: "bg-indigo-50/50",
    border: "border-indigo-100",
  },
  closing: {
    label: "Closed/Won",
    color: "text-emerald-600",
    bg: "bg-emerald-50/50",
    border: "border-emerald-100",
  },
  lost: {
    label: "Lost",
    color: "text-slate-400",
    bg: "bg-slate-50/50",
    border: "border-slate-100",
  },
};

export default function AdminLeadsManager() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  // OPTIMASI 1: Fetching dengan penanganan relasi yang lebih aman
  const fetchLeads = useCallback(async (showQuiet = false) => {
    if (!showQuiet) setLoading(true);
    else setIsRefreshing(true);

    const { data, error } = await supabase
      .from("leads")
      .select(`*, properties(title), services(title)`)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal sinkronisasi database: " + error.message);
    } else {
      setAllLeads(data as unknown as Lead[]);
    }

    setLoading(false);
    setIsRefreshing(false);
  }, []);

  // OPTIMASI 2: Real-time Update (Supabase Realtime)
  // Memungkinkan dashboard update otomatis saat ada leads baru masuk dari website
  useEffect(() => {
    fetchLeads();

    const channel = supabase
      .channel("public:leads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => {
          fetchLeads(true); // Quiet refresh
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    return allLeads.filter((l) => {
      const matchesStatus =
        statusFilter === "Semua" || l.status === statusFilter;
      const matchesSearch =
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone.includes(searchTerm) ||
        l.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [allLeads, statusFilter, searchTerm]);

  const handleUpdateStatus = async (leadId: string, status: Lead["status"]) => {
    const loadingToast = toast.loading("Updating pipeline...");
    const { error } = await supabase
      .from("leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", leadId);

    if (error) {
      toast.error("Gagal memperbarui: " + error.message, { id: loadingToast });
    } else {
      toast.success("Pipeline Stage Diperbarui", { id: loadingToast });
      setEditingLeadId(null);
      // Data akan terupdate otomatis via realtime channel atau fetchLeads
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Data ini akan dihapus permanen dari CRM. Lanjutkan?"))
      return;

    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus data");
    else toast.success("Prospek berhasil dihapus");
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* --- CRM HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold text-primary tracking-tighter uppercase">
            Leads <span className="text-accent italic">Pipeline.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Database prospek real-time dari OmzetNaik.id Ecosystem.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchLeads(true)}
            className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-primary transition-all active:scale-95"
          >
            <RefreshCw
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Growth Engine
              </span>
              <span className="text-sm font-bold text-primary">
                {allLeads.length} Records
              </span>
            </div>
            <div className="p-2 bg-accent/10 rounded-xl text-accent">
              <Target size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTROL TERMINAL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama, email, atau WhatsApp..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-slate-700 placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="lg:col-span-4 relative">
          <Filter
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-14 pr-12 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none appearance-none font-bold text-sm text-primary cursor-pointer focus:ring-4 focus:ring-primary/5 transition-all"
          >
            <option value="Semua">All Pipeline Stages</option>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label.toUpperCase()}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* --- CRM TABLE --- */}
      <div className="bg-white rounded-[bento] border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Prospect Identity
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Conversion Source
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Interest
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Pipeline Stage
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-32">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="animate-spin text-accent" size={32} />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                        Syncing Cloud Database...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="group hover:bg-slate-50/80 transition-all"
                  >
                    {/* Identity */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-slate-50 text-primary flex items-center justify-center font-bold text-sm border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all shadow-sm uppercase">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-primary text-base tracking-tight">
                            {lead.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors group/link"
                            >
                              <MessageCircle
                                size={14}
                                className="group-hover/link:scale-110 transition-transform"
                              />{" "}
                              {lead.phone}
                            </a>
                            {lead.email && (
                              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5 border-l border-slate-200 pl-3">
                                <Mail size={12} /> {lead.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-wider bg-accent/5 border border-accent/10 px-2 py-0.5 rounded-md w-fit">
                          <Globe size={10} />{" "}
                          {lead.utm_source || "Direct / Organic"}
                        </span>
                        {lead.page_url && (
                          <a
                            href={lead.page_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-slate-400 font-medium hover:text-primary flex items-center gap-1"
                          >
                            Target Page <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Interest */}
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`text-[9px] font-black w-fit px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm border ${
                            lead.type === "property"
                              ? "bg-orange-50 text-orange-600 border-orange-100"
                              : "bg-blue-50 text-blue-600 border-blue-100"
                          }`}
                        >
                          {lead.type}
                        </span>
                        <p className="text-sm font-bold text-slate-600 truncate max-w-[180px] tracking-tight">
                          {lead.properties?.title ||
                            lead.services?.title ||
                            "Inquiry Umum"}
                        </p>
                      </div>
                    </td>

                    {/* Pipeline Status */}
                    <td className="px-8 py-6">
                      <AnimatePresence mode="wait">
                        {editingLeadId === lead.id ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <select
                              autoFocus
                              value={lead.status}
                              onChange={(e) =>
                                handleUpdateStatus(
                                  lead.id,
                                  e.target.value as any,
                                )
                              }
                              onBlur={() => setEditingLeadId(null)}
                              className="text-xs font-bold p-2.5 rounded-xl border-2 border-primary shadow-lg outline-none bg-white cursor-pointer"
                            >
                              {Object.entries(STATUS_CONFIG).map(
                                ([key, val]) => (
                                  <option key={key} value={key}>
                                    {val.label}
                                  </option>
                                ),
                              )}
                            </select>
                          </motion.div>
                        ) : (
                          <button
                            onClick={() => setEditingLeadId(lead.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:shadow-md active:scale-95 ${STATUS_CONFIG[lead.status].bg} ${STATUS_CONFIG[lead.status].border}`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[lead.status].color.replace("text", "bg")}`}
                            />
                            <span
                              className={`text-[10px] font-bold uppercase tracking-widest ${STATUS_CONFIG[lead.status].color}`}
                            >
                              {STATUS_CONFIG[lead.status].label}
                            </span>
                            <ChevronDown size={12} className="text-slate-300" />
                          </button>
                        )}
                      </AnimatePresence>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-2.5 bg-white text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100 active:scale-90"
                          title="Delete Lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Target size={40} className="text-slate-200" />
                      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                        No prospects found in pipeline
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {filteredLeads.length} Lead Records Displayed
          </p>
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            <RefreshCw
              size={10}
              className={isRefreshing ? "animate-spin" : ""}
            />{" "}
            Updated just now
          </div>
        </div>
      </div>
    </div>
  );
}
