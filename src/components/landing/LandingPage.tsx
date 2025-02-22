import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Features from "../Features";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-screen">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src="https://i.imgur.com/taEJlWj.png"
            alt="PE Community"
            className="w-full h-full object-contain"
            style={{
              maxWidth: "100%",
              maxHeight: "100vh",
              objectFit: "contain",
            }}
          />
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-10">
            <Button
              className="bg-[#7C9D32] hover:bg-[#7C9D32]/90 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 rounded-full transition-all duration-300 hover:scale-105"
              size="lg"
              onClick={() => navigate("/home")}
            >
              ابدأ الآن
            </Button>
          </div>
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
