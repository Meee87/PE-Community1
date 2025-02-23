import { supabase } from "./supabase";

export const checkIsAdmin = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role, email")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return false;
    }

    if (!profile) {
      console.log("No profile found for user:", user.id);
      return false;
    }

    console.log("Admin check - User ID:", user.id);
    console.log("Admin check - Profile:", profile);
    console.log("Admin check - Role:", profile.role);

    return profile.role === "admin";
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
