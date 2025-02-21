import React from "react";
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
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    url: "",
    type: "image" as ContentType,
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      const isAdminUser = await checkIsAdmin();
      if (isAdminUser !== isAdmin) {
        // Update isAdmin prop if it doesn't match actual status
        setIsAdmin(isAdminUser);
      }
    };
    checkAdminStatus();
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAdmin) {
        // Direct content upload for admin
        const { error } = await supabase.from("content").insert([
          {
            ...formData,
            stage_id: stageId,
            category_id: categoryId,
            created_by: (await supabase.auth.getUser()).data.user?.id,
          },
        ]);

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
            user_id: (await supabase.auth.getUser()).data.user?.id,
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
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${stageId}/${categoryId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("content")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("content").getPublicUrl(filePath);

      setFormData({ ...formData, url: publicUrl });

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
      <DialogContent>
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
            >
              <SelectTrigger>
                <SelectValue placeholder="نوع المحتوى" />
              </SelectTrigger>
              <SelectContent>
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

          <div className="space-y-2">
            {isAdmin ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>رفع ملف</Label>
                  <Input
                    type="file"
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
