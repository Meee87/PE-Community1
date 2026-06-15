import React from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";

const FIELDS: { key: string; label: string; type?: "text" | "textarea"; ltr?: boolean }[] = [
  { key: "contact_intro", label: "نص تعريفي", type: "textarea" },
  { key: "contact_email", label: "البريد الإلكتروني", ltr: true },
  { key: "contact_phone", label: "رقم الهاتف", ltr: true },
  { key: "contact_whatsapp", label: "واتساب (مع رمز الدولة)", ltr: true },
  { key: "contact_address", label: "العنوان" },
];

export function ContactSettings() {
  const { toast } = useToast();
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    supabase
      .from("site_settings")
      .select("key,value")
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data || []).forEach((r: any) => (map[r.key] = r.value ?? ""));
        setValues(map);
        setLoading(false);
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const rows = FIELDS.map((f) => ({
      key: f.key,
      value: values[f.key] ?? "",
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", description: "تعذّر الحفظ: " + error.message });
    } else {
      toast({ title: "تم الحفظ", description: "تم تحديث بيانات الاتصال", variant: "success" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-[#8A1538]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
      <h3 className="text-lg font-bold text-[#8A1538] mb-1">إعدادات صفحة اتصل بنا</h3>
      <p className="text-sm text-gray-500 mb-6">
        عدّل بيانات الاتصال التي تظهر للزوار في نموذج "اتصل بنا".
      </p>
      <div className="space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              {f.label}
            </label>
            {f.type === "textarea" ? (
              <Textarea
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="min-h-[80px]"
              />
            ) : (
              <Input
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                dir={f.ltr ? "ltr" : "rtl"}
              />
            )}
          </div>
        ))}
        <Button
          onClick={save}
          disabled={saving}
          className="bg-[#8A1538] hover:bg-[#6E1029] text-white flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </div>
  );
}
