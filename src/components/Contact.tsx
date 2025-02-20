import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <div className="bg-gray-900 p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        اتصل بنا
      </h2>
      <form className="space-y-4">
        <div>
          <Input
            placeholder="الاسم الكامل"
            className="text-right bg-white/10 border-0 text-white placeholder:text-white/70"
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="البريد الإلكتروني"
            className="text-right bg-white/10 border-0 text-white placeholder:text-white/70"
            dir="ltr"
          />
        </div>
        <div>
          <Textarea
            placeholder="الرسالة"
            className="min-h-[100px] text-right bg-white/10 border-0 text-white placeholder:text-white/70"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-white hover:bg-white/90 text-gray-900"
        >
          إرسال
        </Button>
      </form>
    </div>
  );
};

export default Contact;
