import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/lib/admin";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, UserPlus, MessageSquare, BarChart, Home, Trash2, Check, KeyRound } from "lucide-react";
import { STAGES } from "@/lib/constants";
import ContentUploadDialog from "../content/ContentUploadDialog";
import { StatsCards } from "./StatsCards";
import { ContentManagementSection } from "./ContentManagementSection";
import { ContactSettings } from "./ContactSettings";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 10;

interface Stats {
  totalUsers: number;
  totalContent: number;
  totalRequests: number;
}

interface Admin {
  id: string;
  email: string;
  username: string;
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
  user?: {
    username: string;
    email: string;
  };
}

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  created_at: string;
  is_read: boolean;
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [reqPage, setReqPage] = useState(1);
  const [msgPage, setMsgPage] = useState(1);
  const [pwUser, setPwUser] = useState<Admin | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const handleSetPassword = async () => {
    if (!pwUser) return;
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      });
      return;
    }
    setPwLoading(true);
    try {
      const { error } = await supabase.rpc("admin_set_password", {
        target_user: pwUser.id,
        new_password: newPassword,
      });
      if (error) throw error;
      toast({
        title: "تم بنجاح",
        description: `تم تغيير كلمة المرور لـ ${pwUser.email}`,
        variant: "success",
      });
      setPwUser(null);
      setNewPassword("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          "تعذّر تغيير كلمة المرور: " +
          (error.message || "تأكد من تفعيل الدالة في القاعدة"),
      });
    } finally {
      setPwLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
          navigate("/");
          return;
        }
        await Promise.all([
          fetchAdmins(),
          fetchContentRequests(),
          fetchMessages(),
          fetchStats(),
        ]);
      } catch (error) {
        console.error("Error initializing admin dashboard:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: contentCount } = await supabase
        .from("content")
        .select("*", { count: "exact", head: true });

      const { count: requestsCount } = await supabase
        .from("content_requests")
        .select("*", { count: "exact", head: true });

      setStats({
        totalUsers: usersCount || 0,
        totalContent: contentCount || 0,
        totalRequests: requestsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء جلب الرسائل",
      });
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", description: "تعذّر حذف الرسالة" });
      return;
    }
    toast({ description: "تم حذف الرسالة" });
    fetchMessages();
  };

  const fetchContentRequests = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const isAdmin = await checkIsAdmin();
      if (!isAdmin) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("content_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // جلب كل ملفات المستخدمين دفعة واحدة بدل استعلام لكل طلب (N+1)
      const userIds = [
        ...new Set((data || []).map((r) => r.user_id).filter(Boolean)),
      ];
      let profileMap: Record<string, any> = {};
      if (userIds.length) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, username, email")
          .in("id", userIds);
        profileMap = Object.fromEntries(
          (profiles || []).map((p) => [p.id, p]),
        );
      }

      const requestsWithUserDetails = (data || []).map((request) => ({
        ...request,
        user: profileMap[request.user_id] ?? null,
      }));

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
      const { data: request, error: requestError } = await supabase
        .from("content_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (requestError) throw requestError;

      const { error: updateError } = await supabase
        .from("content_requests")
        .update({ status })
        .eq("id", requestId);

      if (updateError) throw updateError;

      if (status === "approved" && request) {
        // تطبيع النوع للمفرد المطابق لـ enum (images→image ...)
        const normType = (t: string) =>
          t === "images" || t === "image"
            ? "image"
            : t === "videos" || t === "video"
              ? "video"
              : t === "files" || t === "file"
                ? "file"
                : "talent";
        const { error: contentError } = await supabase.from("content").insert([
          {
            title: request.title,
            description: request.description,
            url: request.url,
            type: normType(request.type),
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
    if (request?.url) {
      window.open(request.url, "_blank");
    }
  };

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8A1538]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16 md:pb-0 pt-16" dir="rtl">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
        {/* عنوان الصفحة */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-8 rounded-full bg-[#8A1538]" />
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">لوحة التحكم</h1>
            <p className="text-sm text-gray-500">إدارة المحتوى والمستخدمين والطلبات</p>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards
          totalUsers={stats.totalUsers}
          totalContent={stats.totalContent}
          totalRequests={stats.totalRequests}
        />

        {/* Tabs */}
        <Tabs defaultValue="requests" dir="rtl" className="space-y-6">
          <TabsList className="w-full flex overflow-x-auto bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm gap-1 h-auto">
            <TabsTrigger
              value="requests"
              className="flex-1 rounded-xl py-2.5 font-semibold data-[state=active]:bg-[#8A1538] data-[state=active]:text-white data-[state=active]:shadow"
            >
              طلبات المحتوى
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="flex-1 rounded-xl py-2.5 font-semibold data-[state=active]:bg-[#8A1538] data-[state=active]:text-white data-[state=active]:shadow"
            >
              إدارة المحتوى
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex-1 rounded-xl py-2.5 font-semibold data-[state=active]:bg-[#8A1538] data-[state=active]:text-white data-[state=active]:shadow"
            >
              المستخدمين
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="flex-1 rounded-xl py-2.5 font-semibold data-[state=active]:bg-[#8A1538] data-[state=active]:text-white data-[state=active]:shadow"
            >
              الرسائل
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="flex-1 rounded-xl py-2.5 font-semibold data-[state=active]:bg-[#8A1538] data-[state=active]:text-white data-[state=active]:shadow"
            >
              اتصل بنا
            </TabsTrigger>
          </TabsList>

          {/* Content Requests Tab */}
          <TabsContent value="requests">
            <Card className="rounded-2xl border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#8A1538] text-xl">طلبات المحتوى</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-gray-100 rounded-2xl">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#8A1538]/5">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                            >
                              العنوان
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                            >
                              النوع
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                            >
                              الحالة
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                            >
                              تاريخ الطلب
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                            >
                              الإجراءات
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contentRequests
                            ?.slice(
                              (reqPage - 1) * PAGE_SIZE,
                              reqPage * PAGE_SIZE,
                            )
                            .map((request) => (
                            <tr key={request.id} className="hover:bg-[#8A1538]/[0.04]">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {request.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.type === "image" && "صورة"}
                                {request.type === "video" && "فيديو"}
                                {request.type === "file" && "ملف"}
                                {request.type === "talent" && "موهوب"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    request.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : request.status === "approved"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {request.status === "pending" &&
                                    "قيد المراجعة"}
                                  {request.status === "approved" &&
                                    "تمت الموافقة"}
                                  {request.status === "rejected" && "مرفوض"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  request.created_at,
                                ).toLocaleDateString("en-GB")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                    <Pagination
                      page={reqPage}
                      total={contentRequests?.length ?? 0}
                      pageSize={PAGE_SIZE}
                      onPageChange={setReqPage}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content">
            <ContentManagementSection />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="rounded-2xl border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#8A1538] text-xl">إدارة المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
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
                          const { data: existingUser } = await supabase
                            .from("profiles")
                            .select("id")
                            .eq("email", newAdminEmail)
                            .single();

                          if (existingUser) {
                            const { error: updateError } = await supabase
                              .from("profiles")
                              .update({ role: "admin" })
                              .eq("email", newAdminEmail);

                            if (updateError) throw updateError;
                          } else {
                            const tempPassword = Math.random()
                              .toString(36)
                              .slice(-8);

                            const { data: authData, error: authError } =
                              await supabase.auth.signUp({
                                email: newAdminEmail,
                                password: tempPassword,
                                options: {
                                  emailRedirectTo: window.location.origin,
                                },
                              });

                            if (authError) throw authError;

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
                      className="bg-[#8A1538] hover:bg-[#8A1538]/90"
                    >
                      إضافة مستخدم جديد
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden border border-gray-100 rounded-2xl">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-[#8A1538]/5">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                              >
                                البريد الإلكتروني
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                              >
                                الاسم
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                              >
                                تاريخ التسجيل
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                              >
                                الإجراءات
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {admins.map((admin) => (
                              <tr
                                key={admin.email}
                                className="hover:bg-[#8A1538]/[0.04]"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {admin.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {admin.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(
                                    admin.created_at,
                                  ).toLocaleDateString("en-GB")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center gap-2 no-reverse">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="gap-1"
                                      onClick={() => {
                                        setPwUser(admin);
                                        setNewPassword("");
                                      }}
                                    >
                                      <KeyRound className="h-3.5 w-3.5" />
                                      كلمة المرور
                                    </Button>
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
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="rounded-2xl border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#8A1538] text-xl">الرسائل الواردة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-gray-100 rounded-2xl">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#8A1538]/5">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                            >
                              المرسل
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                            >
                              البريد الإلكتروني
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                            >
                              الرسالة
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                            >
                              التاريخ
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                            >
                              الحالة
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-bold text-[#8A1538]"
                            >
                              الإجراءات
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {messages
                            ?.slice(
                              (msgPage - 1) * PAGE_SIZE,
                              msgPage * PAGE_SIZE,
                            )
                            .map((message) => (
                            <tr key={message.id} className="hover:bg-[#8A1538]/[0.04]">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {message.sender_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {message.sender_email}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                <div className="max-w-xs truncate">
                                  {message.message}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  message.created_at,
                                ).toLocaleDateString("en-GB")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    message.is_read
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {message.is_read ? "تمت القراءة" : "جديد"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  {!message.is_read && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-[#8A1538] border-[#8A1538]/30 hover:bg-[#8A1538]/5 flex items-center gap-1.5"
                                      onClick={async () => {
                                        const { error } = await supabase
                                          .from("messages")
                                          .update({ is_read: true })
                                          .eq("id", message.id);
                                        if (!error) fetchMessages();
                                      }}
                                    >
                                      <Check className="h-4 w-4" />
                                      تعليم كمقروءة
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1.5"
                                    onClick={() => handleDeleteMessage(message.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    حذف
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Pagination
                      page={msgPage}
                      total={messages?.length ?? 0}
                      pageSize={PAGE_SIZE}
                      onPageChange={setMsgPage}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Settings Tab */}
          <TabsContent value="contact">
            <ContactSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* تغيير كلمة مرور مستخدم */}
      <Dialog open={!!pwUser} onOpenChange={(o) => !o && setPwUser(null)}>
        <DialogContent className="bg-white max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-[#8A1538]">
              تغيير كلمة المرور
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 -mt-2 mb-2">
            للمستخدم: <span className="font-bold">{pwUser?.email}</span>
          </p>
          <Input
            type="text"
            placeholder="كلمة المرور الجديدة (6 أحرف على الأقل)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="flex items-center gap-2 justify-end mt-4 no-reverse">
            <Button variant="outline" onClick={() => setPwUser(null)}>
              إلغاء
            </Button>
            <Button
              className="bg-[#8A1538] hover:bg-[#6E1029]"
              disabled={pwLoading}
              onClick={handleSetPassword}
            >
              {pwLoading ? "جاري الحفظ..." : "تغيير كلمة المرور"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
