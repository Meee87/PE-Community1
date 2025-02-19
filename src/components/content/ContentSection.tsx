import React from "react";
import CategoryGrid from "./CategoryGrid";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Stage {
  id: string;
  name: string;
  categories: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
  }[];
}

interface ContentSectionProps {
  stage?: Stage;
}

const defaultStage: Stage = {
  id: "primary",
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
};

const ContentSection = ({ stage = defaultStage }: ContentSectionProps) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Card className="p-6 bg-white">
          <h1 className="text-3xl font-heading text-gray-900 mb-2">
            {stage.name}
          </h1>
          <p className="text-gray-600">
            استكشف الموارد والأنشطة التعليمية لطلاب {stage.name}
          </p>
        </Card>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="categories" className="flex-1">
              الفئات
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex-1">
              الأحدث
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1">
              المفضلة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategoryGrid categories={stage.categories} />
          </TabsContent>

          <TabsContent value="recent">
            <div className="text-center p-8 text-gray-500">
              ستظهر الأنشطة الحديثة هنا
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="text-center p-8 text-gray-500">
              ستظهر الأنشطة المفضلة هنا
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContentSection;
