import React, { useEffect, useState } from "react";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bell,
  Menu,
  User,
  LogOut,
  Settings,
  HelpCircle,
  BookOpen,
  Home,
  Loader2,
} from "lucide-react";
import AuthDialog from "@/components/auth/AuthDialog";
import { getCurrentUser, signOut } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/lib/admin";

const MainHeader = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, email")
          .eq("id", user.id)
          .single();
        setIsAdmin(
          profile?.email === "eng.mohamed87@live.com" &&
            profile?.role === "admin",
        );
      }
    };
    checkAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          setUser(session.user);
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, email")
            .eq("id", session.user.id)
            .single();
          setIsAdmin(
            profile?.email === "eng.mohamed87@live.com" &&
              profile?.role === "admin",
          );
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setIsAdmin(false);
    toast({
      description: "تم تسجيل الخروج بنجاح",
    });
  };

  return (
    <header className="bg-[#7C9D32] text-white py-2 px-4 shadow-md fixed top-0 left-0 right-0 z-50 h-16 hidden md:block">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        {/* Logo and Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-[#8fb339] hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">PE</span>
              <img
                src="/logo.png"
                alt="صافرة"
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-bold text-white">COMMUNITY</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  onClick={() => navigate("/admin")}
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#748D19] font-bold"
                >
                  لوحة التحكم
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:bg-[#8fb339] hover:text-white"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-[#7C9D32] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-[#7C9D32]">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 bg-white p-4" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">الإشعارات</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-[#7C9D32] hover:text-[#7C9D32]/90"
                      >
                        تحديد الكل كمقروء
                      </Button>
                    </div>
                    <div className="space-y-1 max-h-[400px] overflow-y-auto">
                      {loading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-[#7C9D32]" />
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <NotificationItem
                              title={notification.title}
                              message={notification.message}
                              type={notification.type}
                              createdAt={notification.created_at}
                              isRead={notification.is_read}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          لا توجد إشعارات
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#8fb339] hover:text-white"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-white" align="end">
                  <div className="space-y-3">
                    <div className="border-b pb-2">
                      <p className="font-medium">مرحباً بك</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => navigate("/profile")}
                      >
                        <User className="ml-2 h-4 w-4" />
                        الملف الشخصي
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <BookOpen className="ml-2 h-4 w-4" />
                        دروسي
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="ml-2 h-4 w-4" />
                        الإعدادات
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <HelpCircle className="ml-2 h-4 w-4" />
                        المساعدة
                      </Button>
                    </div>
                    <div className="border-t pt-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                        onClick={handleSignOut}
                      >
                        <LogOut className="ml-2 h-4 w-4" />
                        تسجيل الخروج
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="text-white hover:bg-[#8fb339]"
              onClick={() => setShowAuthDialog(true)}
            >
              تسجيل الدخول
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 border-t border-[#8fb339] pt-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#8fb339]"
            >
              <BookOpen className="ml-2 h-4 w-4" />
              المحتوى التعليمي
            </Button>
          </div>
        </div>
      )}

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => {
          setShowAuthDialog(false);
          getCurrentUser().then(setUser);
        }}
      />
    </header>
  );
};

export default MainHeader;
