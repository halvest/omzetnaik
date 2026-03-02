import { Property } from "@/types/database";
import { formatIDR } from "@/lib/utils/format"; // Helper rupiah
import { Bed, Bath, Maximize } from "lucide-react";
import Link from "next/link";

export default function PropertyCard({ property }: { property: Property }) {
  const mainImage =
    property.property_images?.find((img) => img.is_primary)?.image_url ||
    property.property_images?.[0]?.image_url;

  return (
    <div className="group bg-primarySoft/20 border border-white/5 rounded-2xl overflow-hidden hover:border-accent/40 transition-all">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
          {property.listing_type === "jual" ? "Dijual" : "Disewakan"}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-lg mb-1 truncate">
          {property.title}
        </h3>
        <p className="text-textSoft text-sm mb-3">
          {property.district}, {property.city}
        </p>

        <div className="flex gap-4 mb-4 py-3 border-y border-white/5">
          <span className="flex items-center gap-1.5 text-xs text-textSoft">
            <Bed size={14} className="text-accent" /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-textSoft">
            <Bath size={14} className="text-accent" /> {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-textSoft">
            <Maximize size={14} className="text-accent" /> {property.land_size}
            m²
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-accent font-extrabold text-xl">
            {formatIDR(property.price)}
          </span>
          <Link
            href={`/properties/${property.slug}`}
            className="text-xs font-bold text-white hover:text-accent underline"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
