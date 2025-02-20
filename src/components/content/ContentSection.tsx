import React from "react";
import CategoryGrid from "./CategoryGrid";
import { ResourceGrid } from "./ResourceGrid";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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

const defaultStages: Record<string, Stage> = {
  primary: {
    id: "primary",
    name: "المرحلة الابتدائية",
    categories: [
      {
        id: "early-childhood",
        title: "مرحلة الطفولة المبكرة",
        description: "الصفوف الأولية (1-3)",
        imageUrl:
          "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=500&auto=format",
        features: ["اللعب النشط", "إدارة الجسم", "الحركة التعبيرية"],
        color: "bg-[#5a43d7]/5",
        buttonColor: "bg-[#5a43d7]",
      },
      {
        id: "upper-grades",
        title: "مرحلة الصفوف العليا",
        description: "الصفوف العليا (4-6)",
        imageUrl:
          "https://images.unsplash.com/photo-1576334761529-0f1d6c944e73?w=500&auto=format",
        features: ["الألعاب الجماعية", "الألعاب الفردية"],
        color: "bg-[#5a43d7]/5",
        buttonColor: "bg-[#5a43d7]",
      },
    ],
  },
  middle: {
    id: "middle",
    name: "المرحلة الإعدادية",
    categories: [
      {
        id: "team-sports",
        title: "الرياضات الجماعية",
        description: "كرة القدم، كرة السلة، الكرة الطائرة",
        imageUrl:
          "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=500&auto=format",
      },
      {
        id: "individual-sports",
        title: "الرياضات الفردية",
        description: "الجمباز، ألعاب القوى، السباحة",
        imageUrl:
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format",
      },
      {
        id: "fitness",
        title: "اللياقة البدنية",
        description: "تمارين القوة والتحمل",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format",
      },
    ],
  },
  high: {
    id: "high",
    name: "المرحلة الثانوية",
    categories: [
      {
        id: "advanced-sports",
        title: "الرياضات المتقدمة",
        description: "التدريب المتخصص والمنافسات",
        imageUrl:
          "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=500&auto=format",
      },
      {
        id: "leadership",
        title: "القيادة الرياضية",
        description: "تطوير مهارات القيادة والتدريب",
        imageUrl:
          "https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?w=500&auto=format",
      },
      {
        id: "career",
        title: "المسار المهني",
        description: "التخطيط للمستقبل في المجال الرياضي",
        imageUrl:
          "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=500&auto=format",
      },
    ],
  },
};

const ContentSection = () => {
  console.log("ContentSection rendered");
  const { stageId } = useParams();
  console.log("Current stageId:", stageId);
  const navigate = useNavigate();
  const stage = stageId ? defaultStages[stageId] : defaultStages.primary;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-row-reverse justify-between items-center">
          <Card className="p-6 bg-white flex-1">
            <h1 className="text-3xl font-heading text-gray-900 mb-2">
              {stage.name}
            </h1>
            <p className="text-gray-600">
              استكشف الموارد والأنشطة التعليمية لطلاب {stage.name}
            </p>
          </Card>
          <Button
            onClick={() => navigate("/home")}
            variant="outline"
            className="ml-4 bg-white hover:bg-gray-50 flex flex-row-reverse items-center gap-2"
          >
            العودة للمراحل
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

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
            <ResourceGrid />
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
