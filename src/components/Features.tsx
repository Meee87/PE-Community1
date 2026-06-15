import React from "react";
import { Card, CardContent } from "./ui/card";
import { BookOpen, Users, Award } from "lucide-react";

const Features = () => {
  const features = [
    {
      Icon: BookOpen,
      title: "محتوى تعليمي",
      description: "مكتبة شاملة من المواد التعليمية والأنشطة الرياضية",
    },
    {
      Icon: Users,
      title: "مجتمع مهني",
      description: "تواصل مع نخبة وتبادل الخبرات والأفكار",
    },
    {
      Icon: Award,
      title: "دعم الموهوبين",
      description: "اكتشاف ورعاية المواهب الرياضية",
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-[#FAF7F2]">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#8A1538]">
          مميزات المنصة
        </h2>
        <div className="w-16 h-1 bg-[#8A1538] rounded-full mx-auto mb-10 sm:mb-14" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map(({ Icon, title, description }, index) => (
            <Card
              key={index}
              className="group relative border-0 rounded-3xl bg-white ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_18px_40px_rgba(138,21,56,0.16)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
            >
              {/* شريط علوي عنّابي موحّد */}
              <div className="h-1.5 w-full bg-gradient-to-l from-[#8A1538] to-[#A91D45]" />
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div
                    className="relative w-20 h-20 rounded-[1.4rem] flex items-center justify-center bg-gradient-to-b from-[#A91D45] to-[#6E1029] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{
                      boxShadow:
                        "inset 0 2px 3px rgba(255,255,255,0.45), inset 0 -4px 6px rgba(0,0,0,0.35), 0 10px 18px -4px rgba(138,21,56,0.5), 0 4px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    {/* لمعة علوية زجاجية */}
                    <span className="pointer-events-none absolute inset-x-2 top-1.5 h-1/3 rounded-full bg-white/25 blur-[2px]" />
                    <Icon
                      className="relative w-9 h-9 text-white"
                      strokeWidth={2}
                      style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.45))" }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#8A1538]">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
