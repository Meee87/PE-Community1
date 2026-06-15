import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Check,
  ArrowLeft,
  GraduationCap,
  Activity,
  Sparkles,
  Baby,
  Users,
  Dumbbell,
  Medal,
  Trophy,
  type LucideIcon,
} from "lucide-react";

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

const BRAND = "#8A1538";

const iconFor = (title?: string): LucideIcon => {
  if (title?.includes("اللعب النشط")) return Activity;
  if (title?.includes("إدارة الجسم")) return Dumbbell;
  if (title?.includes("الحركة التعبيرية")) return Sparkles;
  if (title?.includes("مرحلة الطفولة")) return Baby;
  if (title?.includes("الصفوف العليا")) return GraduationCap;
  if (title?.includes("الجماعية")) return Users;
  if (title?.includes("الفردية")) return Medal;
  if (title?.includes("المرحلة")) return GraduationCap;
  return Trophy;
};

const fallbackImage = (title?: string) => {
  if (title?.includes("المرحلة الابتدائية")) return "/primary_stage.png";
  if (title?.includes("المرحلة الإعدادية")) return "/preparatory_stage.png";
  if (title?.includes("المرحلة الثانوية")) return "/secondary_stage.png";
  if (title?.includes("اللعب النشط"))
    return "/active_play.png";
  if (title?.includes("إدارة الجسم"))
    return "/body_management.png";
  if (title?.includes("الحركة التعبيرية"))
    return "/expressive_movement.png";
  if (title?.includes("مرحلة الطفولة")) return "/early_childhood.png";
  if (title?.includes("الصفوف العليا")) return "/upper_grades.png";
  return "/upper_grades.png";
};

const StageCard = ({
  title = "المرحلة التعليمية",
  description = "انقر لاستكشاف الموارد والأنشطة لهذا المستوى التعليمي",
  imageSrc,
  onClick = () => {},
  className = "",
  features,
}: StageCardProps) => {
  const Icon = iconFor(title);
  const isStage = title?.includes("المرحلة");

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={cn("w-full max-w-[420px] mx-auto cursor-pointer", className)}
      onClick={onClick}
    >
      <div className="group h-full bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-gray-200 hover:shadow-[0_16px_44px_rgba(20,20,20,0.10)]">
        {/* الصورة — نظيفة بدون طمس */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={imageSrc || fallbackImage(title)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* شارة أيقونة صغيرة أنيقة فوق الصورة */}
          <div
            className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm shadow-sm flex items-center justify-center"
          >
            <Icon className="w-5 h-5" style={{ color: BRAND }} strokeWidth={2} />
          </div>
        </div>

        {/* الجسم — أبيض نظيف */}
        <div className="p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-snug">
            {title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            {description}
          </p>

          {features && features.length > 0 && (
            <ul className="space-y-2.5 mb-6">
              {features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-gray-600 text-sm"
                >
                  <Check
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: BRAND }}
                    strokeWidth={2.5}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          <button
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-2xl transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{ backgroundColor: BRAND }}
          >
            <span>{isStage ? "استكشف المرحلة" : "عرض المحتوى"}</span>
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StageCard;
