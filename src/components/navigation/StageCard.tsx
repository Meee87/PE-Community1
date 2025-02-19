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
      <Card className="h-full overflow-hidden bg-white shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              icon === "book"
                ? "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2076&auto=format&fit=crop"
                : icon === "users"
                  ? "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop"
                  : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
            }
            alt={title}
            className="w-full h-full object-cover"
          />
          <div
            className={cn(
              "absolute inset-0",
              icon === "book"
                ? "bg-[#2563eb]/70"
                : icon === "users"
                  ? "bg-[#738e19]/70"
                  : "bg-[#f9d400]/70",
            )}
          />
          <div className="absolute top-4 right-4 bg-white/20 p-3 rounded-full backdrop-blur-sm">
            <img
              src={
                icon === "book"
                  ? "https://api.dicebear.com/7.x/icons/svg?icon=schoolBuilding&backgroundColor=transparent&textColor=white"
                  : icon === "users"
                    ? "https://api.dicebear.com/7.x/icons/svg?icon=graduationCap&backgroundColor=transparent&textColor=white"
                    : "https://api.dicebear.com/7.x/icons/svg?icon=trophy&backgroundColor=transparent&textColor=white"
              }
              alt="icon"
              className="w-12 h-12"
            />
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-gray-900 mb-2">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {features?.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <button
            className={`mt-6 w-full ${buttonColor || "bg-blue-600"} hover:opacity-90 text-white py-2 px-4 rounded-lg transition-colors`}
          >
            استكشف المرحلة
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StageCard;
