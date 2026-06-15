import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  FolderTree,
  UploadCloud,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const STEPS = [
  {
    Icon: LogIn,
    title: "سجّل الدخول واختر المرحلة",
    desc: "ادخل بحسابك ثم اختر المرحلة التعليمية المناسبة (ابتدائي / إعدادي / ثانوي).",
  },
  {
    Icon: FolderTree,
    title: "ادخل القسم والتصنيف",
    desc: "تنقّل إلى القسم والتصنيف الفرعي الذي يناسب المحتوى الذي تريد إضافته.",
  },
  {
    Icon: UploadCloud,
    title: "ارفع المحتوى",
    desc: "اضغط «طلب إضافة محتوى»، واملأ العنوان والوصف وارفع الملف أو الرابط.",
  },
  {
    Icon: CheckCircle2,
    title: "المراجعة والنشر",
    desc: "يراجع المشرف الطلب، وبعد الاعتماد يظهر المحتوى للجميع على المنصة.",
  },
];

const HowToUpload = () => {
  const navigate = useNavigate();
  return (
    <section className="py-12 sm:py-16 bg-white" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#8A1538]">
          كيفية رفع المحتوى
        </h2>
        <p className="text-center text-gray-500 mb-3">
          أضف مساهمتك للمنصة في أربع خطوات بسيطة
        </p>
        <div className="w-16 h-1 bg-[#8A1538] rounded-full mx-auto mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {STEPS.map(({ Icon, title, desc }, i) => (
            <div
              key={i}
              className="group relative bg-[#FAF7F2] rounded-2xl p-6 text-center ring-1 ring-black/5 hover:ring-[#8A1538]/20 hover:shadow-[0_14px_30px_rgba(138,21,56,0.10)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* رقم الخطوة */}
              <span className="absolute top-4 right-4 text-5xl font-extrabold text-[#8A1538]/10 leading-none select-none">
                {i + 1}
              </span>

              {/* أيقونة مجسّمة */}
              <div
                className="relative mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-b from-[#A91D45] to-[#6E1029]"
                style={{
                  boxShadow:
                    "inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.3), 0 8px 16px -4px rgba(138,21,56,0.45)",
                }}
              >
                <span className="pointer-events-none absolute inset-x-2 top-1.5 h-1/3 rounded-full bg-white/25 blur-[2px]" />
                <Icon
                  className="relative w-7 h-7 text-white"
                  strokeWidth={2}
                  style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.4))" }}
                />
              </div>

              <h3 className="font-bold text-[#8A1538] mb-1.5">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/upload-guide")}
            className="inline-flex items-center gap-2 text-[#8A1538] font-bold border-2 border-[#8A1538]/30 hover:bg-[#8A1538] hover:text-white px-6 py-2.5 rounded-xl transition-colors no-reverse"
          >
            اعرف التفاصيل الكاملة
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowToUpload;
