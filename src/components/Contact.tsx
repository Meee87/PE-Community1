import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-white p-6 rounded-lg space-y-8">
      {/* Contact Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#7C9D32]/5 p-4 rounded-lg">
        <div className="flex items-center gap-3 text-gray-700">
          <Mail className="h-5 w-5 text-[#7C9D32]" />
          <a
            href="mailto:info@pecommunity.com"
            className="hover:text-[#7C9D32] transition-colors"
          >
            info@pecommunity.com
          </a>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Phone className="h-5 w-5 text-[#7C9D32]" />
          <a
            href="tel:+966500000000"
            className="hover:text-[#7C9D32] transition-colors"
            dir="ltr"
          >
            +966 50 000 0000
          </a>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <MapPin className="h-5 w-5 text-[#7C9D32]" />
          <span>الرياض، المملكة العربية السعودية</span>
        </div>
      </div>

      {/* Contact Form */}
      <form className="space-y-4">
        <div>
          <Input
            placeholder="الاسم الكامل"
            className="text-right bg-gray-50 border-gray-200 focus:border-[#7C9D32] focus:ring-[#7C9D32]"
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="البريد الإلكتروني"
            className="text-right bg-gray-50 border-gray-200 focus:border-[#7C9D32] focus:ring-[#7C9D32]"
            dir="ltr"
          />
        </div>
        <div>
          <Textarea
            placeholder="الرسالة"
            className="min-h-[100px] text-right bg-gray-50 border-gray-200 focus:border-[#7C9D32] focus:ring-[#7C9D32]"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#7C9D32] hover:bg-[#7C9D32]/90 text-white"
        >
          إرسال
        </Button>
      </form>
    </div>
  );
};

export default Contact;
