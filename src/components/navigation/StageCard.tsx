import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

const StageCard = ({
  title = "المرحلة التعليمية",
  description = "انقر لاستكشاف الموارد والأنشطة لهذا المستوى التعليمي",
  imageSrc,
  icon = "book",
  onClick = () => {},
  className = "",
  color,
  buttonColor,
  features,
}: StageCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("w-full max-w-[350px] cursor-pointer", className)}
      onClick={onClick}
    >
      <Card
        className={`h-full overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-xl static ${color || "bg-[#F8FAF5]"}`}
      >
        <div className="relative h-32 sm:h-48 overflow-hidden">
          <img
            src={
              imageSrc ||
              (icon === "book"
                ? "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2069&auto=format&fit=crop"
                : icon === "users"
                  ? "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop"
                  : "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop")
            }
            alt={title}
            className="w-full h-full object-cover transform transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/20 p-2 sm:p-3 rounded-full backdrop-blur-sm transform-gpu transition-transform duration-300 hover:scale-110">
            <img
              src={
                icon === "book"
                  ? "https://api.iconify.design/fluent-emoji-flat:school-building.svg"
                  : icon === "users"
                    ? "https://api.iconify.design/fluent-emoji-flat:student-medium-light.svg"
                    : "https://api.iconify.design/fluent-emoji-flat:graduation-cap.svg"
              }
              alt="icon"
              className="w-8 h-8 sm:w-12 sm:h-12"
            />
          </div>
        </div>
        <div dir="rtl" className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                {description}
              </p>
            </div>
            {features && features.length > 0 && (
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-end gap-2 text-gray-600"
                  >
                    <span className="text-sm">{feature}</span>
                    <div
                      className={`flex items-center justify-center w-5 h-5 rounded-full ${buttonColor?.replace("bg-", "bg-opacity-20 bg-")}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-3 w-3 ${buttonColor?.replace("bg-", "text-")}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              className={`mt-6 sm:mt-8 w-full ${buttonColor || "bg-[#7C9D32]"} hover:opacity-90 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base font-medium`}
            >
              استكشف المرحلة
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StageCard;
