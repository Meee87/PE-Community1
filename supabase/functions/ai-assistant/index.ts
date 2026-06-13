// Supabase Edge Function: المساعد الذكي لمعلم التربية البدنية
// ينادي Claude API بأمان (المفتاح في أسرار Supabase، لا يظهر للمستخدم).
//
// النشر:
//   supabase functions deploy ai-assistant --no-verify-jwt
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// أو من لوحة Supabase → Edge Functions.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `أنت "مساعد المعلم" — مساعد ذكي متخصص في التربية البدنية للمعلمين والمعلمات في قطر.
مهمتك مساعدة معلمي التربية البدنية بإجابات عملية وقابلة للتطبيق فورًا.

تساعد في:
- خطط الدروس والإحماء والتهدئة حسب المرحلة (ابتدائي/إعدادي/ثانوي).
- أفكار أنشطة وألعاب حركية وجماعية وفردية.
- معايير تقييم (rubrics) للمهارات الحركية.
- تطوير المهارات الأساسية والموهوبين.
- نصائح السلامة وإدارة الحصة والفصل.

القواعد:
- اكتب بالعربية الفصحى المبسّطة، بأسلوب ودود ومهني.
- كن محددًا وعمليًا: قوائم، خطوات، أزمنة، أعداد طلاب.
- راعِ البيئة المدرسية القطرية والخليجية.
- لو السؤال خارج التربية البدنية والتعليم، اعتذر بلطف ووجّه المعلم لما تقدر تساعد فيه.
- لا تخترع معلومات طبية دقيقة؛ انصح بالرجوع للمختص عند الإصابات.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return json({ error: "المساعد غير مُهيّأ بعد (مفتاح API ناقص)." }, 500);
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: "لا توجد رسائل." }, 400);
    }

    // نحتفظ بآخر 12 رسالة فقط لتوفير التكلفة
    const trimmed = messages.slice(-12).map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? "").slice(0, 4000),
    }));

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: trimmed,
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("Anthropic error:", res.status, t);
      return json({ error: "تعذّر الاتصال بالمساعد، حاول مجددًا." }, 502);
    }

    const data = await res.json();
    const reply =
      data?.content?.map((b: any) => b.text).filter(Boolean).join("\n") ??
      "لم أفهم، أعد صياغة سؤالك من فضلك.";

    return json({ reply });
  } catch (e) {
    console.error(e);
    return json({ error: "خطأ غير متوقع." }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}
