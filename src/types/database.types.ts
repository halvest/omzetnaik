// src/types/database.types.ts

/**
 * MASTER TYPES - DISESUAIKAN DENGAN SKEMA DATABASE SQL KOMPLEKS
 */

export type UserRole = "admin" | "marketing";

export type ListingType = "jual" | "sewa";

export type PropertyStatus = "active" | "pending" | "sold" | "inactive";

export type LeadStatus =
  | "new"
  | "contacted"
  | "follow_up"
  | "survey"
  | "closing"
  | "lost";

export type LeadType = "property" | "service";

export type FurnishingType =
  | "unfurnished"
  | "semi-furnished"
  | "full-furnished";

// --- Profile / User Type ---
export interface Profile {
  id: string;
  name: string;
  phone_number?: string;
  role: UserRole;
  company_name?: string;
  license_number?: string;
  photo_url?: string;
  is_verified: boolean;
  bio?: string;
  created_at: string;
  updated_at: string;
}

// --- Property Type ---
export interface Property {
  id: string;
  user_id?: string; // FK to profiles
  title: string;
  slug: string;
  description?: string;
  price: number; // Menggunakan bigint di DB, number di TS
  listing_type: ListingType;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  land_size?: number;
  building_size?: number;
  certificate?: string;
  furnishing?: FurnishingType;
  address?: string;
  city: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  status: PropertyStatus;
  is_featured: boolean;
  view_count: number;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
  // Joins
  profiles?: Profile;
  property_images?: PropertyImage[];
}

// --- Property Images Type ---
export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

// --- Services Type (Digital Marketing Agency Packages) ---
export interface AgencyService {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price_start?: number;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  benefit_list?: string[]; // ARRAY di SQL
  category?: string;
  created_at: string;
  updated_at: string;
}

// --- Posts Type (Blog / Content Marketing) ---
export interface Post {
  id: string;
  title?: string;
  slug: string;
  content?: string;
  image_url?: string;
  author_id?: string; // FK to profiles
  created_at: string;
  // Joins
  profiles?: Profile;
}

// --- Leads Type (CRM / Inbound Inquiries) ---
export interface Lead {
  id: string;
  type: LeadType;
  property_id?: string; // FK to properties
  service_id?: string; // FK to services
  assigned_to?: string; // FK to profiles
  name: string;
  phone: string;
  email?: string;
  domicile?: string;
  message?: string;
  status: LeadStatus;
  lead_score: number;
  is_read: boolean;

  // Marketing Tracking (UTM)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  page_url?: string;

  created_at: string;
  updated_at: string;

  // Joins
  properties?: Partial<Property>;
  services?: Partial<AgencyService>;
  profiles?: Partial<Profile>;
}
