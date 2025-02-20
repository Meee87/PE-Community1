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
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error:", error);
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
      toast({
        description: "تم تحديث الملف الشخصي بنجاح",
      });
    } catch (error) {
      console.error("Error:", error);
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
            <div className="relative">
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-32 h-32 rounded-full"
              />
            </div>
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
