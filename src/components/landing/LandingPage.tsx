import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MainHeader from "@/components/header/MainHeader";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=2669&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-6xl font-display mb-4 tracking-tight">
            PE COMMUNITY
          </h1>
          <h2 className="text-3xl mb-6">مجتمع التربية البدنية</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            منصة تعليمية متكاملة لمعلمي ومعلمات التربية البدنية، تجمع بين
            المحتوى التعليمي والتواصل المهني
          </p>
          <Button
            className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#7C9D32] font-bold text-lg px-8 py-6"
            size="lg"
            onClick={() => navigate("/home")}
          >
            ابدأ الآن
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#7C9D32] mb-12">
            مميزات المنصة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <div className="flex justify-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&auto=format&fit=crop"
                    alt="محتوى تعليمي"
                    className="w-32 h-32 object-cover rounded-full border-4 border-[#7C9D32]"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#7C9D32]">
                  محتوى تعليمي متكامل
                </h3>
                <p className="text-gray-600">
                  مكتبة شاملة تضم خطط الدروس، الأنشطة الرياضية، الفيديوهات
                  التعليمية، والتمارين العملية لجميع المراحل الدراسية
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <div className="flex justify-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop"
                    alt="مجتمع مهني"
                    className="w-32 h-32 object-cover rounded-full border-4 border-[#7C9D32]"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#7C9D32]">
                  مجتمع مهني نشط
                </h3>
                <p className="text-gray-600">
                  منصة تفاعلية للمعلمين لتبادل الخبرات، المناقشات المهنية، وورش
                  العمل الافتراضية، مع إمكانية التواصل المباشر مع الخبراء
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <div className="flex justify-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&auto=format&fit=crop"
                    alt="دعم الموهوبين"
                    className="w-32 h-32 object-cover rounded-full border-4 border-[#7C9D32]"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#7C9D32]">
                  برنامج رعاية الموهوبين
                </h3>
                <p className="text-gray-600">
                  نظام متكامل لاكتشاف ورعاية المواهب الرياضية، يشمل برامج
                  تدريبية متخصصة، متابعة مستمرة، وفرص للمشاركة في البطولات
                  المحلية والدولية
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-[#7C9D32]/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#7C9D32] mb-6">عن المنصة</h2>
          <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed">
            مجتمع التربية البدنية هو منصة متخصصة تهدف إلى تطوير وتحسين تعليم
            التربية البدنية في المدارس، وهي مجموعة متكاملة من الأدوات والموارد
            التعليمية، وتتيح الفرصة للمعلمين لتبادل الخبرات والتواصل المهني
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
