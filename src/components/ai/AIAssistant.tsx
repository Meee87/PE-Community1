import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "خطة إحماء 10 دقائق للصف الثالث",
  "نشاط جماعي لتنمية التوازن",
  "معايير تقييم مهارة التنطيط",
  "أفكار ألعاب للتهدئة بعد الحصة",
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { messages: next },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "تعذّر الوصول للمساعد حاليًا. تأكد من تفعيله، أو حاول لاحقًا. ⚠️",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* الزر العائم */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="المساعد الذكي"
          className="fixed z-[90] bottom-20 md:bottom-6 left-4 md:left-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#8A1538] to-[#6E1029] text-white shadow-[0_8px_24px_rgba(138,21,56,0.45)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <Sparkles className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#C9A227] border-2 border-white" />
        </button>
      )}

      {/* نافذة المحادثة */}
      {open && (
        <div className="fixed z-[95] bottom-20 md:bottom-6 left-2 md:left-6 right-2 md:right-auto md:w-[400px] h-[70vh] md:h-[560px] bg-white rounded-3xl shadow-2xl ring-1 ring-black/10 flex flex-col overflow-hidden">
          {/* الهيدر */}
          <div className="bg-gradient-to-l from-[#8A1538] to-[#6E1029] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div>
                <p className="font-bold leading-tight">مساعد المعلم</p>
                <p className="text-[11px] text-white/70">ذكاء اصطناعي للتربية البدنية</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/15"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* الرسائل */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF7F2]">
            {messages.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-4">
                  اسألني عن خطط الدروس، الأنشطة، أو معايير التقييم 👇
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs bg-white border border-[#8A1538]/20 text-[#8A1538] rounded-full px-3 py-1.5 hover:bg-[#8A1538]/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#8A1538] text-white rounded-bl-sm"
                      : "bg-white text-gray-800 ring-1 ring-black/5 rounded-br-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-end">
                <div className="bg-white ring-1 ring-black/5 rounded-2xl px-4 py-2.5 flex items-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> يكتب...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* الإدخال */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="اكتب سؤالك..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#8A1538]/30 outline-none"
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full bg-[#8A1538] text-white flex items-center justify-center hover:bg-[#6E1029] disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
