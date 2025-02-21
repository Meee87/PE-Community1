import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ResourceGrid } from "./ResourceGrid";
import ContentCard from "./ContentCard";
import StageCard from "../navigation/StageCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ContentUploadDialog from "./ContentUploadDialog";
import { useToast } from "@/components/ui/use-toast";
import { Stage, STAGES } from "@/lib/constants";

const ContentSection = () => {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);
  const [showContentTypes, setShowContentTypes] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contentItems, setContentItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState([]);

  // Listen for content updates
  useEffect(() => {
    const handleContentUpdate = () => {
      if (selectedSubcategory?.selectedContentType) {
        fetchContent(selectedSubcategory.selectedContentType);
      }
    };

    window.addEventListener("content-updated", handleContentUpdate);
    return () =>
      window.removeEventListener("content-updated", handleContentUpdate);
  }, [selectedSubcategory]);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, email")
          .eq("id", user.id)
          .single();
        setIsAdmin(
          profile?.email === "eng.mohamed87@live.com" &&
            profile?.role === "admin",
        );
      }
    };
    checkAdmin();
  }, []);

  const [selectedStage, setSelectedStage] = useState(stageId || "primary");
  const stage = STAGES[selectedStage];

  const handleBack = () => {
    if (showContentTypes && selectedSubcategory?.selectedContentType) {
      setSelectedSubcategory({
        ...selectedSubcategory,
        selectedContentType: null,
      });
      setShowContentTypes(false);
    } else if (showContentTypes) {
      setShowContentTypes(false);
    } else if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      navigate("/home");
    }
  };

  const fetchContent = async (contentType: string) => {
    try {
      console.log("Fetching content for:", {
        contentType,
        stageId: selectedStage,
        categoryId: selectedSubcategory?.id,
      });

      const dbContentType =
        contentType === "images"
          ? "image"
          : contentType === "videos"
            ? "video"
            : contentType === "files"
              ? "file"
              : "talent";

      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type", dbContentType)
        .eq("stage_id", selectedStage)
        .eq("category_id", selectedSubcategory?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Fetched content:", data);

      setContentItems(data || []);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء تحميل المحتوى",
      });
    }
  };

  const renderContentTypeGrid = (contentType: any) => {
    const filteredContent =
      activeTab === "recent"
        ? contentItems.slice(0, 5)
        : activeTab === "favorites"
          ? contentItems.filter((item) => favorites.includes(item.id))
          : contentItems;

    const resources = filteredContent.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      thumbnail: item.url,
      downloadUrl: item.url,
    }));

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-right">
          {contentType.title}
        </h2>
        <ResourceGrid
          resources={resources}
          onPreview={(resource) => {
            window.open(resource.downloadUrl, "_blank");
          }}
          onDownload={(resource) => {
            window.open(resource.downloadUrl, "_blank");
          }}
        />
      </div>
    );
  };

  const renderHeader = () => {
    let title = stage.name;
    let description = `استكشف الموارد والأنشطة التعليمية لطلاب ${stage.name}`;

    if (showContentTypes && selectedSubcategory?.selectedContentType) {
      const contentType = selectedSubcategory.contentTypes?.find(
        (type) => type.id === selectedSubcategory.selectedContentType,
      );
      title = contentType?.title || selectedSubcategory.title;
      description = contentType?.description || selectedSubcategory.description;
    } else if (selectedSubcategory) {
      title = selectedSubcategory.title;
      description = selectedSubcategory.description;
    } else if (selectedCategory) {
      title = selectedCategory.title;
      description = selectedCategory.description;
    }

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-4" dir="rtl">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="bg-white hover:bg-gray-50 flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              الرئيسية
            </Button>
            <Button
              onClick={handleBack}
              variant="outline"
              className="bg-white hover:bg-gray-50 flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              رجوع
            </Button>
          </div>
          {selectedSubcategory && !showContentTypes && (
            <ContentUploadDialog
              stageId={selectedStage}
              categoryId={selectedSubcategory.id}
              isAdmin={isAdmin}
            />
          )}
        </div>
        <Card className="p-6 bg-[#FFD700]/10 text-center" dir="rtl">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-heading text-[#7C9D32]">
              {title}
            </h1>
            <p className="text-gray-600 max-w-2xl">{description}</p>
          </div>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    if (selectedSubcategory?.selectedContentType) {
      const selectedType = selectedSubcategory.contentTypes?.find(
        (type) => type.id === selectedSubcategory.selectedContentType,
      );
      if (selectedType) {
        return (
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid gap-6">
              {renderContentTypeGrid(selectedType)}
            </div>
          </div>
        );
      }
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
              onClick={() => {
                fetchContent(contentType.id);
                setSelectedSubcategory({
                  ...selectedSubcategory,
                  selectedContentType: contentType.id,
                });
                setShowContentTypes(true);
              }}
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
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center max-w-[800px] mx-auto">
          {stage?.categories?.map((category) => (
            <StageCard
              key={category.id}
              title={category.title}
              description={category.description}
              imageSrc={category.imageUrl}
              color={category.color}
              buttonColor={category.buttonColor}
              features={category.features}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#748D19]/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {renderHeader()}

        {showContentTypes && selectedSubcategory?.selectedContentType ? (
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="all" className="flex-1">
                الكل
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex-1">
                الأحدث
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex-1">
                المفضلة
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">{renderContent()}</TabsContent>
            <TabsContent value="recent">{renderContent()}</TabsContent>
            <TabsContent value="favorites">{renderContent()}</TabsContent>
          </Tabs>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default ContentSection;
