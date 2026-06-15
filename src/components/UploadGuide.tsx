import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  FolderTree,
  UploadCloud,
  CheckCircle2,
  Image as ImageIcon,
  Video,
  FileText,
  Star,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";

const STEPS = [
  {
    Icon: LogIn,
    title: "سجّل الدخول واختر المرحلة",
    desc: "ادخل بحسابك، ثم من الصفحة الرئيسية اختر المرحلة التعليمية المناسبة: الابتدائية أو الإعدادية أو الثانوية.",
  },
  {
    Icon: FolderTree,
    title: "ادخل القسم والتصنيف الفرعي",
    desc: "تنقّل داخل المرحلة إلى القسم ثم التصنيف الفرعي الذي ينتمي إليه المحتوى (مثال: المهارات الحركية ← الألعاب التعليمية).",
  },
  {
    Icon: UploadCloud,
    title: "اختر نوع المحتوى وارفعه",
    desc: "اختر النوع (صور / فيديو / ملفات / مواهب)، ثم اضغط زر «رفع محتوى» الموجود داخل القسم، واملأ العنوان والوصف وارفع الملف أو ضع رابطًا.",
  },
  {
    Icon: CheckCircle2,
    title: "المراجعة والنشر",
    desc: "إن كنت معلّمًا يُرسَل طلبك للمشرف لمراجعته، وبعد الاعتماد يظهر المحتوى للجميع. المشرفون يرفعون المحتوى مباشرةً دون مراجعة.",
  },
];

const TYPES = [
  { Icon: ImageIcon, label: "صور", hint: "JPG / PNG — صور توضيحية للمهارات والأنشطة." },
  { Icon: Video, label: "فيديو", hint: "MP4 أو رابط — مقاطع شرح وتمارين (الطولي والعرضي مدعوم)." },
  { Icon: FileText, label: "ملفات", hint: "PDF — خطط دروس، أوراق عمل، مراجع." },
  { Icon: Star, label: "مواهب", hint: "إبراز إنجازات ومواهب الطلاب الرياضية." },
];

const TIPS = [
  "اكتب عنوانًا واضحًا ووصفًا مختصرًا يسهّل البحث عن المحتوى.",
  "تأكد أن المحتوى مناسب ومحتشم وملائم للفئة العمرية للمرحلة.",
  "للفيديو الطويل يُفضّل وضع رابط بدل رفع ملف كبير.",
  "ارفع المحتوى في القسم والتصنيف الصحيح حتى يصل لمن يبحث عنه.",
];

const UploadGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF7F2]" dir="rtl">
      {/* رأس الصفحة */}
      <div
        className="relative overflow-hidden text-white px-4 py-12 text-center"
        style={{
          background:
            "linear-gradient(125deg, #6E1029 0%, #8A1538 55%, #A91D45 100%)",
        }}
      >
        <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            آلية رفع المحتوى
          </h1>
          <p className="text-white/85 max-w-2xl mx-auto">
            دليل واضح خطوة بخطوة لإضافة مساهماتك التعليمية إلى المنصة بسهولة.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">
        {/* الخطوات */}
        <section>
          <h2 className="text-2xl font-bold text-[#8A1538] mb-8 text-center">
            الخطوات بالتفصيل
          </h2>
          <div className="space-y-5">
            {STEPS.map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 ring-1 ring-black/5 shadow-sm no-reverse"
              >
                <div
                  className="relative shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-b from-[#A91D45] to-[#6E1029]"
                  style={{
                    boxShadow:
                      "inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.3), 0 8px 16px -4px rgba(138,21,56,0.45)",
                  }}
                >
                  <span className="pointer-events-none absolute inset-x-2 top-1.5 h-1/3 rounded-full bg-white/25 blur-[2px]" />
                  <Icon className="relative w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 no-reverse">
                    <span className="text-[#8A1538] font-extrabold">
                      {i + 1}.
                    </span>
                    <h3 className="font-bold text-gray-900">{title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* أنواع المحتوى */}
        <section>
          <h2 className="text-2xl font-bold text-[#8A1538] mb-8 text-center">
            أنواع المحتوى المدعومة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TYPES.map(({ Icon, label, hint }, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 ring-1 ring-black/5 no-reverse"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#8A1538]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#8A1538]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{label}</h3>
                  <p className="text-sm text-gray-500">{hint}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* نصائح */}
        <section>
          <div className="bg-[#8A1538]/[0.04] border border-[#8A1538]/15 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4 no-reverse">
              <Lightbulb className="w-5 h-5 text-[#8A1538]" />
              <h2 className="text-xl font-bold text-[#8A1538]">نصائح مهمة</h2>
            </div>
            <ul className="space-y-2.5">
              {TIPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2 no-reverse">
                  <CheckCircle2 className="w-5 h-5 text-[#8A1538] shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* زر البدء */}
        <div className="text-center">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 bg-[#8A1538] hover:bg-[#6E1029] text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-[#8A1538]/20 transition-colors no-reverse"
          >
            ابدأ الآن واختر مرحلتك
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadGuide;
