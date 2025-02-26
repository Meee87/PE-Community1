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

    const adminEmails = [
      "eng.mohamed87@live.com",
      "wadhaalmeqareh@hotmail.com",
      "Sarahalmarri1908@outlook.com",
      "Fatmah_alahbabi@hotmail.com",
      "thamertub@gmail.com",
      "liyan2612@hotmail.com",
      "anood99.mhad@hotmail.com",
    ];
    return (
      profile?.role === "admin" || adminEmails.includes(profile?.email || "")
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
