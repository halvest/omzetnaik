// src/pages/AdminLeadsManager.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../utils/supabase";
import {
  Phone,
  Edit,
  Check,
  Trash2,
  X,
  Search,
  Filter,
  AlertTriangle,
  MessageSquare,
  Copy,
  Calendar,
  Mail,
  Target,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// --- Tipe Data Sesuai Skema SQL public.leads ---
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

const STATUS_STYLES: { [key in Lead["status"]]: string } = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-purple-100 text-purple-700",
  follow_up: "bg-amber-100 text-amber-700",
  survey: "bg-indigo-100 text-indigo-700",
  closing: "bg-emerald-100 text-emerald-700",
  lost: "bg-slate-100 text-slate-500",
};

// --- Sub-komponen ---
const StatusBadge = ({ status }: { status: Lead["status"] }) => (
  <span
    className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${STATUS_STYLES[status]}`}
  >
    {status.replace("_", " ")}
  </span>
);

export default function AdminLeadsManager() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<Lead["status"]>("new");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(
    new Set(),
  );

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select(
        `
        *,
        properties ( title ),
        services ( title )
      `,
      )
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

  const handleUpdateStatus = async (leadId: string) => {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);
    if (error) toast.error("Gagal memperbarui status");
    else {
      toast.success("Status diperbarui");
      setEditingLeadId(null);
      fetchLeads();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data prospek ini secara permanen?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus");
    else {
      toast.success("Data dihapus");
      fetchLeads();
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-[#0F1F4A] tracking-tighter">
            Leads <span className="text-[#FF3B3B]">Center</span>
          </h1>
          <p className="text-slate-500 text-sm font-sans mt-1">
            Manajemen konversi iklan dan inbound marketing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <Target size={18} className="text-[#FF3B3B]" />
            <span className="text-sm font-bold text-[#0F1F4A]">
              {allLeads.length} Total Leads
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau nomor telepon..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-[#0F1F4A]/5 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-100 rounded-[1.5rem] px-6 font-bold text-sm text-[#0F1F4A] shadow-sm outline-none"
        >
          <option value="Semua">Semua Status</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead className="bg-[#F5F7FB] border-b border-slate-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Prospek
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Source / Campaign
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Interest
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Status
                </th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs"
                  >
                    Sinkronisasi Data Leads...
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-[#F5F7FB]/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0F1F4A] text-base">
                          {lead.name}
                        </span>
                        <div className="flex items-center gap-3 mt-1">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            className="text-xs font-medium text-emerald-600 flex items-center gap-1 hover:underline"
                          >
                            <Phone size={12} /> {lead.phone}
                          </a>
                          {lead.email && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Mail size={10} /> {lead.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-[#FF3B3B] uppercase tracking-wider">
                          {lead.utm_source || "Organic"}
                        </span>
                        <span className="text-xs text-slate-500 italic">
                          {lead.utm_campaign || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span
                          className={`text-[10px] font-bold w-fit px-2 py-0.5 rounded mb-1 ${lead.type === "property" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"}`}
                        >
                          {lead.type.toUpperCase()}
                        </span>
                        <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">
                          {lead.properties?.title ||
                            lead.services?.title ||
                            "General Inquiry"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {editingLeadId === lead.id ? (
                        <select
                          autoFocus
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as any)}
                          onBlur={() => handleUpdateStatus(lead.id)}
                          className="text-xs font-bold p-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#0F1F4A]"
                        >
                          {STATUS_OPTIONS.map((o) => (
                            <option key={o} value={o}>
                              {o.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingLeadId(lead.id);
                            setNewStatus(lead.status);
                          }}
                          className="cursor-pointer"
                        >
                          <StatusBadge status={lead.status} />
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
