import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";

interface StageCardProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  icon?: "book" | "target" | "users";
  onClick?: () => void;
  className?: string;
  color?: string;
  buttonColor?: string;
  features?: string[];
}

const fallbackImage = (title?: string) => {
  if (title?.includes("المرحلة الابتدائية")) return "https://i.imgur.com/sJbg6xJ.png";
  if (title?.includes("اللعب النشط"))
    return "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&auto=format&fit=crop";
  if (title?.includes("إدارة الجسم"))
    return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop";
  if (title?.includes("الحركة التعبيرية"))
    return "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop";
  if (title?.includes("مرحلة الطفولة")) return "https://i.imgur.com/ddVwLrc.png";
  if (title?.includes("الصفوف العليا")) return "https://i.imgur.com/yv5Ny0t.png";
  return "https://i.imgur.com/yv5Ny0t.png";
};

// رمز 3D (fluent-emoji)
const emojiFor = (title?: string) => {
  const n = title?.includes("اللعب النشط")
    ? "person-bouncing-ball"
    : title?.includes("إدارة الجسم")
      ? "person-in-lotus-position"
      : title?.includes("الحركة التعبيرية")
        ? "person-dancing"
        : title?.includes("مرحلة الطفولة")
          ? "child"
          : title?.includes("الصفوف العليا")
            ? "student"
            : title?.includes("الألعاب الجماعية")
              ? "people-wrestling"
              : title?.includes("الفردية")
                ? "person-cartwheeling"
                : "person-running";
  return `https://api.iconify.design/fluent-emoji/${n}.svg`;
};

const StageCard = ({
  title = "المرحلة التعليمية",
  description = "انقر لاستكشاف الموارد والأنشطة لهذا المستوى التعليمي",
  imageSrc,
  onClick = () => {},
  className = "",
  color,
  buttonColor,
  features,
}: StageCardProps) => {
  const accent = buttonColor?.match(/#[0-9a-fA-F]{6}/)?.[0] ?? "#8A1538";
  const isStage = title?.includes("المرحلة");

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn("w-full max-w-[420px] mx-auto cursor-pointer", className)}
      onClick={onClick}
    >
      <Card
        className={cn(
          "group h-full overflow-hidden rounded-[28px] border-0 ring-1 ring-black/[0.06] shadow-[0_12px_34px_rgba(20,20,20,0.09)] hover:shadow-[0_26px_55px_rgba(20,20,20,0.16)] transition-all duration-300 static",
          color || "bg-white",
        )}
      >
        {/* الصورة */}
        <div className="relative h-44 md:h-48 overflow-hidden">
          <img
            src={imageSrc || fallbackImage(title)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* تدرّج خفيف من اللون أسفل الصورة (نظيف، مش طامس) */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${accent}59 0%, ${accent}10 35%, transparent 70%)`,
            }}
          />
        </div>

        {/* بادج الرمز 3D الطايف */}
        <div className="relative">
          <div className="absolute -top-9 right-6 z-10 w-[68px] h-[68px] rounded-[20px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] ring-1 ring-black/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            <img
              src={emojiFor(title)}
              alt=""
              className="w-10 h-10 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]"
              loading="lazy"
            />
          </div>
        </div>

        {/* المحتوى */}
        <div className="p-6 pt-5 text-right">
          <h3 className="text-xl font-extrabold text-gray-900 mb-1.5">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-5">
            {description}
          </p>

          {features && features.length > 0 && (
            <ul className="space-y-2.5 mb-6">
              {features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center justify-end gap-2.5 text-gray-700 text-sm"
                >
                  <span>{feature}</span>
                  <span
                    className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: `${accent}1A`, color: accent }}
                  >
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                </li>
              ))}
            </ul>
          )}

          <button
            className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
          >
            <span>{isStage ? "استكشف المرحلة" : "عرض المحتوى"}</span>
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default StageCard;
