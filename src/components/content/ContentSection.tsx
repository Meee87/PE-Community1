import React, { useState } from "react";
import CategoryGrid from "./CategoryGrid";
import { ResourceGrid } from "./ResourceGrid";
import ContentCard from "./ContentCard";
import StageCard from "../navigation/StageCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Stage, STAGES } from "@/lib/constants";

const ContentSection = () => {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);
  const [showContentTypes, setShowContentTypes] = useState(false);

  const stage = stageId && STAGES[stageId] ? STAGES[stageId] : STAGES.primary;

  const handleBack = () => {
    if (showContentTypes) {
      setShowContentTypes(false);
    } else if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      navigate("/home");
    }
  };

  const renderHeader = () => {
    let title = stage.name;
    let description = `استكشف الموارد والأنشطة التعليمية لطلاب ${stage.name}`;

    if (showContentTypes) {
      title = selectedSubcategory.title;
      description = selectedSubcategory.description;
    } else if (selectedSubcategory) {
      title = selectedSubcategory.title;
      description = selectedSubcategory.description;
    } else if (selectedCategory) {
      title = selectedCategory.title;
      description = selectedCategory.description;
    }

    return (
      <div className="flex flex-row-reverse justify-between items-center">
        <Card className="p-6 bg-white flex-1">
          <h1 className="text-3xl font-heading text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </Card>
        <Button
          onClick={handleBack}
          variant="outline"
          className="ml-4 bg-white hover:bg-gray-50 flex flex-row-reverse items-center gap-2"
        >
          رجوع
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    if (showContentTypes) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {selectedSubcategory.contentTypes?.map((contentType) => (
            <ContentCard
              key={contentType.id}
              type={contentType.id as any}
              title={contentType.title}
              description={contentType.description}
              onClick={() => navigate(`/content/${contentType.id}`)}
            />
          ))}
        </div>
      );
    }

    if (selectedSubcategory) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {selectedSubcategory.contentTypes?.map((contentType) => (
            <ContentCard
              key={contentType.id}
              type={contentType.id as any}
              title={contentType.title}
              description={contentType.description}
              onClick={() => setShowContentTypes(true)}
            />
          ))}
        </div>
      );
    }

    if (selectedCategory) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {selectedCategory.subcategories?.map((subcategory) => (
            <StageCard
              key={subcategory.id}
              title={subcategory.title}
              description={subcategory.description}
              imageSrc={subcategory.imageUrl}
              features={subcategory.features}
              color={subcategory.color}
              buttonColor={subcategory.buttonColor}
              onClick={() => setSelectedSubcategory(subcategory)}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stage?.categories?.map((category) => (
          <StageCard
            key={category.id}
            title={category.title}
            description={category.description}
            imageSrc={category.imageUrl}
            features={category.features}
            color={category.color}
            buttonColor={category.buttonColor}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#748D19]/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {renderHeader()}

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

          <TabsContent value="categories">{renderContent()}</TabsContent>

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
