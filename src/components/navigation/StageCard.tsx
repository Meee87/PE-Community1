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
      className={cn("w-full max-w-sm cursor-pointer", className)}
      onClick={onClick}
    >
      <Card
        className={`h-full overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-xl static ${buttonColor?.replace("bg-", "bg-opacity-10 bg-")}`}
      >
        <div className="relative h-36 sm:h-48 overflow-hidden">
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
              className="w-12 h-12 sm:w-16 sm:h-16"
            />
          </div>
        </div>
        <div dir="rtl">
          <CardHeader className="items-stretch flex-col text-right">
            <CardTitle className="text-xl sm:text-2xl mb-2 font-display">
              {title}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base sm:text-lg font-heading">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {features?.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-end gap-2 text-gray-600 font-heading"
                >
                  <span>{feature}</span>
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
            <button
              className={`mt-6 w-full ${buttonColor || "bg-[#7C9D32]"} hover:opacity-90 text-white py-2 px-4 rounded-lg transition-colors font-heading`}
            >
              استكشف المرحلة
            </button>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default StageCard;
