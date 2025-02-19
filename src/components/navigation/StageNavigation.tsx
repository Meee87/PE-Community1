import React from "react";
import StageCard from "./StageCard";
import { motion } from "framer-motion";

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
  onStageSelect?: (stageId: string) => void;
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
    title: "المرحلة المتوسطة",
    description: "تعليم شامل للمرحلة المتوسطة",
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

const StageNavigation = ({
  stages = defaultStages,
  onStageSelect = () => {},
}: StageNavigationProps) => {
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

  return (
    <div className="w-full min-h-screen p-6 md:p-12 bg-[#69686b]">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-display text-gray-900 mb-8 text-center">
          المراحل التعليمية
        </h1>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-[#a80303]">
          {stages.map((stage) => (
            <motion.div key={stage.id} variants={item}>
              <StageCard
                title={stage.title}
                description={stage.description}
                icon={stage.icon}
                onClick={() => onStageSelect(stage.id)}
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
