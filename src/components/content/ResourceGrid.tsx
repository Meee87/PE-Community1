import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  isAdmin?: boolean;
  onDelete?: (resource: Resource) => void;
}

const ResourceGrid = ({
  resources = [],
  onPreview = () => {},
  onDownload = () => {},
  isAdmin = false,
  onDelete,
}: ResourceGridProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(
    null,
  );

  const handleDelete = async (resource: Resource) => {
    try {
      console.log("🔴 التحقق من صلاحيات الأدمن...");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, email")
        .eq("id", user.id)
        .single();

      if (
        profile?.role !== "admin" &&
        profile?.email !== "eng.mohamed87@live.com"
      ) {
        toast({
          variant: "destructive",
          description: "غير مصرح لك بحذف المحتوى",
        });
        return;
      }

      console.log("🔴 البدء في حذف جميع السجلات التي تحتوي على نفس URL...");

      // حذف الصورة من التخزين إذا كانت من `Supabase Storage`
      if (resource.downloadUrl.includes("/storage/v1/object/public/")) {
        try {
          const urlObject = new URL(resource.downloadUrl);
          const pathSegments = urlObject.pathname.split("/");

          const bucketName = pathSegments[4];
          const filePath = pathSegments.slice(5).join("/");

          console.log("🗑️ حذف الملف من التخزين:", { bucketName, filePath });

          const { error: storageError } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

          if (storageError) {
            console.error("❌ Error deleting from storage:", storageError);
            throw storageError;
          }

          console.log("✅ تم حذف الملف من التخزين");
        } catch (error) {
          console.error("❌ Error deleting from storage:", error);
          // Continue with DB deletion even if storage deletion fails
        }
      }

      // حذف جميع السجلات من `content`
      const { error: contentError } = await supabase
        .from("content")
        .delete()
        .eq("url", resource.downloadUrl);

      if (contentError) {
        console.error("❌ Error deleting from content:", contentError);
        throw contentError;
      }

      console.log("✅ تم حذف السجلات من content");

      // حذف جميع السجلات من `content_requests`
      const { error: requestError } = await supabase
        .from("content_requests")
        .delete()
        .eq("url", resource.downloadUrl);

      if (requestError) {
        console.error("❌ Error deleting from content_requests:", requestError);
        throw requestError;
      }

      console.log("✅ تم حذف السجلات من content_requests");

      console.log("✅ تم حذف المحتوى بنجاح من جميع الجداول والتخزين.");

      toast({
        description: "تم حذف المحتوى بنجاح",
      });

      // تحديث المحتوى في الواجهة
      window.dispatchEvent(new CustomEvent("content-updated"));

      // استدعاء `onDelete` لتحديث الواجهة
      onDelete?.(resource);
    } catch (error) {
      console.error("❌ خطأ أثناء حذف المورد:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء حذف المحتوى",
      });
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
              className="relative aspect-square sm:aspect-video cursor-pointer overflow-hidden rounded-t-lg bg-gray-50"
              onClick={() => onPreview(resource)}
            >
              {resource.type === "image" ? (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <img
                    src={resource.downloadUrl}
                    alt={resource.title}
                    className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300 rounded-lg shadow-sm"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400?text=Error+Loading+Image";
                    }}
                  />
                </div>
              ) : resource.type === "video" ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-500 flex flex-col items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="text-sm">معاينة غير متوفرة</span>
                  </div>
                </div>
              )}
              {resource.type === "file" && (
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium shadow-sm">
                  PDF
                </div>
              )}
            </div>
            <CardContent className="p-4 text-right">
              <h3 className="font-semibold mb-4 text-lg">{resource.title}</h3>
              <div className="flex justify-between items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(resource.downloadUrl, "_blank");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(resource);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </Button>
                {isAdmin && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-600 hover:bg-red-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setResourceToDelete(resource);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>حذف</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد من حذف هذا المحتوى؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المحتوى نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (resourceToDelete) {
                  handleDelete(resourceToDelete);
                  setDeleteDialogOpen(false);
                }
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { ResourceGrid };
