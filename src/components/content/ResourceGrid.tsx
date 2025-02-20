import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Resource {
  id: string;
  title: string;
  type: "image" | "file" | "video" | "talent";
  thumbnail: string;
  downloadUrl: string;
}

interface ResourceGridProps {
  resources?: Resource[];
  onPreview?: (resource: Resource) => void;
  onDownload?: (resource: Resource) => void;
}

const defaultResources: Resource[] = [
  // صور
  {
    id: "1",
    title: "تمارين الإحماء الأساسية",
    type: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&h=200&fit=crop",
    downloadUrl: "#",
  },
  {
    id: "2",
    title: "تدريبات كرة القدم",
    type: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&h=200&fit=crop",
    downloadUrl: "#",
  },
  // ملفات
  {
    id: "3",
    title: "خطة التدريب الأسبوعية",
    type: "file",
    thumbnail:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=300&h=200&fit=crop",
    downloadUrl: "#",
  },
  {
    id: "4",
    title: "دليل المعلم للتربية البدنية",
    type: "file",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
    downloadUrl: "#",
  },
  // فيديوهات
  {
    id: "5",
    title: "شرح مهارات كرة السلة",
    type: "video",
    thumbnail:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop",
    downloadUrl: "#",
  },
  {
    id: "6",
    title: "تمارين اللياقة البدنية",
    type: "video",
    thumbnail:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop",
    downloadUrl: "#",
  },
];

const ResourceGrid = ({
  resources = defaultResources,
  onPreview = () => {},
  onDownload = () => {},
}: ResourceGridProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm"
          >
            <div className="relative aspect-video">
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
              {resource.type === "video" && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              )}
              {resource.type === "file" && (
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium">
                  PDF
                </div>
              )}
            </div>
            <CardContent className="p-4 text-right">
              <h3 className="font-semibold mb-4 text-lg">{resource.title}</h3>
              <div className="flex justify-between items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPreview(resource)}
                      >
                        <img
                          src="https://api.iconify.design/fluent-emoji-flat/eyes.svg"
                          alt="معاينة"
                          className="h-5 w-5"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>معاينة</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDownload(resource)}
                      >
                        <img
                          src="https://api.iconify.design/fluent-emoji-flat/inbox-tray.svg"
                          alt="تحميل"
                          className="h-5 w-5"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>تحميل</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { ResourceGrid };
