// src/services/propertyService.ts
import { supabase } from "../utils/supabase";
import { Property, Lead } from "../types/database.types";

export const propertyService = {
  // 1. Ambil semua properti (untuk halaman Listings)
  // Dilengkapi dengan join ke tabel property_images sesuai skema baru
  async getAllProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        property_images (
          image_url,
          is_primary
        )
      `,
      )
      .eq("status", "active")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as any[];
  },

  // 2. Ambil satu properti by Slug (untuk halaman Detail)
  // Menambahkan fungsi increment view_count sesuai kolom di skema
  async getPropertyBySlug(slug: string) {
    // Fetch data properti
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        profiles (name, photo_url),
        property_images (image_url, is_primary, sort_order)
      `,
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;

    // Increment View Count secara RPC atau update langsung
    if (data) {
      await supabase
        .from("properties")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id);
    }

    return data;
  },

  // 3. Ambil properti unggulan saja (untuk Landing Page)
  async getFeaturedProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        *,
        property_images (image_url)
      `,
      )
      .eq("is_featured", true)
      .eq("status", "active")
      .limit(6);

    if (error) throw error;
    return data as any[];
  },

  // 4. Kirim Lead Baru (Formulir Kontak)
  // Menyesuaikan dengan constraint 'type' (property/service) di skema baru
  async submitLead(leadData: Partial<Lead>) {
    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          ...leadData,
          status: leadData.status || "new",
          lead_score: 0,
          is_read: false,
        },
      ])
      .select();

    if (error) throw error;
    return data;
  },

  // 5. Ambil Layanan Agency (Tambahan untuk model Agensi)
  async getAgencyServices() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false });

    if (error) throw error;
    return data;
  },
};
