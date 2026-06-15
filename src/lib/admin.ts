import { supabase } from "./supabase";

export const checkIsAdmin = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    console.log("Checking admin status for user:", user.id);

    // استخدام RPC بدلاً من الاستعلام المباشر
    const { data, error } = await supabase.rpc("is_admin");

    if (error) {
      console.error("RPC error:", error);
      // استخدام الطريقة التقليدية كخطة بديلة
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        return false;
      }

      return profile?.role === "admin";
    }

    return !!data;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// جلب مُعرّفات كل المشرفين (بدل البريد الثابت) — للإشعارات والطلبات
export const getAdminIds = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin");
    if (error) {
      console.error("Error fetching admin ids:", error);
      return [];
    }
    return (data || []).map((r: any) => r.id).filter(Boolean);
  } catch (error) {
    console.error("Error fetching admin ids:", error);
    return [];
  }
};

// أول مشرف متاح (للحقول التي تتطلب admin_id واحد)
export const getPrimaryAdminId = async (): Promise<string | null> => {
  const ids = await getAdminIds();
  return ids[0] ?? null;
};

export const requireAdmin = async (navigate: (path: string) => void) => {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    navigate("/");
    return false;
  }
  return true;
};
