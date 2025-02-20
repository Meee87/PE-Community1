export interface Stage {
  id: string;
  name: string;
  title: string;
  description: string;
  icon?: "book" | "target" | "users";
  color?: string;
  buttonColor?: string;
  features?: string[];
  categories: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    features?: string[];
    color?: string;
    buttonColor?: string;
  }[];
}

export const STAGES: Record<string, Stage> = {
  primary: {
    id: "primary",
    name: "المرحلة الابتدائية",
    title: "المرحلة الابتدائية",
    description: "تعليم الطفولة المبكرة والصفوف العليا",
    icon: "book",
    color: "bg-white",
    buttonColor: "bg-[#2563eb]",
    features: [
      "المهارات الحركية الأساسية",
      "الألعاب التعليمية الممتعة",
      "التمارين البدنية البسيطة",
      "تنمية الثقة بالنفس",
      "التعاون والعمل الجماعي",
    ],
    categories: [
      {
        id: "early-childhood",
        title: "مرحلة الطفولة المبكرة",
        description: "الصفوف الأولية (1-3)",
        imageUrl:
          "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=500&auto=format",
        features: ["اللعب النشط", "إدارة الجسم", "الحركة التعبيرية"],
        color: "bg-[#5a43d7]/5",
        buttonColor: "bg-[#5a43d7]",
      },
      {
        id: "upper-grades",
        title: "مرحلة الصفوف العليا",
        description: "الصفوف العليا (4-6)",
        imageUrl:
          "https://images.unsplash.com/photo-1576334761529-0f1d6c944e73?w=500&auto=format",
        features: ["الألعاب الجماعية", "الألعاب الفردية"],
        color: "bg-[#5a43d7]/5",
        buttonColor: "bg-[#5a43d7]",
      },
    ],
  },
};
