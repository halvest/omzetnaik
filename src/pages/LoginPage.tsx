// src/pages/LoginPage.tsx
import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  ShieldAlert,
  LockKeyhole,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Fungsi Helper untuk cek Role di Database
  const checkUserRole = async (userId: string) => {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || profile?.role !== "admin") {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const isAdmin = await checkUserRole(session.user.id);
        if (isAdmin) {
          navigate("/admin", { replace: true });
          return;
        } else {
          // Jika bukan admin, tendang keluar
          await supabase.auth.signOut();
        }
      }
      setSessionChecked(true);
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const isAdmin = await checkUserRole(session.user.id);

        if (isAdmin) {
          toast.success("Access Granted: Admin Terminal");
          navigate("/admin", { replace: true });
        } else {
          setError(
            "Akses ditolak. Terminal ini hanya untuk Administrator OmzetNaik.",
          );
          toast.error("Unauthorized Access");

          // Beri jeda agar user bisa baca error sebelum ditedang
          setTimeout(async () => {
            await supabase.auth.signOut();
            setError(null);
          }, 3000);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!sessionChecked) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 gap-5 font-sans">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Securing Connection...
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute top-8 left-8">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-3 text-slate-400 hover:text-primary transition-all font-bold text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Terminal
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden relative z-10"
      >
        <div className="p-12 pb-8 text-center">
          <motion.div
            initial={{ rotate: 12 }}
            whileHover={{ rotate: 0 }}
            className="mx-auto w-16 h-16 bg-accent text-white flex items-center justify-center rounded-2xl mb-8 shadow-accent-glow"
          >
            <Target size={32} strokeWidth={2.5} />
          </motion.div>

          <h2 className="text-2xl font-bold text-primary tracking-tighter uppercase">
            Omzet<span className="text-accent italic">Naik</span>{" "}
            <span className="font-light">Portal</span>
          </h2>

          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-px w-8 bg-slate-100" />
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">
              Restricted Area
            </p>
            <div className="h-px w-8 bg-slate-100" />
          </div>
        </div>

        <div className="px-12 pb-10">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#0F1F4A",
                    brandAccent: "#FF3B3B",
                    inputBackground: "#F8FAFC",
                    inputBorder: "#E2E8F0",
                  },
                  radii: {
                    borderRadiusButton: "0.75rem",
                    borderRadiusInput: "0.75rem",
                  },
                },
              },
              className: {
                button:
                  "font-bold tracking-[0.1em] uppercase text-[11px] py-4 transition-all",
                input: "font-medium text-sm p-4",
              },
            }}
            providers={[]}
            theme="light"
            showLinks={false}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-12 pb-10"
            >
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs flex items-start gap-3 shadow-sm">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-500" />
                <span className="font-bold leading-relaxed">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-slate-50 py-5 text-center border-t border-slate-100">
          <div className="flex items-center justify-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <LockKeyhole size={12} className="text-primary" />
            Secure AES-256 Protocol
          </div>
        </div>
      </motion.div>
    </div>
  );
}
