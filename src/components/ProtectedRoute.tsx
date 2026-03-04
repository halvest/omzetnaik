// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../utils/supabase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      // 1. Ambil session user saat ini secara asinkron
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setIsAdmin(false);
        return;
      }

      /** * 2. Cek Role Administrator
       * Disinkronkan dengan LoginPage: menggunakan 'role'
       * sesuai dengan struktur tabel profiles/user_metadata Anda.
       */
      const userRole = session.user.user_metadata?.role;

      if (userRole === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkUser();
  }, []);

  // --- LOADING STATE (OmzetNaik Style) ---
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0F1F4A] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#FF3B3B] rounded-full animate-pulse"></div>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0F1F4A] animate-pulse">
            Security Check...
          </span>
        </div>
      </div>
    );
  }

  // --- REDIRECT LOGIC ---
  if (!isAdmin) {
    /** * Jika bukan admin, arahkan ke login.
     * 'replace: true' digunakan agar user tidak bisa 'back' kembali ke halaman terproteksi.
     */
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika terverifikasi sebagai Admin, tampilkan konten dashboard
  return <>{children}</>;
}
