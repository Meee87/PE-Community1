import React from "react";
import StageCard from "./StageCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Stage {
  id: string;
  title: string;
  description: string;
  icon?: "book" | "target" | "users";
  color?: string;
  features?: string[];
}

interface StageNavigationProps {
  stages?: Stage[];
}

const defaultStages: Stage[] = [
  {
    id: "primary",
    title: "المرحلة الابتدائية",
    description: "تعليم الطفولة المبكرة والصفوف العليا",
    icon: "book",
    color: "bg-white",
    buttonColor: "bg-[#2563eb]",
    features: [
      "المهارات الحركية الأساسية",
      "الألعاب التعليمية الممتعة",
      "التمارين البدنية البسيطة",
      "تنمية الثقة بالنفس",
      "التعاون والعمل الجماعي",
    ],
  },
  {
    id: "middle",
    title: "المرحلة الإعدادية",
    description: "تعليم شامل للمرحلة الإعدادية",
    icon: "users",
    color: "bg-white",
    buttonColor: "bg-[#738e19]",
    features: [
      "الرياضات الجماعية المتنوعة",
      "تطوير المهارات المتقدمة",
      "التدريب البدني المنظم",
      "المشاركة في المسابقات",
      "تعزيز روح المنافسة",
    ],
  },
  {
    id: "high",
    title: "المرحلة الثانوية",
    description: "الإعداد الأكاديمي المتقدم",
    icon: "target",
    color: "bg-white",
    buttonColor: "bg-[#f9d400]",
    features: [
      "التخصص الرياضي المتقدم",
      "القيادة والتدريب الاحترافي",
      "المنافسات الرياضية العالية",
      "التخطيط للمستقبل الرياضي",
      "تطوير المهارات القيادية",
    ],
  },
];

const StageNavigation = ({ stages = defaultStages }: StageNavigationProps) => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleStageSelect = (stageId: string) => {
    console.log("Navigating to stage:", stageId);
    navigate(`/stage/${stageId}`, { replace: true });
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="icon"
            className="bg-white hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Button>
          <h1 className="text-2xl sm:text-4xl font-display text-gray-900">
            المراحل التعليمية
          </h1>
        </div>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-[#a80303]">
          {stages.map((stage) => (
            <motion.div key={stage.id} variants={item}>
              <StageCard
                title={stage.title}
                description={stage.description}
                icon={stage.icon}
                onClick={() => handleStageSelect(stage.id)}
                className="h-full"
                color={stage.color}
                buttonColor={stage.buttonColor}
                features={stage.features}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StageNavigation;
