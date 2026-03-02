export type Profile = {
  id: string;
  name: string;
  role: "admin" | "marketing";
  company_name?: string;
  photo_url?: string;
};

export type Property = {
  id: string;
  title: string;
  slug: string;
  price: number;
  listing_type: "jual" | "sewa";
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  land_size: number;
  building_size: number;
  city: string;
  district: string;
  status: "active" | "pending" | "sold";
  property_images?: { image_url: string; is_primary: boolean }[];
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price_start: number;
  benefit_list: string[];
  category: string;
};
