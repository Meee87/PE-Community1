import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Features from "../Features";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero — صورة تملا الهيرو والمحتوى فوقها (overlay) */}
      <section className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-[#6E1029] min-h-[68vh] lg:min-h-screen">
        {/* الصورة تملا الهيرو بالكامل (بدون حواف) */}
        <img
          src="/hero.jpg?v=2"
          alt="مجتمع التربية البدنية - قطر"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        />
        {/* تدرّج عنّابي فوق الصورة للوضوح */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(110,16,41,0.55) 0%, rgba(138,21,56,0.48) 45%, rgba(110,16,41,0.85) 100%)",
          }}
        />
        {/* توهّج ناعم خلف الشعار */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C9A227]/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-4 py-7 lg:py-0"
        >
          <span
            className="text-3xl sm:text-6xl lg:text-7xl font-bold text-white/95 tracking-wide leading-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            PE
          </span>
          <motion.img
            src="https://i.imgur.com/fcLmxsY.png"
            alt="PE Community Logo"
            className="h-14 w-14 sm:h-24 sm:w-24 lg:h-28 lg:w-28 object-contain my-1.5 sm:my-2 drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            initial={{ rotate: -8 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          <span
            className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white/95 tracking-wide leading-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Community
          </span>

          <p className="mt-3 sm:mt-6 text-white/85 text-sm sm:text-lg max-w-xl leading-relaxed">
            منصة تعليمية متكاملة لمعلمي ومعلمات التربية البدنية — محتوى، تواصل،
            وتطوير مهني في مكان واحد
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              className="mt-5 sm:mt-10 bg-[#C9A227] hover:bg-[#b8931f] text-[#3a2a06] font-bold text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
              size="lg"
              onClick={() => navigate("/home")}
            >
              ابدأ الآن
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* شريط التسنين القطري أسفل الـ hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
            className="w-full h-8 block"
          >
            <path
              d="M0 40 L0 20 L80 4 L160 20 L240 4 L320 20 L400 4 L480 20 L560 4 L640 20 L720 4 L800 20 L880 4 L960 20 L1040 4 L1120 20 L1200 4 L1280 20 L1360 4 L1440 20 L1440 40 Z"
              fill="#FAF7F2"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* About Section */}
      <section className="py-16 bg-[#8A1538]/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#8A1538] mb-6">عن المنصة</h2>
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
