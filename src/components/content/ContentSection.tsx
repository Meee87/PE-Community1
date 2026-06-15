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
import { getFavorites, onFavoritesChange } from "@/lib/favorites";

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
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    return onFavoritesChange(() => setFavorites(getFavorites()));
  }, []);

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

        // التحقق مباشرة من دور المستخدم
        setIsAdmin(profile?.role === "admin");
      }
    };
    checkAdmin();
  }, []);

  const [selectedStage, setSelectedStage] = useState(stageId || "primary");
  const stage = STAGES[selectedStage];

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
    console.log("Fetching content for type:", contentType);
    setContentItems([]);
    try {
      console.log("Fetching content for:", {
        contentType,
        stageId: selectedStage,
        categoryId: selectedSubcategory?.id,
      });

      // Map UI content types to database types
      let dbContentType = contentType;
      if (contentType === "images") dbContentType = "image";
      if (contentType === "videos") dbContentType = "video";
      if (contentType === "files") dbContentType = "file";
      if (contentType === "talented") dbContentType = "talent";

      console.log("Using DB content type:", dbContentType);

      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type", dbContentType)
        .eq("stage_id", selectedStage)
        .eq("category_id", selectedSubcategory?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Fetched content:", data);

      // Map the data to include proper URLs
      const mappedData = (data || []).map((item) => ({
        ...item,
        url: item.url.startsWith("http") ? item.url : item.url,
      }));

      console.log("Mapped data:", mappedData);
      setContentItems(mappedData);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "خطأ!",
        description: "حدث خطأ أثناء تحميل المحتوى",
        variant: "destructive",
      });
    }
  };

  const renderContentTypeGrid = (contentType: any) => {
    const filteredContent =
      activeTab === "recent"
        ? contentItems.slice(0, 5)
        : activeTab === "favorites"
          ? contentItems.filter((item) => favorites.includes(String(item.id)))
          : contentItems;

    const resources = filteredContent.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      thumbnail: item.url,
      downloadUrl: item.url,
    }));

    // If no content is available, add example content based on content type and subcategory
    if (resources.length === 0) {
      // Map content type IDs to database types
      const dbContentType =
        contentType.id === "images"
          ? "image"
          : contentType.id === "videos"
            ? "video"
            : contentType.id === "files"
              ? "file"
              : "talent";

      // Empty example content object - all examples removed
      const exampleContent = {};

      // No example content will be added
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 no-reverse" dir="rtl">
          <h2 className="text-xl font-semibold text-right">
            {contentType.title}
          </h2>
          {selectedSubcategory?.id && (
            <ContentUploadDialog
              stageId={selectedStage}
              categoryId={selectedSubcategory.id}
              isAdmin={isAdmin}
              contentType={contentType.id}
            />
          )}
        </div>
        <ResourceGrid
          resources={resources}
          onPreview={() => {
            /* المعاينة يتكفّل بها لايت بوكس ResourceGrid (يدعم العرض الطولي بشكل صحيح) */
          }}
          onDownload={(resource) => {
            const link = document.createElement("a");
            link.href = resource.downloadUrl;
            link.download = resource.title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          onDelete={(resource) => {
            console.log("Deleting resource:", resource.id);
            // Force refresh the content
            if (selectedSubcategory?.selectedContentType) {
              fetchContent(selectedSubcategory.selectedContentType);
            }
          }}
          isAdmin={isAdmin}
        />
      </div>
    );
  };

  const renderBreadcrumb = () => {
    const crumbs: { label: string; onClick?: () => void }[] = [
      { label: "الرئيسية", onClick: () => navigate("/home") },
      {
        label: stage?.name,
        onClick: () => {
          setSelectedCategory(null);
          setSelectedSubcategory(null);
          setShowContentTypes(false);
        },
      },
    ];

    if (selectedCategory) {
      crumbs.push({
        label: selectedCategory.title,
        onClick: () => {
          setSelectedSubcategory(null);
          setShowContentTypes(false);
        },
      });
    }
    if (selectedSubcategory) {
      crumbs.push({
        label: selectedSubcategory.title,
        onClick: () => {
          setSelectedSubcategory({
            ...selectedSubcategory,
            selectedContentType: null,
          });
          setShowContentTypes(false);
        },
      });
    }
    if (showContentTypes && selectedSubcategory?.selectedContentType) {
      const ct = selectedSubcategory.contentTypes?.find(
        (t) => t.id === selectedSubcategory.selectedContentType,
      );
      if (ct) crumbs.push({ label: ct.title });
    }

    return (
      <nav
        className="flex flex-wrap items-center gap-1 text-sm text-gray-500 mb-3"
        dir="rtl"
        aria-label="مسار التنقّل"
      >
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300">/</span>}
              {last || !c.onClick ? (
                <span className="font-bold text-[#8A1538]">{c.label}</span>
              ) : (
                <button
                  onClick={c.onClick}
                  className="hover:text-[#8A1538] hover:underline transition-colors"
                >
                  {c.label}
                </button>
              )}
            </span>
          );
        })}
      </nav>
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
      <div className="mb-8 pt-2">
        <div
          className="relative overflow-hidden rounded-[28px] px-6 py-7 text-center text-white shadow-[0_14px_40px_rgba(138,21,56,0.25)]"
          dir="rtl"
          style={{
            background: "linear-gradient(120deg, #6E1029 0%, #8A1538 55%, #A91D45 100%)",
          }}
        >
          {/* زخرفة دوائر ناعمة */}
          <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-12 -right-8 w-44 h-44 rounded-full bg-white/10 blur-xl" />
          <div className="relative">
            <div className="inline-block w-12 h-1 rounded-full bg-white/70 mb-3" />
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{title}</h1>
            <p className="text-sm sm:text-base text-white/85 max-w-2xl mx-auto line-clamp-2">
              {description}
            </p>
          </div>
        </div>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 justify-items-center max-w-[800px] mx-auto">
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
    <div className="w-full min-h-screen bg-[#FAF7F2]">
      <div
        className="sticky top-0 md:top-16 left-0 right-0 flex items-center justify-between gap-2 no-reverse p-3 bg-[#FAF7F2]/95 shadow-md z-40 backdrop-blur-sm"
        dir="rtl"
      >
        {/* الرئيسية — يمين */}
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="bg-white hover:bg-[#8A1538]/20 flex items-center gap-2 no-reverse font-bold text-black hover:text-black"
        >
          <Home className="h-4 w-4 text-black" />
          <span className="inline-block">الرئيسية</span>
        </Button>

        <div className="flex-1" />

        {/* رجوع — يسار */}
        <Button
          onClick={handleBack}
          variant="outline"
          className="bg-white hover:bg-[#8A1538]/20 flex items-center gap-2 no-reverse font-bold text-black hover:text-black"
        >
          <span className="inline-block">رجوع</span>
          <ArrowRight className="h-4 w-4 text-black" />
        </Button>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 p-4">
        {renderBreadcrumb()}
        {renderHeader()}

        {showContentTypes && selectedSubcategory?.selectedContentType ? (
          <Tabs
            defaultValue="all"
            className="w-full"
            dir="rtl"
            onValueChange={setActiveTab}
          >
            <TabsList className="max-w-md mb-8 justify-start">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="recent">الأحدث</TabsTrigger>
              <TabsTrigger value="favorites">المفضلة</TabsTrigger>
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
