import { Star, FileText, Video, Image, ArrowLeft } from "lucide-react";

interface ContentCardProps {
  type: "images" | "videos" | "files" | "talented";
  title: string;
  description: string;
  onClick?: () => void;
}

// لكل نوع هوية لونية مميّزة ضمن الباليتة القطرية
const STYLES: Record<
  ContentCardProps["type"],
  { from: string; to: string; soft: string; label: string }
> = {
  images: { from: "#8A1538", to: "#A91D45", soft: "#8A1538", label: "صور" },
  videos: { from: "#C9A227", to: "#E0B73A", soft: "#C9A227", label: "فيديو" },
  files: { from: "#6E1029", to: "#8A1538", soft: "#6E1029", label: "ملف" },
  talented: { from: "#A91D45", to: "#C9426B", soft: "#A91D45", label: "موهبة" },
};

const ContentCard = ({ type, title, description, onClick }: ContentCardProps) => {
  const s = STYLES[type];
  const Icon =
    type === "images"
      ? Image
      : type === "videos"
        ? Video
        : type === "files"
          ? FileText
          : Star;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="group relative flex flex-col items-center text-center bg-white rounded-[26px] p-6 cursor-pointer overflow-hidden ring-1 ring-black/5 shadow-[0_10px_30px_rgba(20,20,20,0.06)] hover:shadow-[0_22px_48px_rgba(20,20,20,0.14)] hover:-translate-y-2 transition-all duration-300"
    >
      {/* توهّج علوي خفيف باللون المميّز */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-500"
        style={{ background: s.from }}
      />
      {/* وسم النوع أعلى الزاوية */}
      <span
        className="absolute top-3.5 right-3.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: `${s.soft}14`, color: s.soft }}
      >
        {s.label}
      </span>

      {/* أيقونة بادج متدرّجة */}
      <div
        className="relative w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
        style={{
          background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
          boxShadow: `0 10px 24px ${s.soft}55`,
        }}
      >
        <Icon className="w-9 h-9 text-white" strokeWidth={2.2} />
      </div>

      <h3 className="text-lg font-extrabold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-6 min-h-[40px] line-clamp-2">
        {description}
      </p>

      {/* زر عرض المحتوى — حبة أنيقة بسهم متحرّك */}
      <div
        className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-bold text-white transition-all duration-300"
        style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
      >
        <span>عرض المحتوى</span>
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
      </div>
    </div>
  );
};

export default ContentCard;
