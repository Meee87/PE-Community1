import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  email: string;
  school?: string;
  specialization?: string;
  years_of_experience?: string;
  role?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session?.user) {
        navigate("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      if (!profile) {
        console.error("No profile found");
        throw new Error("لم يتم العثور على الملف الشخصي");
      }

      setProfile(profile);
      setIsAdmin(
        profile.email === "eng.mohamed87@live.com" && profile.role === "admin",
      );
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        description:
          error.message || "حدث خطأ أثناء جلب البيانات. حاول مرة أخرى.",
      });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          school: profile.school,
          specialization: profile.specialization,
          years_of_experience: profile.years_of_experience,
        })
        .eq("id", profile.id);

      if (error) throw error;
      toast({ description: "تم تحديث الملف الشخصي بنجاح" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء تحديث الملف الشخصي",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            لم يتم العثور على الملف الشخصي
          </h1>
          <Button onClick={() => navigate("/login")}>تسجيل الدخول</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">الملف الشخصي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-8">
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-32 h-32 rounded-full"
            />
          </div>

          <form onSubmit={updateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input value={profile.email} disabled className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label>الاسم الكامل</Label>
              <Input
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>المدرسة</Label>
              <Input
                value={profile.school || ""}
                onChange={(e) =>
                  setProfile({ ...profile, school: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>التخصص</Label>
              <Input
                value={profile.specialization || ""}
                onChange={(e) =>
                  setProfile({ ...profile, specialization: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>سنوات الخبرة</Label>
              <Input
                value={profile.years_of_experience || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    years_of_experience: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-4">
              {isAdmin && (
                <Button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="bg-[#7C9D32] hover:bg-[#7C9D32]/90"
                >
                  لوحة التحكم
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                رجوع
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
