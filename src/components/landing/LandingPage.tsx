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
      {/* Hero — هوية قطرية عنّابية */}
      <section className="relative w-full min-h-[100vh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#6E1029] via-[#8A1538] to-[#6E1029]">
        {/* توهّج ناعم خلف الشعار */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C9A227]/10 blur-3xl" />
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-4"
        >
          <span
            className="text-6xl sm:text-7xl font-bold text-white/95 tracking-wide"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            PE
          </span>
          <motion.img
            src="https://i.imgur.com/fcLmxsY.png"
            alt="PE Community Logo"
            className="h-24 w-24 sm:h-28 sm:w-28 object-contain my-2 drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            initial={{ rotate: -8 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          <span
            className="text-5xl sm:text-7xl font-bold text-white/95 tracking-wide"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Community
          </span>

          <p className="mt-6 text-white/80 text-base sm:text-lg max-w-xl leading-relaxed">
            منصة تعليمية متكاملة لمعلمي ومعلمات التربية البدنية — محتوى، تواصل،
            وتطوير مهني في مكان واحد
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              className="mt-10 bg-[#C9A227] hover:bg-[#b8931f] text-[#3a2a06] font-bold text-base sm:text-lg px-10 py-6 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
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
