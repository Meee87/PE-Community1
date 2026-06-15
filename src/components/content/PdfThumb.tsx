import React, { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
// عامل الـ worker عبر Vite
// @ts-ignore
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// كاش بسيط على مستوى الوحدة (url → صورة) لتفادي إعادة المعالجة
const cache = new Map<string, string>();

interface Props {
  url: string;
  brand?: string;
}

export default function PdfThumb({ url, brand = "#8A1538" }: Props) {
  const [img, setImg] = useState<string | null>(() => cache.get(url) ?? null);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // تحميل كسول: نعالج فقط عند ظهور البطاقة
  useEffect(() => {
    if (img || failed) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [img, failed]);

  useEffect(() => {
    if (!visible || img || failed) return;
    let cancelled = false;

    (async () => {
      try {
        const task = pdfjsLib.getDocument({ url });
        const pdf = await task.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const targetW = 320;
        const scale = targetW / viewport.width;
        const scaled = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(scaled.width);
        canvas.height = Math.ceil(scaled.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no ctx");
        await page.render({ canvasContext: ctx, viewport: scaled }).promise;
        if (cancelled) return;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        cache.set(url, dataUrl);
        setImg(dataUrl);
        pdf.destroy();
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [visible, url, img, failed]);

  if (img) {
    return (
      <img
        src={img}
        alt="معاينة الملف"
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div
      ref={ref}
      className="w-full h-full flex items-center justify-center"
      style={{ background: `${brand}0A` }}
    >
      <FileText className="w-12 h-12" style={{ color: brand }} />
    </div>
  );
}
