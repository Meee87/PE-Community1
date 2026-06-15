import { useEffect, useState, useRef } from "react";
import { Search, X, Video, FileText, Star, Image as ImageIcon, Download, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import PdfThumb from "./PdfThumb";

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: "image" | "video" | "file" | "talent";
  created_at: string;
}

const BRAND = "#8A1538";
const TYPE_META: Record<string, { label: string; Icon: any }> = {
  image: { label: "صورة", Icon: ImageIcon },
  video: { label: "فيديو", Icon: Video },
  file: { label: "ملف", Icon: FileText },
  talent: { label: "موهبة", Icon: Star },
};

export default function ContentDiscovery() {
  const [latest, setLatest] = useState<ContentItem[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ContentItem[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [preview, setPreview] = useState<ContentItem | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const debounce = useRef<any>(null);

  useEffect(() => {
    supabase
      .from("content")
      .select("id,title,description,url,type,created_at")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setLatest((data as ContentItem[]) ?? []));
  }, []);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (!query.trim()) {
      setResults(null);
      return;
    }
    setSearching(true);
    debounce.current = setTimeout(async () => {
      const { data } = await supabase
        .from("content")
        .select("id,title,description,url,type,created_at")
        .ilike("title", `%${query.trim()}%`)
        .order("created_at", { ascending: false })
        .limit(24);
      setResults((data as ContentItem[]) ?? []);
      setSearching(false);
    }, 350);
  }, [query]);

  const shown = results !== null;
  const baseList = shown ? results : latest;
  const list =
    typeFilter && baseList
      ? baseList.filter((i) => i.type === typeFilter)
      : baseList;

  return (
    <section className="max-w-6xl mx-auto px-4 pt-8" dir="rtl">
      {/* شريط البحث */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <Search
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          aria-hidden
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن درس، نشاط، أو مهارة..."
          className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm pr-12 pl-12 py-4 text-base outline-none focus:ring-2 focus:ring-[#8A1538]/25 focus:border-[#8A1538]/40 transition"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="مسح"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* فلاتر النوع */}
      <div className="flex items-center justify-start flex-wrap gap-2 mb-7 no-reverse">
        {[
          { id: null, label: "الكل" },
          { id: "image", label: "صور" },
          { id: "video", label: "فيديو" },
          { id: "file", label: "ملفات" },
          { id: "talent", label: "مواهب" },
        ].map((f) => {
          const active = typeFilter === f.id;
          return (
            <button
              key={f.label}
              onClick={() => setTypeFilter(f.id)}
              className={`text-sm font-bold px-4 py-1.5 rounded-full border transition ${
                active
                  ? "bg-[#8A1538] text-white border-[#8A1538]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#8A1538]/40"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* العنوان */}
      <div className="flex items-center gap-2 mb-5">
        {shown ? (
          <h2 className="text-xl font-bold text-gray-900">
            نتائج البحث {!searching && `(${list?.length ?? 0})`}
          </h2>
        ) : (
          <>
            <Clock className="w-5 h-5" style={{ color: BRAND }} />
            <h2 className="text-xl font-bold text-gray-900">أحدث المحتوى</h2>
          </>
        )}
      </div>

      {/* الشبكة */}
      {searching ? (
        <SkeletonGrid />
      ) : list && list.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" dir="rtl">
          {list.map((item) => (
            <Tile key={item.id} item={item} onOpen={() => setPreview(item)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          {shown ? "لا توجد نتائج مطابقة" : "لا يوجد محتوى بعد"}
        </div>
      )}

      {preview && <Preview item={preview} onClose={() => setPreview(null)} />}
    </section>
  );
}

function Tile({ item, onOpen }: { item: ContentItem; onOpen: () => void }) {
  const meta = TYPE_META[item.type] ?? TYPE_META.file;
  const Icon = meta.Icon;
  return (
    <button
      onClick={onOpen}
      className="group text-right bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_14px_36px_rgba(20,20,20,0.10)] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {item.type === "image" ? (
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : item.type === "file" && /\.pdf($|\?)/i.test(item.url) ? (
          <PdfThumb url={item.url} brand={BRAND} />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `${BRAND}0A` }}
          >
            <Icon className="w-10 h-10" style={{ color: BRAND }} />
          </div>
        )}
        <span
          className="absolute top-2.5 right-2.5 text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: `${BRAND}E6` }}
        >
          {meta.label}
        </span>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-900 truncate">{item.title}</h3>
        {item.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{item.description}</p>
        )}
      </div>
    </button>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-100 rounded animate-pulse" />
            <div className="h-2.5 w-2/3 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Preview({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[120] bg-black/75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button className="absolute top-4 left-4 text-white/90 hover:text-white" onClick={onClose}>
        <X className="w-7 h-7" />
      </button>
      <div
        className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "image" && (
          <img src={item.url} alt={item.title} className="max-h-[78vh] rounded-2xl object-contain" />
        )}
        {item.type === "video" && (
          <video
            src={item.url}
            controls
            autoPlay
            playsInline
            className="max-h-[78vh] max-w-full w-auto mx-auto rounded-2xl bg-black"
          />
        )}
        {(item.type === "file" || item.type === "talent") && (
          <iframe src={item.url} title={item.title} className="w-full h-[78vh] rounded-2xl bg-white" />
        )}
        <div className="flex items-center justify-between w-full mt-3 text-white">
          <span className="font-bold">{item.title}</span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg"
          >
            <Download className="w-4 h-4" /> تحميل
          </a>
        </div>
      </div>
    </div>
  );
}
