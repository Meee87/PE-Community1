import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Features from "../Features";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center bg-gradient-to-b from-white via-transparent to-transparent">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2874&auto=format&fit=crop')`,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center gap-2 mb-4">
            <h1 className="text-6xl font-display tracking-tight text-[#7C9D32]">
              PE
            </h1>
            <img
              src="https://api.iconify.design/fluent-emoji-flat:whistle.svg"
              alt="whistle"
              className="w-16 h-16"
            />
            <h1 className="text-6xl font-display tracking-tight text-[#7C9D32]">
              COMMUNITY
            </h1>
          </div>
          <h2 className="text-3xl mb-6 text-gray-800">مجتمع التربية البدنية</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
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
      <Features />

      {/* About Section */}
      <section className="py-16 bg-[#7C9D32]/5">
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
