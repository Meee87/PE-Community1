import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/lib/supabase";
import { sendPushNotification } from "@/lib/notifications";
import { getAdminIds } from "@/lib/admin";

const Contact = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: "",
  });
  const [info, setInfo] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    supabase
      .from("site_settings")
      .select("key,value")
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data || []).forEach((r: any) => (map[r.key] = r.value));
        setInfo(map);
      });
  }, []);

  const validateForm = () => {
    // Validate name
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "خطأ في الإدخال",
        description: "يرجى إدخال الاسم الكامل",
      });
      return false;
    }

    // Validate email with proper regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال بريد إلكتروني صحيح",
      });
      return false;
    }

    // Validate message length
    if (!formData.message.trim() || formData.message.length < 10) {
      toast({
        variant: "destructive",
        title: "خطأ في الرسالة",
        description: "يرجى كتابة رسالة لا تقل عن 10 أحرف",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSending(true);
    try {
      // Insert message
      const { error: insertError } = await supabase.from("messages").insert([
        {
          message: formData.message,
          subject: "رسالة جديدة من نموذج الاتصال",
          sender_name: formData.name,
          sender_email: formData.email,
          is_read: false,
        },
      ]);

      // Notify all admins
      const adminIds = await getAdminIds();
      if (adminIds.length) {
        await supabase.from("notifications").insert(
          adminIds.map((id) => ({
            user_id: id,
            title: "رسالة جديدة",
            message: `رسالة جديدة من ${formData.name}`,
            type: "message",
          })),
        );

        // Send push notification
        await sendPushNotification(
          "رسالة جديدة",
          `رسالة جديدة من ${formData.name}`,
          { type: "message" },
        );
      }

      if (insertError) {
        console.error("Error details:", insertError);
        if (insertError.code === "23502") {
          // Not null violation
          throw new Error("يرجى تعبئة جميع الحقول المطلوبة");
        } else if (insertError.code === "23505") {
          // Unique violation
          throw new Error("تم إرسال هذه الرسالة مسبقاً");
        } else if (insertError.code === "42501") {
          // Permission denied
          throw new Error("عذراً، لا يمكنك إرسال رسائل في الوقت الحالي");
        } else {
          console.error("Detailed error:", insertError);
          throw new Error(
            "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى",
          );
        }
      }

      // Show success message
      toast({
        title: "تم الإرسال بنجاح",
        description: "سيتم الرد على رسالتك في أقرب وقت ممكن",
      });

      // Reset form and close dialog
      setFormData({ name: "", email: "", message: "" });
      setIsDialogOpen(false);
      setIsSending(false);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "خطأ في الإرسال",
        description:
          error.message ||
          "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full">
      <CardContent className="grid gap-6">
        {info.contact_intro && (
          <p className="text-center text-gray-600">{info.contact_intro}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={`mailto:${info.contact_email || "contact@pecommunity.com"}`}
            className="flex items-center gap-3 p-4 rounded-xl bg-[#8A1538]/5 hover:bg-[#8A1538]/10 transition-colors"
          >
            <Mail className="h-6 w-6 text-[#8A1538]" />
            <div>
              <h3 className="font-semibold">البريد الإلكتروني</h3>
              <p className="text-sm text-gray-600" dir="ltr">
                {info.contact_email || "contact@pecommunity.com"}
              </p>
            </div>
          </a>

          <a
            href={`tel:${(info.contact_phone || "").replace(/\s/g, "")}`}
            className="flex items-center gap-3 p-4 rounded-xl bg-[#8A1538]/5 hover:bg-[#8A1538]/10 transition-colors"
          >
            <Phone className="h-6 w-6 text-[#8A1538]" />
            <div>
              <h3 className="font-semibold">رقم الهاتف</h3>
              <p className="text-sm text-gray-600" dir="ltr">
                {info.contact_phone || "—"}
              </p>
            </div>
          </a>

          {info.contact_whatsapp && (
            <a
              href={`https://wa.me/${info.contact_whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-[#8A1538]/5 hover:bg-[#8A1538]/10 transition-colors"
            >
              <MessageCircle className="h-6 w-6 text-[#8A1538]" />
              <div>
                <h3 className="font-semibold">واتساب</h3>
                <p className="text-sm text-gray-600" dir="ltr">
                  {info.contact_whatsapp}
                </p>
              </div>
            </a>
          )}

          {info.contact_address && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#8A1538]/5">
              <MapPin className="h-6 w-6 text-[#8A1538]" />
              <div>
                <h3 className="font-semibold">العنوان</h3>
                <p className="text-sm text-gray-600">{info.contact_address}</p>
              </div>
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#A91D45] hover:bg-[#A91D45]">
              <MessageCircle className="mr-2 h-4 w-4" />
              تحدث مع المسؤولين
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>رسالة جديدة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="الاسم الكامل"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="focus:border-[#A91D45]"
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="البريد الإلكتروني"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="focus:border-[#A91D45]"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="نص الرسالة (10 أحرف على الأقل)"
                  className="min-h-[100px] focus:border-[#A91D45]"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSending}
                className="w-full bg-[#A91D45] hover:bg-[#A91D45] transition-all duration-200"
              >
                {isSending ? "جاري الإرسال..." : "إرسال الرسالة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </div>
  );
};

export default Contact;
