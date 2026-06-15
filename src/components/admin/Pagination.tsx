import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}

// ترقيم صفحات بسيط للجداول الإدارية
export function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
      dir="rtl"
    >
      <span className="text-gray-500">
        {from}–{to} من {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-[#8A1538]/5"
          aria-label="السابق"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="px-2 font-bold text-[#8A1538]">
          {page} / {pages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-[#8A1538]/5"
          aria-label="التالي"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
