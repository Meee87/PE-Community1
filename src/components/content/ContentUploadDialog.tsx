import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Image, Video, FileText, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContentUploadDialogProps {
  stageId: string;
  categoryId: string;
  isAdmin?: boolean;
  className?: string;
  contentType: string;
  variant?: "outline" | "default";
  showIcon?: boolean;
  label?: string;
}

type ContentType = "image" | "video" | "file" | "talent";

export default function ContentUploadDialog({
  stageId,
  categoryId,
  isAdmin = false,
  className = "",
  contentType,
  variant = "default",
  showIcon = false,
}: ContentUploadDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    url: "",
    type: contentType as ContentType,
    file: null as File | null,
  });

  const getContentTypeIcon = () => {
    switch (contentType) {
      case "image":
        return <Image className="h-4 w-4 ml-2" />;
      case "video":
        return <Video className="h-4 w-4 ml-2" />;
      case "file":
        return <FileText className="h-4 w-4 ml-2" />;
      case "talent":
        return <Star className="h-4 w-4 ml-2" />;
      default:
        return null;
    }
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case "image":
        return "الصور";
      case "video":
        return "الفيديوهات";
      case "file":
        return "الملفات";
      case "talent":
        return "الموهوبين";
      default:
        return "رفع محتوى";
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${stageId}/${categoryId}/${fileName}`;

      console.log("Uploading file to:", filePath);

      const { error: uploadError } = await supabase.storage
        .from("content")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("content").getPublicUrl(filePath);

      console.log("File uploaded successfully, URL:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          description: "يجب تسجيل الدخول أولاً",
        });
        return;
      }

      let url = formData.url;

      // If there's a file, upload it first
      if (formData.file) {
        console.log("Uploading file...");
        url = await handleFileUpload(formData.file);
        console.log("File uploaded successfully, URL:", url);
      }

      if (!url && !formData.file) {
        toast({
          variant: "destructive",
          description: "يجب إدخال رابط أو رفع ملف",
        });
        return;
      }

      if (isAdmin) {
        console.log("Creating content as admin...");
        const { error } = await supabase.from("content").insert([
          {
            title: formData.title,
            description: formData.description,
            url,
            type: formData.type,
            stage_id: stageId,
            category_id: categoryId,
            created_by: user.id,
          },
        ]);

        if (error) throw error;

        console.log("Content created successfully");
        window.dispatchEvent(new CustomEvent("content-updated"));
        toast({ description: "تم رفع المحتوى بنجاح" });
      } else {
        console.log("Creating content request...");
        // Get admin user
        const { data: adminData, error: adminError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", "eng.mohamed87@live.com")
          .single();

        if (adminError) {
          console.error("Error getting admin:", adminError);
          throw adminError;
        }

        if (!adminData?.id) {
          console.error("Admin not found");
          throw new Error("حدث خطأ في إرسال الطلب");
        }

        const { error } = await supabase.from("content_requests").insert([
          {
            title: formData.title,
            description: formData.description,
            url,
            type: formData.type,
            stage_id: stageId,
            category_id: categoryId,
            status: "pending",
            user_id: user.id,
            admin_id: adminData.id,
          },
        ]);

        if (error) throw error;

        console.log("Content request created successfully");
        toast({ description: "تم إرسال طلب إضافة المحتوى بنجاح" });
      }

      setFormData({
        title: "",
        description: "",
        url: "",
        type: contentType as ContentType,
        file: null,
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        description: error.message || "حدث خطأ أثناء إرسال الطلب",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={className}
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          {showIcon && getContentTypeIcon()}
          {getContentTypeLabel()}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-white w-[90vw] max-w-[425px]"
        dir="rtl"
        aria-describedby="dialog-description"
      >
        <p
          id="dialog-description"
          className="text-gray-600 text-sm text-center mb-4"
        >
          {isAdmin
            ? `قم برفع ${getContentTypeLabel()} جديدة مباشرة إلى المنصة`
            : `قم بإرسال طلب إضافة ${getContentTypeLabel()} جديدة للمراجعة من قبل المشرفين`}
        </p>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isAdmin
              ? `رفع ${getContentTypeLabel()} جديدة`
              : `طلب إضافة ${getContentTypeLabel()} جديدة`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="عنوان المحتوى"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="h-12 border-2"
            disabled={loading}
          />

          <Textarea
            placeholder="وصف المحتوى"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            className="min-h-[100px] border-2"
            disabled={loading}
          />

          <div className="space-y-2">
            <p className="text-right font-medium">رفع ملف</p>
            <div className="relative">
              <input
                id="file-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, file });
                  }
                }}
                accept={
                  contentType === "image"
                    ? "image/*"
                    : contentType === "video"
                      ? "video/*"
                      : "*"
                }
                className="w-full h-12 border-2 rounded-md px-3 py-2"
                disabled={loading}
              />
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">أو</div>

          <div className="space-y-2">
            <p className="text-right font-medium">رابط خارجي</p>
            <Input
              placeholder="رابط المحتوى"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              className="h-12 border-2"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-medium bg-[#95B846] hover:bg-[#95B846]/90"
            disabled={loading}
          >
            {loading
              ? "جاري الإرسال..."
              : isAdmin
                ? `رفع ${getContentTypeLabel()}`
                : `إرسال الطلب`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
