import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
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

interface ContentRequestDialogProps {
  stageId: string;
  categoryId: string;
}

type ContentType = "image" | "video" | "file" | "talent";

import { useNavigate } from "react-router-dom";

export default function ContentRequestDialog({
  stageId,
  categoryId,
}: ContentRequestDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    title: string;
    description: string;
    url: string;
    type: ContentType;
    file?: File | null;
  }>({
    title: "",
    description: "",
    url: "",
    type: "image",
    file: null,
  });

  const handleFileUpload = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `requests/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("content")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("content").getPublicUrl(filePath);

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
        setLoading(false);
        return;
      }

      // Get admin user
      const { data: adminData } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", "eng.mohamed87@live.com")
        .single();

      if (!adminData?.id) {
        toast({
          variant: "destructive",
          description: "حدث خطأ في إرسال الطلب",
        });
        return;
      }

      let url = formData.url;

      // If there's a file, upload it first
      if (formData.file) {
        url = await handleFileUpload(formData.file);
      }

      const { error } = await supabase.from("content_requests").insert([
        {
          title: formData.title,
          description: formData.description,
          url: url,
          type: formData.type,
          stage_id: stageId,
          category_id: categoryId,
          status: "pending",
          user_id: user.id,
          admin_id: adminData.id,
        },
      ]);

      if (error) throw error;

      toast({
        description:
          "تم إرسال طلب إضافة المحتوى بنجاح وسيتم مراجعته من قبل المشرف",
      });

      setFormData({
        title: "",
        description: "",
        url: "",
        type: "image",
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
          className="bg-[#7C9D32] hover:bg-[#7C9D32]/90"
          onClick={(e) => {
            e.preventDefault();
            supabase.auth.getUser().then(({ data: { user } }) => {
              if (!user) {
                toast({
                  variant: "destructive",
                  description: "يجب تسجيل الدخول أولاً",
                });
                navigate("/login");
                return;
              }
              setOpen(true);
            });
          }}
        >
          طلب إضافة محتوى
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white" dir="rtl">
        <DialogHeader className="text-right mb-4">
          <DialogTitle>طلب إضافة محتوى جديد</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div className="space-y-2">
            <Select
              value={formData.type}
              onValueChange={(value: ContentType) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="text-right w-full">
                <SelectValue placeholder="نوع المحتوى" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="text-right w-full"
                align="end"
              >
                <SelectItem value="image">صورة</SelectItem>
                <SelectItem value="video">فيديو</SelectItem>
                <SelectItem value="file">ملف</SelectItem>
                <SelectItem value="talent">موهوب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="عنوان المحتوى"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="وصف المحتوى"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, file });
                  }
                }}
                accept={
                  formData.type === "image"
                    ? "image/*"
                    : formData.type === "video"
                      ? "video/*"
                      : "*"
                }
                className="bg-white"
              />
            </div>
            <div className="text-center text-sm text-gray-500">أو</div>
            <div className="space-y-2">
              <Input
                placeholder="رابط المحتوى"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="bg-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#7C9D32] hover:bg-[#7C9D32]/90"
            disabled={loading}
          >
            {loading ? "جاري الإرسال..." : "إرسال الطلب"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
