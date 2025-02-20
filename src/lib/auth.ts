import { supabase } from "./supabase";

export const getErrorMessage = (error: string) => {
  switch (error) {
    case "Invalid login credentials":
      return "بيانات تسجيل الدخول غير صحيحة";
    case "User already registered":
      return "البريد الإلكتروني مسجل مسبقاً";
    case "Email not confirmed":
      return "يرجى تأكيد البريد الإلكتروني أولاً";
    case "Invalid email":
      return "البريد الإلكتروني غير صالح";
    case "Password should be at least 6 characters":
      return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    default:
      return "حدث خطأ، يرجى المحاولة مرة أخرى";
  }
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error.message);
    return null;
  }
  return user;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
