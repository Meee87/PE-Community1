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
        return <Image className="w-8 h-8 text-[#8A1538]" />;
      case "videos":
        return <Video className="w-8 h-8 text-[#8A1538]" />;
      case "files":
        return <FileText className="w-8 h-8 text-[#8A1538]" />;
      case "talented":
        return <Star className="w-8 h-8 text-[#8A1538]" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className="group p-4 sm:p-6 flex flex-col items-center text-center bg-white rounded-2xl border-0 ring-1 ring-black/5 shadow-[0_6px_24px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgb(0,0,0,0.14)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#8A1538]/15 to-[#8A1538]/5 ring-1 ring-[#8A1538]/10 flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        {getIcon()}
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-gray-900">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">
        {description}
      </p>
      <Button
        className="w-full bg-[#8A1538] hover:bg-[#8A1538] hover:brightness-110 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
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
