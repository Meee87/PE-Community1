import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const ResourceGrid = ({
  resources = [],
  onPreview = () => {},
  onDownload = () => {},
}: ResourceGridProps) => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );

  const renderPreviewContent = (resource: Resource) => {
    switch (resource.type) {
      case "image":
        return (
          <img
            src={resource.downloadUrl}
            alt={resource.title}
            className="w-full h-full object-contain rounded-lg max-h-[70vh]"
          />
        );
      case "video":
        return (
          <div className="aspect-video w-full">
            <iframe
              src={resource.downloadUrl}
              title={resource.title}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        );
      case "file":
        return (
          <object
            data={resource.downloadUrl}
            type="application/pdf"
            className="w-full h-[70vh] rounded-lg"
          >
            <div className="text-center py-8">
              <p className="mb-4">لا يمكن عرض الملف مباشرة</p>
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = resource.downloadUrl;
                  link.download = resource.title;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-[#748d19] hover:bg-[#647917]"
              >
                تحميل الملف
              </Button>
            </div>
          </object>
        );
      default:
        return <div>غير متوفر</div>;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm"
          >
            <div
              className="relative aspect-video cursor-pointer"
              onClick={() => {
                setSelectedResource(resource);
                onPreview(resource);
              }}
            >
              {resource.type === "image" ? (
                <img
                  src={resource.downloadUrl}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/600x400?text=Error+Loading+Image";
                  }}
                  loading="lazy"
                />
              ) : resource.type === "video" ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-500">معاينة غير متوفرة</div>
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
                        onClick={() => {
                          setSelectedResource(resource);
                          onPreview(resource);
                        }}
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
                        onClick={() => {
                          onDownload(resource);
                          const link = document.createElement("a");
                          link.href = resource.downloadUrl;
                          link.download = resource.title;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
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

      <Dialog
        open={!!selectedResource}
        onOpenChange={() => setSelectedResource(null)}
      >
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedResource && renderPreviewContent(selectedResource)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { ResourceGrid };
