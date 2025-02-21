import { supabase } from "./supabase";

export const checkIsAdmin = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    // First check if user exists in auth.users
    const { data: authUser } = await supabase
      .from("profiles")
      .select("role, email")
      .eq("id", user.id)
      .eq("email", "eng.mohamed87@live.com")
      .single();

    if (!authUser) {
      // If user doesn't exist, create profile with admin role
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email: "eng.mohamed87@live.com",
          role: "admin",
          username: "eng.mohamed87",
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=eng.mohamed87@live.com`,
        },
      ]);

      if (insertError) {
        console.error("Error creating admin profile:", insertError);
        return false;
      }

      return true;
    }

    // Check if user is eng.mohamed87@live.com and has admin role
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
