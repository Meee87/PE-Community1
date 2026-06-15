import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // عند الوصول من رابط الإيميل يُنشئ Supabase جلسة استرجاع ويُطلق حدث PASSWORD_RECOVERY
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // أو لو فيه جلسة سارية بالفعل (المستخدم وصل عبر الرابط)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({
        title: "تم بنجاح",
        description: "تم تحديث كلمة المرور، يمكنك تسجيل الدخول الآن",
        variant: "success",
      });
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8" dir="rtl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#8A1538]/10 flex items-center justify-center mb-3">
            <Lock className="w-7 h-7 text-[#8A1538]" />
          </div>
          <h1 className="text-2xl font-bold text-[#8A1538]">تعيين كلمة مرور جديدة</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            أدخل كلمة المرور الجديدة لحسابك
          </p>
        </div>

        {!ready ? (
          <p className="text-center text-gray-500 py-6">
            جارٍ التحقق من رابط إعادة التعيين… إذا لم تصل من رابط البريد،{" "}
            <button
              className="text-[#8A1538] font-bold underline"
              onClick={() => navigate("/login")}
            >
              اطلب رابطًا جديدًا
            </button>
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder="كلمة المرور الجديدة"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute inset-y-0 left-0 pl-3 flex items-center"
              >
                {show ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <Input
              type={show ? "text" : "password"}
              placeholder="تأكيد كلمة المرور"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8A1538] hover:bg-[#6E1029]"
            >
              {loading ? "جاري الحفظ..." : "تحديث كلمة المرور"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
