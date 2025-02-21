import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/lib/admin";
import { useNavigate } from "react-router-dom";
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
}

type ContentType = "image" | "video" | "file" | "talent";

export default function ContentUploadDialog({
  stageId,
  categoryId,
  isAdmin = false,
}: ContentUploadDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    type: "image" as ContentType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For non-admin users, require external URL
    if (!isAdmin && !formData.url) {
      toast({
        variant: "destructive",
        description: "يرجى إدخال رابط خارجي",
      });
      return;
    }

    // For admin users, either URL or file should be present
    if (isAdmin && !formData.url) {
      toast({
        variant: "destructive",
        description: "يرجى رفع ملف أو إدخال رابط خارجي",
      });
      return;
    }
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (isAdmin) {
        // Direct content upload for admin
        console.log("Uploading content:", {
          ...formData,
          stage_id: stageId,
          category_id: categoryId,
          created_by: user.id,
        });
        const { error } = await supabase.from("content").insert([
          {
            ...formData,
            stage_id: stageId,
            category_id: categoryId,
            created_by: user.id,
          },
        ]);

        if (error) {
          console.error("Upload error:", error);
          throw error;
        }

        // Refresh the content list
        window.dispatchEvent(new CustomEvent("content-updated"));

        if (error) throw error;

        toast({
          description: "تم رفع المحتوى بنجاح",
        });
      } else {
        // Content request for regular users
        const { error } = await supabase.from("content_requests").insert([
          {
            ...formData,
            stage_id: stageId,
            category_id: categoryId,
            status: "pending",
            user_id: user.id,
          },
        ]);

        if (error) throw error;

        toast({
          description: "تم إرسال طلب إضافة المحتوى بنجاح",
        });
      }

      setFormData({
        title: "",
        description: "",
        url: "",
        type: "image",
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء رفع المحتوى",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${stageId}/${categoryId}/${fileName}`;

      console.log("Starting file upload:", { filePath, fileSize: file.size });

      // Upload file to storage
      const { error: uploadError, data } = await supabase.storage
        .from("content")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      console.log("File uploaded successfully:", data);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("content").getPublicUrl(filePath);

      console.log("Generated public URL:", publicUrl);

      // Update form data with the file URL
      setFormData((prev) => ({
        ...prev,
        url: publicUrl,
      }));

      toast({
        description: "تم رفع الملف بنجاح",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء رفع الملف",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#7C9D32] hover:bg-[#7C9D32]/90">
          {isAdmin ? "رفع محتوى" : "طلب إضافة محتوى"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>
            {isAdmin ? "رفع محتوى جديد" : "طلب إضافة محتوى جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Select
              value={formData.type}
              onValueChange={(value: ContentType) =>
                setFormData({ ...formData, type: value })
              }
              className="bg-white"
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="نوع المحتوى" />
              </SelectTrigger>
              <SelectContent className="bg-white">
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
              className="bg-white"
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
              className="bg-white"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            {isAdmin ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>رفع ملف</Label>
                  <Input
                    type="file"
                    className="bg-white"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                </div>
                <div className="my-2 text-center text-sm text-gray-500">أو</div>
                <div className="space-y-2">
                  <Label>رابط خارجي</Label>
                  <Input
                    placeholder="رابط المحتوى"
                    className="bg-white"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                </div>
              </div>
            ) : (
              <Input
                placeholder="رابط المحتوى"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                required
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#7C9D32] hover:bg-[#7C9D32]/90"
            disabled={loading}
          >
            {loading
              ? "جاري الإرسال..."
              : isAdmin
                ? "رفع المحتوى"
                : "إرسال الطلب"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
