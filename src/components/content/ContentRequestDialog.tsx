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

export default function ContentRequestDialog({
  stageId,
  categoryId,
}: ContentRequestDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    url: "",
    type: "image" as ContentType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("يجب تسجيل الدخول أولاً");

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
        description: error.message || "حدث خطأ أثناء إرسال الطلب",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#7C9D32] hover:bg-[#7C9D32]/90">
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
              onValueChange={(value: "image" | "video" | "file" | "talent") =>
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

          <div className="space-y-2">
            <Input
              placeholder="رابط المحتوى"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              required
            />
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
