// src/pages/AdminLeadsManager.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../utils/supabase";
import {
  Phone,
  Trash2,
  Search,
  Target,
  Mail,
  ExternalLink,
  Loader2,
  MessageCircle,
  MoreVertical,
  ChevronDown,
  Globe,
  Filter,
  CheckCircle2,
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
  properties?: { title: string } | null;
  services?: { title: string } | null;
}

const STATUS_OPTIONS: Lead["status"][] = [
  "new",
  "contacted",
  "follow_up",
  "survey",
  "closing",
  "lost",
];

const STATUS_CONFIG: Record<
  Lead["status"],
  { label: string; color: string; bg: string }
> = {
  new: { label: "New Lead", color: "text-blue-600", bg: "bg-blue-50/50" },
  contacted: {
    label: "Contacted",
    color: "text-purple-600",
    bg: "bg-purple-50/50",
  },
  follow_up: {
    label: "Follow Up",
    color: "text-amber-600",
    bg: "bg-amber-50/50",
  },
  survey: {
    label: "On Survey",
    color: "text-indigo-600",
    bg: "bg-indigo-50/50",
  },
  closing: {
    label: "Closed/Won",
    color: "text-emerald-600",
    bg: "bg-emerald-50/50",
  },
  lost: { label: "Lost", color: "text-slate-400", bg: "bg-slate-50/50" },
};

export default function AdminLeadsManager() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select(`*, properties(title), services(title)`)
      .order("created_at", { ascending: false });

    if (!error) setAllLeads(data as unknown as Lead[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    return allLeads
      .filter((l) => statusFilter === "Semua" || l.status === statusFilter)
      .filter(
        (l) =>
          l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.phone.includes(searchTerm),
      );
  }, [allLeads, statusFilter, searchTerm]);

  const handleUpdateStatus = async (leadId: string, status: Lead["status"]) => {
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", leadId);

    if (error) {
      toast.error("Gagal memperbarui status");
    } else {
      toast.success("Status Prospek Diperbarui");
      setEditingLeadId(null);
      fetchLeads();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Data ini akan dihapus permanen. Lanjutkan?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus");
    else {
      toast.success("Lead dihapus");
      fetchLeads();
    }
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* --- CRM HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tighter uppercase">
            Leads <span className="text-accent italic">Pipeline.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Kelola database prospek dan konversi kampanye marketing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Growth Analytics
              </span>
              <span className="text-sm font-bold text-primary">
                {allLeads.length} Total Records
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
            placeholder="Cari nama prospek atau identitas WhatsApp..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium text-slate-700"
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
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none appearance-none font-bold text-sm text-primary cursor-pointer focus:ring-4 focus:ring-primary/5 transition-all"
          >
            <option value="Semua">All Status Pipeline</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.toUpperCase()}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-[bento] border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Prospect Identity
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Marketing Source
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Product Interest
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Pipeline Stage
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-32">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="animate-spin text-accent" size={32} />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Syncing CRM Database...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Identity */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 text-primary flex items-center justify-center font-bold text-sm border border-slate-200 group-hover:bg-primary group-hover:text-white transition-all">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-primary text-base tracking-tight">
                            {lead.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
                            >
                              <MessageCircle size={14} /> {lead.phone}
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
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-wider bg-accent/5 px-2 py-0.5 rounded w-fit">
                          <Globe size={10} />{" "}
                          {lead.utm_source || "Organic Direct"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                          {lead.utm_campaign || "No Campaign Data"}
                        </span>
                      </div>
                    </td>

                    {/* Interest */}
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`text-[9px] font-black w-fit px-2 py-0.5 rounded uppercase tracking-tighter ${lead.type === "property" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {lead.type}
                        </span>
                        <p className="text-sm font-bold text-slate-600 truncate max-w-[200px] tracking-tight">
                          {lead.properties?.title ||
                            lead.services?.title ||
                            "Inquiry Umum"}
                        </p>
                      </div>
                    </td>

                    {/* Pipeline Stage */}
                    <td className="px-8 py-6">
                      <div className="relative">
                        {editingLeadId === lead.id ? (
                          <div className="flex items-center gap-2">
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
                              className="text-xs font-bold p-2.5 rounded-xl border border-primary shadow-sm outline-none bg-white"
                            >
                              {STATUS_OPTIONS.map((o) => (
                                <option key={o} value={o}>
                                  {STATUS_CONFIG[o].label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingLeadId(lead.id);
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:ring-2 hover:ring-slate-200 ${STATUS_CONFIG[lead.status].bg}`}
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
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100"
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
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                      No prospects matching your filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing {filteredLeads.length} Entries
          </p>
          <div className="flex gap-2">
            <button
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
