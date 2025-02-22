import { supabase } from "./supabase";

export const checkIsAdmin = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, email")
      .eq("id", user.id)
      .single();

    return (
      profile?.email === "eng.mohamed87@live.com" && profile?.role === "admin"
    );
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

export const requireAdmin = async (navigate: (path: string) => void) => {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    navigate("/");
    return false;
  }
  return true;
};
