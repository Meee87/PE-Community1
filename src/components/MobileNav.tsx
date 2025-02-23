import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthDialog from "./auth/AuthDialog";
import {
  Home,
  Calendar as CalendarIcon,
  MessageCircle,
  User,
  LogIn,
  Menu,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Calendar from "./Calendar";
import Contact from "./Contact";
import ChatDialog from "./chat/ChatDialog";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";

const MobileNav = () => {
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [showSideMenu, setShowSideMenu] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const { user, isAdmin: authIsAdmin } = useAuth();

  React.useEffect(() => {
    setIsLoggedIn(!!user);
    setIsAdmin(authIsAdmin);
    if (user?.profile) {
      setUserName(user.profile.full_name || user.profile.username || "مستخدم");
    }
  }, [user, authIsAdmin]);

  async function checkAuth() {
    setIsLoggedIn(!!user);
    setIsAdmin(isAdmin);
  }

  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      setIsAdmin(false);
      setShowSideMenu(false);
      setUserName("");
      setOpen(false);

      toast({
        description: "تم تسجيل الخروج بنجاح",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ في تسجيل الخروج",
      });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] flex items-center justify-between px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] sm:w-[400px] bg-white">
            <SheetHeader>
              <SheetTitle className="text-right">القائمة</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                {isLoggedIn ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full bg-white"
                    />
                    <div>
                      <p className="font-semibold">{userName}</p>
                      <p className="text-sm text-gray-600">مدرس تربية بدنية</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">
                      قم بتسجيل الدخول للوصول إلى حسابك
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowAuthDialog(true);
                        setOpen(false);
                      }}
                    >
                      تسجيل الدخول
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-right"
                  onClick={() => handleNavigation("/")}
                >
                  <Home className="ml-2 h-5 w-5" />
                  الرئيسية
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-right"
                  onClick={() => handleNavigation("/home")}
                >
                  <BookOpen className="ml-2 h-5 w-5" />
                  المحتوى
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-right"
                  onClick={() => setShowContact(true)}
                >
                  <MessageCircle className="ml-2 h-5 w-5" />
                  اتصل بنا
                </Button>
                {isLoggedIn && (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-right"
                      onClick={() => handleNavigation("/profile")}
                    >
                      <User className="ml-2 h-5 w-5" />
                      الملف الشخصي
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-right"
                    >
                      <Bell className="ml-2 h-5 w-5" />
                      الإشعارات
                      <span className="mr-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        3
                      </span>
                    </Button>
                  </>
                )}
                {isAdmin && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-right"
                    onClick={() => handleNavigation("/admin")}
                  >
                    <Settings className="ml-2 h-5 w-5" />
                    لوحة التحكم
                  </Button>
                )}
                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-right text-red-600 hover:text-red-600 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="ml-2 h-5 w-5" />
                    تسجيل الخروج
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-right"
                    onClick={() => {
                      setShowAuthDialog(true);
                      setOpen(false);
                    }}
                  >
                    <LogIn className="ml-2 h-5 w-5" />
                    تسجيل الدخول
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="grid grid-cols-4 w-full h-16 bg-white">
          <button
            onClick={() => handleNavigation("/")}
            className="group flex flex-col items-center justify-center h-full text-gray-600 hover:text-[#748D19] hover:bg-[#748D19]/10 transition-all duration-200"
          >
            <Home className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-xs mt-1 group-hover:text-[#748D19] transition-colors duration-200">
              الرئيسية
            </span>
          </button>
          <button
            onClick={() => handleNavigation("/home")}
            className="group flex flex-col items-center justify-center h-full text-gray-600 hover:text-[#748D19] hover:bg-[#748D19]/10 transition-all duration-200"
          >
            <BookOpen className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-xs mt-1 group-hover:text-[#748D19] transition-colors duration-200">
              المحتوى
            </span>
          </button>
          <button
            onClick={() => setShowCalendar(true)}
            className="group flex flex-col items-center justify-center h-full text-gray-600 hover:text-[#748D19] hover:bg-[#748D19]/10 transition-all duration-200"
          >
            <CalendarIcon className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-xs mt-1 group-hover:text-[#748D19] transition-colors duration-200">
              التقويم
            </span>
          </button>
          {isLoggedIn ? (
            <button
              onClick={handleSignOut}
              className="group flex flex-col items-center justify-center h-full text-gray-600 hover:text-[#748D19] hover:bg-[#748D19]/10 transition-all duration-200"
            >
              <LogOut className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-xs mt-1 group-hover:text-[#748D19] transition-colors duration-200">
                خروج
              </span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthDialog(true)}
              className="group flex flex-col items-center justify-center h-full text-gray-600 hover:text-[#748D19] hover:bg-[#748D19]/10 transition-all duration-200"
            >
              <LogIn className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-xs mt-1 group-hover:text-[#748D19] transition-colors duration-200">
                دخول
              </span>
            </button>
          )}
        </div>
      </div>

      <Sheet open={showCalendar} onOpenChange={setShowCalendar}>
        <SheetContent
          side="bottom"
          className="w-[90%] sm:w-[540px] p-0 bg-transparent border-none mx-auto h-auto flex items-center justify-center"
        >
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg w-full max-w-md">
            <Calendar className="border-none shadow-none" />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showContact} onOpenChange={setShowContact}>
        <SheetContent
          side="bottom"
          className="w-[90%] sm:w-[540px] p-0 bg-transparent border-none mx-auto h-auto flex items-center justify-center"
        >
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg w-full max-w-md p-6">
            <SheetHeader className="mb-6">
              <SheetTitle>اتصل بنا</SheetTitle>
            </SheetHeader>
            <Contact />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showChat} onOpenChange={setShowChat}>
        <SheetContent
          side="bottom"
          className="w-[90%] sm:w-[540px] p-0 bg-transparent border-none mx-auto h-auto flex items-center justify-center"
        >
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg w-full max-w-md p-6">
            <SheetHeader className="mb-6">
              <SheetTitle>المحادثة مع المسؤولين</SheetTitle>
            </SheetHeader>
            <ChatDialog onClose={() => setShowChat(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => {
          setShowAuthDialog(false);
        }}
      />
    </>
  );
};

export default MobileNav;
