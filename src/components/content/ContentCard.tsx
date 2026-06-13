import { ArrowLeft } from "lucide-react";

interface ContentCardProps {
  type: "images" | "videos" | "files" | "talented";
  title: string;
  description: string;
  onClick?: () => void;
}

// رمز 3D + هوية لونية لكل نوع
const STYLES: Record<
  ContentCardProps["type"],
  { emoji: string; accent: string; accent2: string; label: string }
> = {
  images: {
    emoji: "framed-picture",
    accent: "#8A1538",
    accent2: "#A91D45",
    label: "صور",
  },
  videos: {
    emoji: "clapper-board",
    accent: "#C9A227",
    accent2: "#E0B73A",
    label: "فيديو",
  },
  files: {
    emoji: "open-book",
    accent: "#6E1029",
    accent2: "#8A1538",
    label: "ملف",
  },
  talented: {
    emoji: "sports-medal",
    accent: "#A91D45",
    accent2: "#C9426B",
    label: "موهبة",
  },
};

const ContentCard = ({ type, title, description, onClick }: ContentCardProps) => {
  const s = STYLES[type];
  const iconUrl = `https://api.iconify.design/fluent-emoji/${s.emoji}.svg`;

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
      className="group relative flex flex-col items-center text-center bg-white rounded-[28px] p-6 pt-7 cursor-pointer overflow-hidden ring-1 ring-black/[0.06] shadow-[0_10px_30px_rgba(20,20,20,0.06)] hover:shadow-[0_24px_50px_rgba(20,20,20,0.15)] hover:-translate-y-2 transition-all duration-300"
    >
      {/* شريط لون علوي رفيع */}
      <div
        className="absolute top-0 inset-x-0 h-1.5"
        style={{ background: `linear-gradient(90deg, ${s.accent}, ${s.accent2})` }}
      />
      {/* وسم النوع */}
      <span
        className="absolute top-4 right-4 text-[11px] font-bold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: `${s.accent}12`, color: s.accent }}
      >
        {s.label}
      </span>

      {/* هالة + رمز 3D */}
      <div className="relative mb-5 mt-2">
        <div
          className="absolute inset-0 -m-2 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${s.accent}55, transparent 70%)` }}
        />
        <div
          className="relative w-[92px] h-[92px] rounded-[28px] flex items-center justify-center ring-1"
          style={{
            background: `linear-gradient(160deg, ${s.accent}14, ${s.accent}05)`,
            borderColor: `${s.accent}20`,
          }}
        >
          <img
            src={iconUrl}
            alt={title}
            className="w-14 h-14 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
            loading="lazy"
          />
        </div>
      </div>

      <h3 className="text-lg font-extrabold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-6 min-h-[40px] line-clamp-2">
        {description}
      </p>

      {/* زر عرض المحتوى */}
      <div
        className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-bold text-white shadow-md transition-all duration-300 group-hover:shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${s.accent}, ${s.accent2})`,
        }}
      >
        <span>عرض المحتوى</span>
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
      </div>
    </div>
  );
};

export default ContentCard;
