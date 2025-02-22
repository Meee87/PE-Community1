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

interface ContentRequest {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  status: string;
  created_at: string;
  user_id: string;
  stage_id: string;
  category_id: string;
}

const AdminDashboard = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [contentRequests, setContentRequests] = useState<ContentRequest[]>([]);
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
    const init = async () => {
      await fetchAdmins();
      await fetchContentRequests();
    };
    init();
  }, []);

  const fetchContentRequests = async () => {
    try {
      console.log("Fetching content requests...");

      // First verify we are admin
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("No user found");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, email")
        .eq("id", user.id)
        .single();

      const isAdmin =
        profile?.email === "eng.mohamed87@live.com" &&
        profile?.role === "admin";
      console.log("Is admin:", isAdmin, profile);

      if (!isAdmin) {
        console.error("User is not admin");
        return;
      }

      // Fetch requests
      const { data, error } = await supabase
        .from("content_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching content requests:", error);
        throw error;
      }

      console.log("Content requests raw data:", data);

      if (!data || data.length === 0) {
        console.log("No content requests found");
      } else {
        console.log(`Found ${data.length} content requests`);
      }

      // Get user details for each request
      const requestsWithUserDetails = await Promise.all(
        data.map(async (request) => {
          const { data: userData } = await supabase
            .from("profiles")
            .select("full_name, email")
            .eq("id", request.user_id)
            .single();
          return { ...request, user: userData };
        }),
      );

      console.log("Requests with user details:", requestsWithUserDetails);
      setContentRequests(requestsWithUserDetails);
    } catch (error) {
      console.error("Error in fetchContentRequests:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء جلب طلبات المحتوى",
      });
    }
  };

  const handleUpdateRequestStatus = async (
    requestId: string,
    status: string,
  ) => {
    try {
      // First get the request details
      const { data: request, error: requestError } = await supabase
        .from("content_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (requestError) throw requestError;

      // Update request status
      const { error: updateError } = await supabase
        .from("content_requests")
        .update({ status })
        .eq("id", requestId);

      if (updateError) throw updateError;

      // If approved, create new content
      if (status === "approved" && request) {
        const { error: contentError } = await supabase.from("content").insert([
          {
            title: request.title,
            description: request.description,
            url: request.url,
            type: request.type,
            stage_id: request.stage_id,
            category_id: request.category_id,
            created_by: request.user_id,
          },
        ]);

        if (contentError) throw contentError;
      }

      toast({
        description: `تم ${status === "approved" ? "قبول" : "رفض"} الطلب بنجاح`,
      });

      fetchContentRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء تحديث حالة الطلب",
      });
    }
  };

  const handleViewRequest = (request: ContentRequest) => {
    window.open(request.url, "_blank");
  };

  const fetchAdmins = async () => {
    try {
      console.log("Fetching admins...");
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) throw error;
      console.log("Fetched profiles:", data);
      setAdmins(data || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء جلب قائمة المشرفين",
      });
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      setLoading(true);
      try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
          navigate("/");
          toast({
            variant: "destructive",
            description: "غير مصرح لك بالوصول إلى لوحة التحكم",
          });
          return;
        }

        // Fetch stats
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        const { count: contentCount } = await supabase
          .from("content")
          .select("*", { count: "exact", head: true });

        const { count: requestsCount } = await supabase
          .from("content_requests")
          .select("*", { count: "exact", head: true });

        console.log("Stats:", { usersCount, contentCount, requestsCount });

        setStats({
          totalUsers: usersCount || 0,
          totalContent: contentCount || 0,
          totalRequests: requestsCount || 0,
        });

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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0" dir="rtl">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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

        <Tabs defaultValue="requests" className="text-right">
          <TabsList className="justify-start overflow-x-auto flex-wrap gap-2">
            <TabsTrigger value="requests">طلبات المحتوى</TabsTrigger>
            <TabsTrigger value="content">إدارة المحتوى</TabsTrigger>
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>طلبات المحتوى</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-right">العنوان</th>
                          <th className="px-4 py-3 text-right">النوع</th>
                          <th className="px-4 py-3 text-right">الحالة</th>
                          <th className="px-4 py-3 text-right">تاريخ الطلب</th>
                          <th className="px-4 py-3 text-right">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contentRequests?.map((request) => (
                          <tr key={request.id} className="border-t">
                            <td className="px-4 py-3">{request.title}</td>
                            <td className="px-4 py-3">
                              {request.type === "image" && "صورة"}
                              {request.type === "video" && "فيديو"}
                              {request.type === "file" && "ملف"}
                              {request.type === "talent" && "موهوب"}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  request.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : request.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {request.status === "pending" && "قيد المراجعة"}
                                {request.status === "approved" &&
                                  "تمت الموافقة"}
                                {request.status === "rejected" && "مرفوض"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {new Date(request.created_at).toLocaleDateString(
                                "ar-SA",
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewRequest(request)}
                                >
                                  عرض
                                </Button>
                                {request.status === "pending" && (
                                  <>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() =>
                                        handleUpdateRequestStatus(
                                          request.id,
                                          "approved",
                                        )
                                      }
                                    >
                                      قبول
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() =>
                                        handleUpdateRequestStatus(
                                          request.id,
                                          "rejected",
                                        )
                                      }
                                    >
                                      رفض
                                    </Button>
                                  </>
                                )}
                              </div>
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

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المحتوى</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-6">
                    {Object.values(STAGES).map((stage) => (
                      <Card key={stage.id} className="overflow-hidden">
                        <CardHeader className="bg-[#7C9D32]/10">
                          <CardTitle>{stage.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-8">
                            {stage.categories?.map((category) => (
                              <div key={category.id} className="space-y-4">
                                <h3 className="text-xl font-semibold text-[#7C9D32]">
                                  {category.title}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {category.subcategories?.map(
                                    (subcategory) => (
                                      <Card
                                        key={subcategory.id}
                                        className="overflow-hidden"
                                      >
                                        <div className="relative h-40">
                                          <img
                                            src={subcategory.imageUrl}
                                            alt={subcategory.title}
                                            className="w-full h-full object-cover"
                                          />
                                          <div
                                            className={`absolute inset-0 ${subcategory.buttonColor} opacity-60`}
                                          />
                                        </div>
                                        <CardContent className="p-4">
                                          <h4 className="font-semibold mb-2">
                                            {subcategory.title}
                                          </h4>
                                          <div className="space-y-2">
                                            {subcategory.contentTypes?.map(
                                              (type) => (
                                                <ContentUploadDialog
                                                  key={type.id}
                                                  stageId={stage.id}
                                                  categoryId={subcategory.id}
                                                  contentType={type.id}
                                                  isAdmin={true}
                                                  className="w-full justify-start text-right"
                                                />
                                              ),
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ),
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">إدارة المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <Input
                      placeholder="البريد الإلكتروني"
                      className="flex-1"
                      dir="ltr"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                    <Button
                      onClick={async () => {
                        try {
                          // First check if user exists
                          const { data: existingUser } = await supabase
                            .from("profiles")
                            .select("id")
                            .eq("email", newAdminEmail)
                            .single();

                          if (existingUser) {
                            // Update existing user to admin
                            const { error: updateError } = await supabase
                              .from("profiles")
                              .update({ role: "admin" })
                              .eq("email", newAdminEmail);

                            if (updateError) throw updateError;
                          } else {
                            // Generate a random password
                            const tempPassword = Math.random()
                              .toString(36)
                              .slice(-8);

                            // Create auth user with signUp
                            const { data: authData, error: authError } =
                              await supabase.auth.signUp({
                                email: newAdminEmail,
                                password: tempPassword,
                                options: {
                                  emailRedirectTo: window.location.origin,
                                },
                              });

                            if (authError) throw authError;

                            // Then create profile
                            const { error: insertError } = await supabase
                              .from("profiles")
                              .insert([
                                {
                                  id: authData.user?.id,
                                  email: newAdminEmail,
                                  role: "admin",
                                  username: newAdminEmail.split("@")[0],
                                  avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newAdminEmail}`,
                                },
                              ]);

                            // Send email with temporary password
                            toast({
                              description: `تم إنشاء الحساب بنجاح. كلمة المرور المؤقتة: ${tempPassword}`,
                            });

                            if (insertError) throw insertError;
                          }

                          toast({
                            description: "تم إضافة المشرف بنجاح",
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
                      }}
                      disabled={!newAdminEmail}
                      className="bg-[#7C9D32] hover:bg-[#7C9D32]/90"
                    >
                      إضافة مستخدم جديد
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-right">
                              البريد الإلكتروني
                            </th>
                            <th className="px-4 py-3 text-right">الاسم</th>
                            <th className="px-4 py-3 text-right">
                              تاريخ التسجيل
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
                                  onClick={async () => {
                                    try {
                                      const { error } = await supabase
                                        .from("profiles")
                                        .update({ role: "user" })
                                        .eq("email", admin.email);

                                      if (error) throw error;

                                      toast({
                                        description: "تم إزالة المشرف بنجاح",
                                      });
                                      fetchAdmins();
                                    } catch (error) {
                                      console.error(
                                        "Error removing admin:",
                                        error,
                                      );
                                      toast({
                                        variant: "destructive",
                                        description:
                                          "حدث خطأ أثناء إزالة المشرف",
                                      });
                                    }
                                  }}
                                >
                                  حذف
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
