import React from "react";
import CategoryGrid from "./CategoryGrid";
import { ResourceGrid } from "./ResourceGrid";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Stage, STAGES } from "@/lib/constants";

interface ContentSectionProps {
  stage?: Stage;
}

const defaultStages = STAGES;

const ContentSection = () => {
  const { stageId } = useParams();
  const navigate = useNavigate();

  const stage = stageId && STAGES[stageId] ? STAGES[stageId] : STAGES.primary;

  console.log("ContentSection rendered with stageId:", stageId);
  console.log("Stage data:", stage);

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
