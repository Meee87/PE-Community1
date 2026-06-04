// نبضة إبقاء قاعدة Supabase نشطة (لأي جدولة: Task Scheduler / cron / غيره)
// التشغيل: node scripts/keepalive.mjs
// يقرأ المفاتيح من البيئة أو يستخدم القيم الافتراضية أدناه.

const URL =
  process.env.VITE_SUPABASE_URL ||
  "https://wncehpjbxngwlxzhgaom.supabase.co";
const KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_tAu3CnX8SXcLZSYRwfQZbg_U_f7_EEY";

const res = await fetch(`${URL}/rest/v1/content?select=id&limit=1`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
});

if (res.ok) {
  console.log(`✅ Supabase نشط (${new Date().toISOString()})`);
} else {
  console.error(`✖ فشل: HTTP ${res.status}`);
  process.exit(1);
}
