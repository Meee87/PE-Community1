import React, { useState, useEffect } from "react";
import { Trash2, Eye, Download, Play, FileText, X, Heart, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  getFavorites,
  toggleFavorite,
  onFavoritesChange,
} from "@/lib/favorites";
import PdfThumb from "./PdfThumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Resource {
  id: string;
  title: string;
  type: "image" | "file" | "video" | "talent";
  thumbnail: string;
  downloadUrl: string;
}

interface ResourceGridProps {
  resources?: Resource[];
  onPreview?: (resource: Resource) => void;
  onDownload?: (resource: Resource) => void;
  isAdmin?: boolean;
  onDelete?: (resource: Resource) => void;
}

const BRAND = "#8A1538";

const download = (r: Resource) => {
  const link = document.createElement("a");
  link.href = r.downloadUrl;
  link.download = r.title;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ResourceGrid = ({
  resources = [],
  onPreview = () => {},
  onDownload = () => {},
  isAdmin = false,
  onDelete,
}: ResourceGridProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    setFavs(getFavorites());
    return onFavoritesChange(() => setFavs(getFavorites()));
  }, []);

  const share = async (r: Resource) => {
    const url = r.downloadUrl;
    try {
      if (navigator.share) {
        await navigator.share({ title: r.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "تم النسخ", description: "تم نسخ رابط المحتوى" });
      }
    } catch {
      /* المستخدم ألغى المشاركة */
    }
  };

  const handleDelete = async (resource: Resource) => {
    try {
      if (resource.downloadUrl.includes("/content/")) {
        const marker = "/content/";
        const path = resource.downloadUrl.slice(
          resource.downloadUrl.indexOf(marker) + marker.length,
        );
        if (path) await supabase.storage.from("content").remove([path]);
      }
      const { error } = await supabase.from("content").delete().eq("id", resource.id);
      if (error) throw error;
      toast({ title: "تم الحذف!", description: "تم حذف المحتوى بنجاح" });
      onDelete?.(resource);
    } catch (e) {
      toast({ variant: "destructive", description: "حدث خطأ أثناء حذف المحتوى" });
    }
  };

  const open = (r: Resource) => {
    setSelected(r);
    onPreview(r);
  };

  if (resources.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
        <p>لا يوجد محتوى في هذا القسم بعد</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {resources.map((r) => (
          <div
            key={r.id}
            className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_14px_36px_rgba(20,20,20,0.10)] hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="relative aspect-[4/3] bg-gray-50 cursor-pointer overflow-hidden"
              onClick={() => open(r)}
            >
              {r.type === "image" ? (
                <img
                  src={r.downloadUrl}
                  alt={r.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400?text=...";
                  }}
                />
              ) : r.type === "video" ? (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: `${BRAND}0A` }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: BRAND }}
                  >
                    <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                  </div>
                </div>
              ) : /\.pdf($|\?)/i.test(r.downloadUrl) ? (
                <PdfThumb url={r.downloadUrl} brand={BRAND} />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: `${BRAND}0A` }}
                >
                  <FileText className="w-12 h-12" style={{ color: BRAND }} />
                </div>
              )}

              {/* تراكب الإجراءات عند المرور */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    open(r);
                  }}
                  className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-gray-800 hover:scale-110 transition"
                  aria-label="معاينة"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(r);
                    download(r);
                  }}
                  className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-gray-800 hover:scale-110 transition"
                  aria-label="تحميل"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    share(r);
                  }}
                  className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-gray-800 hover:scale-110 transition"
                  aria-label="مشاركة"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setResourceToDelete(r);
                      setDeleteDialogOpen(true);
                    }}
                    className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-red-600 hover:scale-110 transition"
                    aria-label="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {r.type === "file" && (
                <span className="absolute top-2 right-2 bg-white/95 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: BRAND }}>
                  PDF
                </span>
              )}

              {/* زر المفضلة */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(r.id);
                }}
                className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition"
                aria-label="إضافة للمفضلة"
              >
                <Heart
                  className="w-4 h-4 transition-colors"
                  style={{
                    color: favs.includes(String(r.id)) ? BRAND : "#9ca3af",
                    fill: favs.includes(String(r.id)) ? BRAND : "transparent",
                  }}
                />
              </button>
            </div>

            <div className="p-3 text-right">
              <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{r.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* المعاينة (Lightbox) */}
      {selected && (
        <div
          className="fixed inset-0 z-[120] bg-black/75 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 left-4 text-white/90 hover:text-white"
            onClick={() => setSelected(null)}
          >
            <X className="w-7 h-7" />
          </button>
          <div
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.type === "image" && (
              <img src={selected.downloadUrl} alt={selected.title} className="max-h-[78vh] rounded-2xl object-contain" />
            )}
            {selected.type === "video" && (
              <video
                src={selected.downloadUrl}
                controls
                autoPlay
                playsInline
                className="max-h-[78vh] max-w-full w-auto mx-auto rounded-2xl bg-black"
              />
            )}
            {(selected.type === "file" || selected.type === "talent") && (
              <iframe src={selected.downloadUrl} title={selected.title} className="w-full h-[78vh] rounded-2xl bg-white" />
            )}
            <div className="flex items-center justify-between w-full mt-3 text-white">
              <span className="font-bold">{selected.title}</span>
              <button
                onClick={() => download(selected)}
                className="flex items-center gap-1.5 text-sm bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg"
              >
                <Download className="w-4 h-4" /> تحميل
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المحتوى؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المحتوى نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (resourceToDelete) handleDelete(resourceToDelete);
                setDeleteDialogOpen(false);
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { ResourceGrid };
