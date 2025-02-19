import React, { useState } from "react";
import MainHeader from "@/components/header/MainHeader";
import StageNavigation from "./navigation/StageNavigation";
import ContentSection from "./content/ContentSection";
import { motion, AnimatePresence } from "framer-motion";

interface HomeProps {
  initialStage?: string;
}

const Home = ({ initialStage }: HomeProps) => {
  const [selectedStage, setSelectedStage] = useState<string | null>(
    initialStage || null,
  );

  const handleStageSelect = (stageId: string) => {
    setSelectedStage(stageId);
  };

  const handleBack = () => {
    setSelectedStage(null);
  };

  const getStageContent = (stageId: string) => {
    const stageMap = {
      primary: {
        id: stageId,
        name: "المرحلة الابتدائية",
        categories: [
          {
            id: "active-play",
            title: "اللعب النشط",
            description: "الأنشطة البدنية والألعاب للتعلم النشط",
            imageUrl:
              "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format",
          },
          {
            id: "body-management",
            title: "إدارة الجسم",
            description: "تمارين تركز على التحكم في الجسم والتنسيق",
            imageUrl:
              "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format",
          },
          {
            id: "expressive-movement",
            title: "الحركة التعبيرية",
            description: "أنشطة الحركة الإبداعية والرقص",
            imageUrl:
              "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=500&auto=format",
          },
        ],
      },
      middle: {
        id: stageId,
        name: "المرحلة المتوسطة",
        categories: [
          {
            id: "active-play",
            title: "اللعب النشط",
            description: "الأنشطة البدنية والألعاب للتعلم النشط",
            imageUrl:
              "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format",
          },
          {
            id: "body-management",
            title: "إدارة الجسم",
            description: "تمارين تركز على التحكم في الجسم والتنسيق",
            imageUrl:
              "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format",
          },
          {
            id: "expressive-movement",
            title: "الحركة التعبيرية",
            description: "أنشطة الحركة الإبداعية والرقص",
            imageUrl:
              "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=500&auto=format",
          },
        ],
      },
      high: {
        id: stageId,
        name: "المرحلة الثانوية",
        categories: [
          {
            id: "active-play",
            title: "اللعب النشط",
            description: "الأنشطة البدنية والألعاب للتعلم النشط",
            imageUrl:
              "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format",
          },
          {
            id: "body-management",
            title: "إدارة الجسم",
            description: "تمارين تركز على التحكم في الجسم والتنسيق",
            imageUrl:
              "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format",
          },
          {
            id: "expressive-movement",
            title: "الحركة التعبيرية",
            description: "أنشطة الحركة الإبداعية والرقص",
            imageUrl:
              "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=500&auto=format",
          },
        ],
      },
    };

    return stageMap[stageId as keyof typeof stageMap];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <AnimatePresence mode="wait">
        {!selectedStage ? (
          <motion.div
            key="navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StageNavigation onStageSelect={handleStageSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <div className="p-4">
              <button
                onClick={handleBack}
                className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                العودة إلى المراحل
              </button>
              <ContentSection stage={getStageContent(selectedStage)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
