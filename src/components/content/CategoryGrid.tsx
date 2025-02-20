import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentViewDialog from "./ContentViewDialog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, FileText, Video, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ContentUploadDialog from "./ContentUploadDialog";
import StageCard from "../navigation/StageCard";

interface ContentType {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  stage_id?: string;
  features?: string[];
  color?: string;
  buttonColor?: string;
}

interface CategoryGridProps {
  categories?: ContentType[];
}

const defaultCategories: ContentType[] = [
  {
    id: "1",
    title: "اللعب النشط",
    description: "الأنشطة البدنية والألعاب للتعلم النشط",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format",
    features: [
      "المهارات الحركية الأساسية",
      "الألعاب التعليمية الممتعة",
      "التمارين البدنية البسيطة",
    ],
    color: "bg-[#4A90E2]",
    buttonColor: "bg-[#4A90E2]",
  },
  {
    id: "2",
    title: "إدارة الجسم",
    description: "تمارين تركز على التحكم في الجسم والتنسيق",
    imageUrl:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format",
    features: [
      "تطوير المهارات المتقدمة",
      "التدريب البدني المنظم",
      "المشاركة في المسابقات",
    ],
    color: "bg-[#9B51E0]",
    buttonColor: "bg-[#9B51E0]",
  },
  {
    id: "3",
    title: "الحركة التعبيرية",
    description: "أنشطة الحركة الإبداعية والرقص",
    imageUrl:
      "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=500&auto=format",
    features: [
      "تنمية الثقة بالنفس",
      "التعاون والعمل الجماعي",
      "اكتشاف المواهب",
    ],
    color: "bg-[#F2994A]",
    buttonColor: "bg-[#F2994A]",
  },
];

const CategoryGrid = ({
  categories = defaultCategories,
}: CategoryGridProps) => {
  const navigate = useNavigate();
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contents, setContents] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    };

    checkAdmin();
  }, []);

  return (
    <div className="w-full min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto space-y-8 flex flex-row-reverse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <StageCard
              key={category.id}
              title={category.title}
              description={category.description}
              imageSrc={category.imageUrl}
              features={category.features}
              color={category.color}
              buttonColor={category.buttonColor}
              onClick={() => navigate(`/category/${category.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
