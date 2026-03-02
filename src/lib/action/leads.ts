import { createClient } from "@/lib/supabase/client";

export async function submitLead(formData: FormData) {
  const supabase = createClient();

  const rawData = {
    type: formData.get("type"), // 'property' or 'service'
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
    utm_source: "website_organic",
    page_url: window.location.href,
  };

  const { error } = await supabase.from("leads").insert([rawData]);

  if (error) return { success: false, message: "Gagal mengirim pesan." };
  return {
    success: true,
    message: "Pesan terkirim! Tim kami akan segera menghubungi Anda.",
  };
}
