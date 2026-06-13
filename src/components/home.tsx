import React from "react";
import ContentDiscovery from "./content/ContentDiscovery";
import StageNavigation from "./navigation/StageNavigation";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-10">
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
    </div>
  );
};

export default Home;
