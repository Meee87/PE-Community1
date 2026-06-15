import React from "react";
import ContentDiscovery from "./content/ContentDiscovery";
import StageNavigation from "./navigation/StageNavigation";
import HowToUpload from "./HowToUpload";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-10">
      {/* واجهة ترحيبية بصورة + تدرّج عنّابي — نفس الشكل على كل الشاشات */}
      <section className="relative overflow-hidden bg-[#6E1029] h-[56vh] min-h-[360px] sm:h-[480px]">
        {/* الصورة خلفية تملا الهيرو */}
        <img
          src="/hero.jpg?v=2"
          alt="مجتمع التربية البدنية - قطر"
          className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
        />
        {/* تدرّج عنّابي للوضوح */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(110,16,41,0.95) 0%, rgba(138,21,56,0.80) 35%, rgba(138,21,56,0.45) 65%, rgba(138,21,56,0.25) 100%)",
          }}
        />
        {/* النص */}
        <div className="relative h-full flex flex-col items-center justify-end text-center text-white px-4 pb-10 sm:pb-12">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 ring-1 ring-white/30 backdrop-blur-sm">
              منصة وطنية متخصصة — دولة قطر
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight drop-shadow-lg">
              مجتمع معلّمي التربية البدنية
            </h1>
            <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto drop-shadow">
              مصادر وأنشطة ودروس تعليمية لكل المراحل — مكان واحد يجمع خبرات
              المعلّمين ويُثري حصة التربية الرياضية.
            </p>
          </div>
        </div>
      </section>

      {/* بحث + أحدث المحتوى */}
      <ContentDiscovery />

      {/* فاصل */}
      <div className="max-w-6xl mx-auto px-4 mt-12 mb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">تصفّح حسب المرحلة</h2>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </div>

      <StageNavigation />

      {/* كيفية رفع المحتوى */}
      <div className="mt-14">
        <HowToUpload />
      </div>
    </div>
  );
};

export default Home;
