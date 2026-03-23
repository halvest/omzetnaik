// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../utils/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: "admin"; // Sekarang hanya fokus pada admin
}

export default function ProtectedRoute({
  children,
  allowedRole = "admin",
}: ProtectedRouteProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // 1. Ambil session aktif
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          if (isMounted) setAuthorized(false);
          return;
        }

        // 2. Cek Role langsung ke database (Tabel Profiles)
        // Kita hanya perlu memastikan role-nya adalah 'admin'
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error || !profile || profile.role !== "admin") {
          if (isMounted) setAuthorized(false);
          return;
        }

        if (isMounted) setAuthorized(true);
      } catch (err) {
        if (isMounted) setAuthorized(false);
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [allowedRole]);

  // --- LOADING STATE (OmzetNaik Style) ---
  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Terminal Verification...
          </span>
        </div>
      </div>
    );
  }

  // --- REDIRECT LOGIC ---
  if (!authorized) {
    // Jika gagal verifikasi admin, tendang ke halaman login utama
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
