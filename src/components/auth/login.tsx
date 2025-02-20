import React from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getErrorMessage } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showResetDialog, setShowResetDialog] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState("");
  const [resetSent, setResetSent] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast({
        description: "تم تسجيل الدخول بنجاح",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Error:", error);
      setError(getErrorMessage(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const fullName = (form.elements.namedItem("fullName") as HTMLInputElement)
      .value;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            username: email.split("@")[0],
            full_name: fullName,
            email,
            role: "user",
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            school: "",
            specialization: "",
            years_of_experience: "",
          },
        ]);

        if (profileError) {
          console.error("Profile Error:", profileError);
          throw new Error("حدث خطأ في إنشاء الملف الشخصي");
        }

        // Sign in automatically after successful signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        toast({
          description: "تم إنشاء الحساب وتسجيل الدخول بنجاح!",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setError(getErrorMessage(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setResetSent(true);
    } catch (error: any) {
      console.error("Error:", error);
      setError(
        error.message || "حدث خطأ في إرسال رابط إعادة تعيين كلمة المرور",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <Card className="w-full max-w-md mx-4 relative z-10">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700"
            >
              العودة للرئيسية
            </Button>
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              مرحباً بك في مجتمع التربية البدنية
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
            </TabsList>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="محمد أحمد"
                      className="pr-10 text-right"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pr-10 text-right"
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pr-10 text-right"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#748d19] hover:bg-[#647917]"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                </Button>

                <p className="text-sm text-gray-500 text-center mt-4">
                  يمكنك إضافة المزيد من المعلومات في صفحة الملف الشخصي لاحقاً
                </p>
              </form>
            </TabsContent>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pr-10 text-right"
                      required
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Dialog
                      open={showResetDialog}
                      onOpenChange={setShowResetDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          className="px-0 font-normal text-xs text-gray-500 hover:text-primary"
                        >
                          نسيت كلمة المرور؟
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>إعادة تعيين كلمة المرور</DialogTitle>
                        </DialogHeader>
                        {!resetSent ? (
                          <form
                            onSubmit={handleResetPassword}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="reset-email">
                                البريد الإلكتروني
                              </Label>
                              <Input
                                id="reset-email"
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={isLoading}
                            >
                              إرسال رابط إعادة التعيين
                            </Button>
                          </form>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-green-600">
                              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك
                              الإلكتروني
                            </p>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pr-10 text-right"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#748d19] hover:bg-[#647917]"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
