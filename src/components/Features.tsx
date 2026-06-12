import React from "react";
import { Card, CardContent } from "./ui/card";

const Features = () => {
  const features = [
    {
      icon: "https://api.iconify.design/fluent-emoji-flat:books.svg",
      title: "محتوى تعليمي",
      description: "مكتبة شاملة من المواد التعليمية والأنشطة الرياضية",
      accent: "#8A1538",
    },
    {
      icon: "https://api.iconify.design/fluent-emoji-flat:people-hugging.svg",
      title: "مجتمع مهني",
      description: "تواصل مع نخبة وتبادل الخبرات والأفكار",
      accent: "#C9A227",
    },
    {
      icon: "https://api.iconify.design/fluent-emoji-flat:sports-medal.svg",
      title: "دعم الموهوبين",
      description: "اكتشاف ورعاية المواهب الرياضية",
      accent: "#A91D45",
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-[#FAF7F2]">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[#8A1538]">
          مميزات المنصة
        </h2>
        <div className="w-16 h-1 bg-[#C9A227] rounded-full mx-auto mb-10 sm:mb-14" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-0 rounded-3xl bg-white ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_18px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
            >
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: feature.accent }}
              />
              <CardContent className="p-8 text-center relative">
                <div className="flex flex-col items-center space-y-4">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: `${feature.accent}14` }}
                  >
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#8A1538]">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
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
