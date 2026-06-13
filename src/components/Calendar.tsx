import React, { useEffect } from "react";
import { ChevronRight, ChevronLeft, CalendarDays, Dot } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  date: Date;
  title: string;
  type: "training" | "competition" | "meeting";
}

const BRAND = "#8A1538";
const GOLD = "#C9A227";
const DAY_LETTERS = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];

const Calendar = ({ className }: { className?: string }) => {
  const today = new Date();
  const [view, setView] = React.useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = React.useState<Date>(today);
  const [events, setEvents] = React.useState<Event[]>([]);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .then(({ data }) =>
        setEvents((data || []).map((e: any) => ({ ...e, date: new Date(e.date) }))),
      );
  }, []);

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = view.toLocaleDateString("ar-EG", {
    month: "long",
    year: "numeric",
  });

  const eventDays = new Set(
    events
      .filter((e) => e.date.getFullYear() === year && e.date.getMonth() === month)
      .map((e) => e.date.getDate()),
  );

  const isToday = (d: number) =>
    today.getDate() === d &&
    today.getMonth() === month &&
    today.getFullYear() === year;
  const isSelected = (d: number) =>
    selected.getDate() === d &&
    selected.getMonth() === month &&
    selected.getFullYear() === year;

  const selectedEvents = events.filter(
    (e) => e.date.toDateString() === selected.toDateString(),
  );
  const typeName = (t: string) =>
    t === "training" ? "تدريب" : t === "competition" ? "منافسة" : "اجتماع";
  const selectedLabel = selected.toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div
      className={cn(
        "w-full grid md:grid-cols-[1.3fr_1fr] gap-5 md:gap-6",
        className,
      )}
      dir="rtl"
    >
      {/* ===== التقويم (اليمين) ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_8px_30px_rgba(20,20,20,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setView(new Date(year, month - 1, 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500"
            aria-label="السابق"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <h3 className="text-base font-bold" style={{ color: BRAND }}>
            {monthLabel}
          </h3>
          <button
            onClick={() => setView(new Date(year, month + 1, 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500"
            aria-label="التالي"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_LETTERS.map((d) => (
            <div
              key={d}
              className="text-center text-[11px] font-semibold text-gray-400 py-1"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <div key={`e${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const todayCell = isToday(day);
            const selCell = isSelected(day);
            const hasEvent = eventDays.has(day);
            return (
              <button
                key={day}
                onClick={() => setSelected(new Date(year, month, day))}
                className="relative aspect-square flex items-center justify-center text-sm rounded-xl transition-all duration-150 hover:bg-gray-100"
                style={
                  selCell
                    ? {
                        backgroundColor: BRAND,
                        color: "#fff",
                        fontWeight: 700,
                        boxShadow: `0 6px 16px ${BRAND}55`,
                      }
                    : todayCell
                      ? {
                          backgroundColor: `${BRAND}12`,
                          color: BRAND,
                          fontWeight: 700,
                        }
                      : { color: "#374151" }
                }
              >
                {day}
                {hasEvent && !selCell && (
                  <span
                    className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: GOLD }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* مفتاح الألوان */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: BRAND }} />
            اليوم المحدّد
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD }} />
            يوجد حدث
          </span>
        </div>
      </div>

      {/* ===== الأحداث (الشمال) ===== */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-gray-100 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays className="w-4 h-4" style={{ color: BRAND }} />
          <h4 className="font-bold text-gray-800">أحداث اليوم</h4>
        </div>
        <p className="text-xs text-gray-500 mb-4">{selectedLabel}</p>

        {selectedEvents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-gray-400">
            <Dot className="w-10 h-10 opacity-40" />
            <p className="text-sm">لا توجد أحداث في هذا اليوم</p>
          </div>
        ) : (
          <div className="space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
            {selectedEvents.map((e) => (
              <div
                key={e.id}
                className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-gray-900 truncate">
                    {e.title}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: `${BRAND}12`, color: BRAND }}
                  >
                    {typeName(e.type)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
