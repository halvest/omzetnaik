// src/pages/AdminMarketingManager.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../utils/supabase";
import {
  Trash2,
  Search,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  UserCheck,
  ChevronDown,
  RefreshCw,
  Phone,
  UserX,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface MarketingProfile {
  id: string;
  created_at: string;
  name: string;
  phone_number: string;
  role: "admin" | "marketing";
  is_verified: boolean;
  company_name: string;
}

export default function AdminMarketingManager() {
  const [profiles, setProfiles] = useState<MarketingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchMarketingProfiles = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setIsRefreshing(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "marketing")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProfiles(data as MarketingProfile[]);
    } catch (error: any) {
      toast.error("Sync Error: " + error.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketingProfiles();
  }, [fetchMarketingProfiles]);

  const toggleVerification = async (id: string, currentStatus: boolean) => {
    const loadingToast = toast.loading(
      currentStatus ? "Revoking access..." : "Verifying agent...",
    );

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_verified: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast.success(
        !currentStatus ? "Agent Verified Successfully" : "Access Revoked",
        { id: loadingToast },
      );
      fetchMarketingProfiles(true);
    } catch (error: any) {
      toast.error("Update Failed: " + error.message, { id: loadingToast });
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (
      !window.confirm(
        "Hapus akun ini dari database profiles? Tindakan ini tidak menghapus kredensial login Auth.",
      )
    )
      return;

    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
      toast.success("Profile deleted");
      fetchMarketingProfiles(true);
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
    }
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone_number?.includes(searchTerm);
      const matchesStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "verified"
            ? p.is_verified
            : !p.is_verified;
      return matchesSearch && matchesStatus;
    });
  }, [profiles, searchTerm, filterStatus]);

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold text-primary tracking-tighter uppercase">
            Marketing <span className="text-accent italic">Authorization.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Konfirmasi registrasi dan kelola akses agent marketing.
          </p>
        </motion.div>

        <button
          onClick={() => fetchMarketingProfiles(true)}
          className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-primary transition-all active:scale-90"
        >
          <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama agent atau nomor WA..."
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold text-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="lg:col-span-4 relative">
          <select
            className="w-full pl-6 pr-12 py-5 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm outline-none appearance-none font-bold text-sm text-primary cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="verified">Verified Agent</option>
            <option value="pending">Waiting Approval</option>
          </select>
          <ChevronDown
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Agent Details
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Join Date
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Permission
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Commands
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-40 text-center">
                    <Loader2
                      className="animate-spin text-accent mx-auto"
                      size={40}
                    />
                    <p className="mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      Accessing Profile Registry...
                    </p>
                  </td>
                </tr>
              ) : filteredProfiles.length > 0 ? (
                filteredProfiles.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-slate-50/80 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-primary flex items-center justify-center font-black text-lg border border-slate-200 uppercase">
                          {item.name?.charAt(0) || <User size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-primary text-base tracking-tight">
                            {item.name || "Unnamed Agent"}
                          </p>
                          <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold mt-0.5 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <Phone size={12} className="text-emerald-500" />{" "}
                              {item.phone_number || "No Phone"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-500">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          item.is_verified
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {item.is_verified ? (
                          <ShieldCheck size={14} />
                        ) : (
                          <ShieldAlert size={14} />
                        )}
                        {item.is_verified ? "Verified Agent" : "Access Pending"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() =>
                            toggleVerification(item.id, item.is_verified)
                          }
                          className={`p-3 rounded-xl transition-all shadow-sm border ${
                            item.is_verified
                              ? "bg-white text-rose-500 hover:bg-rose-500 hover:text-white"
                              : "bg-white text-emerald-500 hover:bg-emerald-500 hover:text-white"
                          }`}
                          title={
                            item.is_verified ? "Revoke Access" : "Verify Agent"
                          }
                        >
                          {item.is_verified ? (
                            <UserX size={18} />
                          ) : (
                            <UserCheck size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(item.id)}
                          className="p-3 bg-white text-slate-300 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-slate-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                      No matching marketing agents found.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
