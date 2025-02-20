import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, FileText, Video, Image } from "lucide-react";

interface ContentCardProps {
  type: "images" | "videos" | "files" | "talented";
  title: string;
  description: string;
  onClick?: () => void;
}

const ContentCard = ({
  type,
  title,
  description,
  onClick,
}: ContentCardProps) => {
  const getIcon = () => {
    switch (type) {
      case "images":
        return <Image className="w-8 h-8 text-green-500" />;
      case "videos":
        return <Video className="w-8 h-8 text-green-500" />;
      case "files":
        return <FileText className="w-8 h-8 text-green-500" />;
      case "talented":
        return <Star className="w-8 h-8 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 flex flex-col items-center text-center bg-white">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Button
        onClick={onClick}
        className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black"
      >
        عرض المحتوى
      </Button>
    </Card>
  );
};

export default ContentCard;
