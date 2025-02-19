import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, FileText, Video, Users } from "lucide-react";

interface ContentType {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
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
  },
  {
    id: "2",
    title: "إدارة الجسم",
    description: "تمارين تركز على التحكم في الجسم والتنسيق",
    imageUrl:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format",
  },
  {
    id: "3",
    title: "الحركة التعبيرية",
    description: "أنشطة الحركة الإبداعية والرقص",
    imageUrl:
      "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=500&auto=format",
  },
];

const CategoryGrid = ({
  categories = defaultCategories,
}: CategoryGridProps) => {
  return (
    <div className="w-full min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={category.imageUrl}
                  alt={category.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>

                <Tabs defaultValue="images" className="w-full">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger
                      value="images"
                      className="flex flex-row-reverse"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      الصور
                    </TabsTrigger>
                    <TabsTrigger
                      value="videos"
                      className="flex flex-row-reverse"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      الفيديوهات
                    </TabsTrigger>
                    <TabsTrigger
                      value="files"
                      className="flex flex-row-reverse"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      الملفات
                    </TabsTrigger>
                    <TabsTrigger
                      value="talented"
                      className="flex flex-row-reverse"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      الموهوبين
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="images" className="mt-4">
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="aspect-square bg-gray-200 rounded-md"
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="videos" className="mt-4">
                    <div className="space-y-2">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="aspect-video bg-gray-200 rounded-md"
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="files" className="mt-4">
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded-md" />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="talented" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-12 h-12 bg-gray-200 rounded-full"
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
