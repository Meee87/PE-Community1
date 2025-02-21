import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, Phone, MessageCircle } from "lucide-react";
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

import { supabase } from "@/lib/supabase";

const Contact = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setIsSending(true);
    try {
      // Get admin user
      const { data: adminData } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", "eng.mohamed87@live.com")
        .single();

      if (!adminData?.id) throw new Error("Admin not found");

      // Insert message
      const { error } = await supabase.from("messages").insert({
        content: formData.message,
        sender_name: formData.name,
        sender_email: formData.email,
        admin_id: adminData.id,
      });

      if (error) throw error;

      // Show success message
      setShowSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setShowSuccess(false);
        setIsDialogOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl mx-auto bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-center">اتصل بنا</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
            <Mail className="h-6 w-6 text-[#95B846]" />
            <div>
              <h3 className="font-semibold">البريد الإلكتروني</h3>
              <p className="text-sm text-gray-600">contact@pecommunity.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
            <Phone className="h-6 w-6 text-[#95B846]" />
            <div>
              <h3 className="font-semibold">رقم الهاتف</h3>
              <p className="text-sm text-gray-600">+966 12 345 6789</p>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#95B846] hover:bg-[#86a73d]">
              <MessageCircle className="mr-2 h-4 w-4" />
              تحدث مع المسؤولين
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>رسالة جديدة</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="الاسم"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <Input
                placeholder="البريد الإلكتروني"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
              <Textarea
                placeholder="الرسالة"
                className="min-h-[100px]"
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                required
              />
              {showSuccess ? (
                <div className="text-center py-4 text-green-600">
                  تم إرسال رسالتك بنجاح! سيتم الرد عليك قريباً
                </div>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSending}
                  className="w-full"
                >
                  {isSending ? "جاري الإرسال..." : "إرسال"}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Contact;
