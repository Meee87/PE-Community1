import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/lib/admin";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserPlus, MessageSquare, BarChart, Home } from "lucide-react";
import { STAGES } from "@/lib/constants";
import ContentUploadDialog from "../content/ContentUploadDialog";

interface Stats {
  totalUsers: number;
  totalContent: number;
  totalRequests: number;
}

interface Admin {
  email: string;
  full_name: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalContent: 0,
    totalRequests: 0,
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("email, full_name, created_at")
        .eq("role", "admin");

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء جلب قائمة المشرفين",
      });
    }
  };

  const addAdmin = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("email", newAdminEmail)
        .select();

      if (error) throw error;

      toast({
        description: "تمت إضافة المشرف بنجاح",
      });
      setNewAdminEmail("");
      fetchAdmins();
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء إضافة المشرف",
      });
    }
  };

  const removeAdmin = async (email: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: "user" })
        .eq("email", email);

      if (error) throw error;

      toast({
        description: "تمت إزالة المشرف بنجاح",
      });
      fetchAdmins();
    } catch (error) {
      console.error("Error removing admin:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء إزالة المشرف",
      });
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, email")
          .eq("id", user.id)
          .single();

        if (
          !profile ||
          profile.email !== "eng.mohamed87@live.com" ||
          profile.role !== "admin"
        ) {
          navigate("/");
          toast({
            variant: "destructive",
            description: "غير مصرح لك بالوصول إلى لوحة التحكم",
          });
          setLoading(false);
          return;
        }

        // Fetch stats
        const [usersCount, contentCount, requestsCount] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact" }),
          supabase.from("content").select("id", { count: "exact" }),
          supabase.from("content_requests").select("id", { count: "exact" }),
        ]);

        setStats({
          totalUsers: usersCount.count || 0,
          totalContent: contentCount.count || 0,
          totalRequests: requestsCount.count || 0,
        });

        // If we reach here, user is admin and stats are loaded
        setLoading(false);
      } catch (error) {
        console.error("Error checking admin:", error);
        navigate("/");
        toast({
          variant: "destructive",
          description: "حدث خطأ أثناء التحقق من الصلاحيات",
        });
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Admin Header */}
      <div className="bg-[#748D19] text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-50 text-[#748D19] flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4" />
              الرئيسية
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 ml-2" />
                المستخدمين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-right">
                {stats.totalUsers}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 ml-2" />
                المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-right">
                {stats.totalContent}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 ml-2" />
                الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-right">
                {stats.totalRequests}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="text-right">
          <TabsList className="justify-start">
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="content">إدارة المحتوى</TabsTrigger>
            <TabsTrigger value="messages">الرسائل</TabsTrigger>
            <TabsTrigger value="chats">المحادثات</TabsTrigger>
            <TabsTrigger value="requests">طلبات المحتوى</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">
                  إدارة حسابات الأدمن
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      placeholder="البريد الإلكتروني"
                      className="flex-1"
                      dir="ltr"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                    <Button
                      onClick={addAdmin}
                      disabled={!newAdminEmail}
                      className="bg-[#7C9D32] hover:bg-[#7C9D32]/90"
                    >
                      إضافة أدمن جديد
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-right">
                            البريد الإلكتروني
                          </th>
                          <th className="px-4 py-3 text-right">الاسم</th>
                          <th className="px-4 py-3 text-right">
                            تاريخ الإضافة
                          </th>
                          <th className="px-4 py-3 text-right">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map((admin) => (
                          <tr key={admin.email} className="border-t">
                            <td className="px-4 py-3">{admin.email}</td>
                            <td className="px-4 py-3">{admin.full_name}</td>
                            <td className="px-4 py-3">
                              {new Date(admin.created_at).toLocaleDateString(
                                "ar-SA",
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeAdmin(admin.email)}
                              >
                                إزالة
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">إدارة المحتوى</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(STAGES).map((stage) => (
                      <Card key={stage.id} className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          {stage.name}
                        </h3>
                        <div className="space-y-4">
                          {stage.categories?.map((category) => (
                            <div key={category.id}>
                              <h4 className="font-medium text-gray-700 mb-2">
                                {category.title}
                              </h4>
                              {category.subcategories?.map((subcategory) => (
                                <div key={subcategory.id} className="pl-4 mb-2">
                                  <ContentUploadDialog
                                    stageId={stage.id}
                                    categoryId={subcategory.id}
                                    isAdmin={true}
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
