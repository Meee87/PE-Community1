import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserPlus, MessageSquare, BarChart } from "lucide-react";

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  full_name: string;
}

interface Message {
  id: string;
  subject: string;
  message: string;
  from_user_id: string;
  created_at: string;
  is_read: boolean;
  from_user_email?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    totalRequests: 0,
  });

  const [selectedStage, setSelectedStage] = useState("primary");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("image");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    type: "image",
    stage_id: "primary",
    category_id: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    checkAdmin();
    fetchData();
    fetchCategories();
  }, [selectedStage]);

  const fetchCategories = async () => {
    console.log("Fetching categories for stage:", selectedStage);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("stage_id", selectedStage);

    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }

    console.log("Fetched categories:", data);
    setCategories(data || []);
    if (data && data.length > 0 && !selectedCategory) {
      setSelectedCategory(data[0].id);
    }
  };

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.email !== "eng.mohamed87@live.com") {
      navigate("/");
      return;
    }
  };

  const fetchData = async () => {
    try {
      const { data: usersData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: messagesData } = await supabase
        .from("messages")
        .select(`*, profiles(email)`)
        .order("created_at", { ascending: false });

      const { data: contentCount } = await supabase
        .from("content")
        .select("id", { count: "exact" });

      const { data: requestCount } = await supabase
        .from("content_requests")
        .select("id", { count: "exact" });

      setUsers(usersData || []);
      setMessages(
        messagesData?.map((msg) => ({
          ...msg,
          from_user_email: msg.profiles?.email,
        })) || [],
      );
      setStats({
        totalUsers: usersData?.length || 0,
        totalContent: contentCount?.length || 0,
        totalRequests: requestCount?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = formData.url;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const filePath = `${selectedStage}/${selectedType}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("content")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage
          .from("content")
          .getPublicUrl(filePath);

        url = data.publicUrl;
      }

      if (!url && !file) {
        toast({
          variant: "destructive",
          description: "يجب إدخال رابط أو رفع ملف",
        });
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("content").insert([
        {
          title: formData.title,
          description: formData.description,
          url,
          type: selectedType,
          stage_id: selectedStage,
          category_id: selectedCategory,
          created_by: user.id,
        },
      ]);

      if (error) {
        console.error("Insert error:", error);
        throw error;
      }

      toast({
        description: "تم إضافة المحتوى بنجاح",
      });

      setFormData({
        title: "",
        description: "",
        url: "",
        type: "image",
        stage_id: selectedStage,
        category_id: "",
      });
      setFile(null);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء إضافة المحتوى",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      toast({ description: "تم تحديث صلاحيات المستخدم بنجاح" });
      fetchData();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء تحديث الصلاحيات",
      });
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                المستخدمين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalContent}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalRequests}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="messages">الرسائل</TabsTrigger>
            <TabsTrigger value="content">إدارة المحتوى</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="p-4 bg-white rounded-lg shadow-sm border"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                            alt={user.full_name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              الصلاحية:
                            </span>
                            <select
                              value={user.role}
                              onChange={(e) =>
                                updateUserRole(user.id, e.target.value)
                              }
                              className="flex-1 border rounded-md p-1.5 text-sm"
                            >
                              <option value="user">مستخدم</option>
                              <option value="moderator">مشرف</option>
                              <option value="admin">مدير</option>
                            </select>
                          </div>
                          <div className="text-sm text-gray-500">
                            تاريخ التسجيل:{" "}
                            {new Date(user.created_at).toLocaleDateString(
                              "ar-SA",
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>الرسائل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg shadow ${message.is_read ? "bg-gray-50" : "bg-white"}`}
                      onClick={() =>
                        !message.is_read && markMessageAsRead(message.id)
                      }
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{message.subject}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(message.created_at).toLocaleDateString(
                            "ar-SA",
                          )}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{message.message}</p>
                      <p className="text-sm text-gray-500">
                        من: {message.from_user_email}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المحتوى التعليمي</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContentSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      اختر المرحلة الدراسية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "primary", name: "المرحلة الابتدائية" },
                        { id: "middle", name: "المرحلة المتوسطة" },
                        { id: "high", name: "المرحلة الثانوية" },
                      ].map((stage) => (
                        <Button
                          key={stage.id}
                          type="button"
                          variant={
                            selectedStage === stage.id ? "default" : "outline"
                          }
                          className={`h-20 text-lg ${selectedStage === stage.id ? "bg-[#7C9D32] hover:bg-[#7C9D32]/90" : ""}`}
                          onClick={() => {
                            setSelectedStage(stage.id);
                            setFormData((prev) => ({
                              ...prev,
                              stage_id: stage.id,
                            }));
                          }}
                        >
                          {stage.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">اختر القسم</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedStage === "primary" &&
                        [
                          { id: "active-play", name: "اللعب النشط" },
                          { id: "body-management", name: "إدارة الجسم" },
                          {
                            id: "expressive-movement",
                            name: "الحركة التعبيرية",
                          },
                        ].map((category) => (
                          <Button
                            key={category.id}
                            type="button"
                            variant={
                              selectedCategory === category.id
                                ? "default"
                                : "outline"
                            }
                            className={`h-16 ${selectedCategory === category.id ? "bg-[#7C9D32] hover:bg-[#7C9D32]/90" : ""}`}
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            {category.name}
                          </Button>
                        ))}
                      {selectedStage === "middle" &&
                        [
                          { id: "team-sports", name: "الرياضات الجماعية" },
                          { id: "individual-sports", name: "الرياضات الفردية" },
                          { id: "fitness", name: "اللياقة البدنية" },
                        ].map((category) => (
                          <Button
                            key={category.id}
                            type="button"
                            variant={
                              selectedCategory === category.id
                                ? "default"
                                : "outline"
                            }
                            className={`h-16 ${selectedCategory === category.id ? "bg-[#7C9D32] hover:bg-[#7C9D32]/90" : ""}`}
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            {category.name}
                          </Button>
                        ))}
                      {selectedStage === "high" &&
                        [
                          { id: "team-sports", name: "الألعاب الجماعية" },
                          { id: "individual-sports", name: "الألعاب الفردية" },
                        ].map((category) => (
                          <Button
                            key={category.id}
                            type="button"
                            variant={
                              selectedCategory === category.id
                                ? "default"
                                : "outline"
                            }
                            className={`h-16 ${selectedCategory === category.id ? "bg-[#7C9D32] hover:bg-[#7C9D32]/90" : ""}`}
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            {category.name}
                          </Button>
                        ))}
                    </div>

                    <h3 className="text-lg font-semibold mt-8">
                      اختر نوع المحتوى
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { id: "image", name: "الصور" },
                        { id: "video", name: "الفيديوهات" },
                        { id: "file", name: "الملفات" },
                        { id: "talent", name: "الموهوبين" },
                      ].map((type) => (
                        <Button
                          key={type.id}
                          type="button"
                          variant={
                            selectedType === type.id ? "default" : "outline"
                          }
                          className={`h-16 ${selectedType === type.id ? "bg-[#7C9D32] hover:bg-[#7C9D32]/90" : ""}`}
                          onClick={() => {
                            setSelectedType(type.id);
                            setFormData((prev) => ({ ...prev, type: type.id }));
                          }}
                        >
                          {type.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>رابط المحتوى (اختياري)</Label>
                        <Input
                          placeholder="ادخل رابط المحتوى"
                          value={formData.url}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <Label>أو قم برفع ملف</Label>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              setFile(files[0]);
                            }
                          }}
                          accept={
                            selectedType === "image"
                              ? "image/*"
                              : selectedType === "video"
                                ? "video/*"
                                : selectedType === "file"
                                  ? ".pdf,.doc,.docx"
                                  : "*"
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>عنوان المحتوى</Label>
                      <Input
                        placeholder="ادخل عنوان المحتوى"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>وصف المحتوى</Label>
                      <textarea
                        className="w-full min-h-[100px] p-3 border rounded-md"
                        placeholder="ادخل وصف المحتوى"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#7C9D32] hover:bg-[#7C9D32]/90"
                    >
                      رفع المحتوى
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
