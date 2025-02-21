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
        return <Image className="w-8 h-8 text-[#7C9D32]" />;
      case "videos":
        return <Video className="w-8 h-8 text-[#7C9D32]" />;
      case "files":
        return <FileText className="w-8 h-8 text-[#7C9D32]" />;
      case "talented":
        return <Star className="w-8 h-8 text-[#7C9D32]" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className="p-6 flex flex-col items-center text-center bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onClick?.()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="w-16 h-16 rounded-full bg-[#7C9D32]/10 flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Button
        className="w-full bg-[#7C9D32] hover:bg-[#7C9D32]/90 text-white"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        عرض المحتوى
      </Button>
    </Card>
  );
};

export default ContentCard;
