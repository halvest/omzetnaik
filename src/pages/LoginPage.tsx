// src/pages/LoginPage.tsx
import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ShieldAlert, LockKeyhole, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // 1. Cek sesi saat komponen pertama kali dimuat
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Jika sudah login dan role admin, langsung ke dashboard
      if (session?.user?.user_metadata?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        setSessionChecked(true);
      }
    };
    checkSession();
  }, [navigate]);

  // 2. Dengarkan perubahan status otentikasi
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Cek Role Admin sesuai skema tabel profiles/metadata
        if (session.user.user_metadata?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          setError(
            "Akses ditolak. Akun Anda tidak memiliki izin Administrator OmzetNaik.",
          );
          setTimeout(async () => {
            await supabase.auth.signOut();
            setError(null);
          }, 3500);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Loading State Bertema Midnight Navy
  if (!sessionChecked) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#F5F7FB] gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0F1F4A] rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
          Authenticating...
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F7FB] p-4 relative overflow-hidden font-sans">
      {/* Dekorasi Background Soft */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0F1F4A]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF3B3B]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="absolute top-8 left-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-[#0F1F4A] transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Site
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-[#0F1F4A]/5 border border-slate-100 overflow-hidden relative z-10"
      >
        {/* Header Branding OmzetNaik */}
        <div className="p-10 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-[#FF3B3B] text-white flex items-center justify-center rounded-2xl mb-6 shadow-lg shadow-red-600/20 rotate-12">
            <Target size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-[#0F1F4A] uppercase tracking-tighter">
            Omzet<span className="text-[#FF3B3B]">Naik</span> Portal
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-3">
            Authorized Personnel Only
          </p>
        </div>

        {/* Form Area dengan UI Supabase yang di-custom */}
        <div className="px-10 pb-10">
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
                    inputBorder: "#F1F5F9",
                    inputBorderFocus: "#0F1F4A",
                    inputLabelText: "#64748B",
                  },
                  radii: {
                    borderRadiusButton: "1rem",
                    borderRadiusInput: "1rem",
                  },
                },
              },
              className: {
                button:
                  "font-bold tracking-widest uppercase text-xs py-4 shadow-xl transition-all hover:scale-[1.02]",
                input: "font-bold text-slate-700 p-4",
                label: "font-black text-[10px] uppercase tracking-[0.1em] mb-2",
              },
            }}
            providers={[]}
            theme="light"
            showLinks={false}
          />
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-10 pb-10"
            >
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs flex items-start gap-3 shadow-sm">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-500" />
                <span className="font-bold leading-relaxed">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Kecil */}
        <div className="bg-slate-50/50 py-4 text-center border-t border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <LockKeyhole size={12} className="text-[#0F1F4A]" />
            AES-256 Encrypted Connection
          </p>
        </div>
      </motion.div>
    </div>
  );
}
