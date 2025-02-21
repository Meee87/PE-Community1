import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar as CalendarIcon,
  MessageSquare,
  User,
  LogIn,
  Menu,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
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

const MobileNav = () => {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [showSideMenu, setShowSideMenu] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      if (session?.user) {
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
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
  };

  const menuItems = [
    { icon: Home, label: "الرئيسية", path: "/" },
    { icon: BookOpen, label: "المحتوى", path: "/home" },
    {
      icon: CalendarIcon,
      label: "التقويم",
      onClick: () => setShowCalendar(true),
    },
    {
      icon: MessageSquare,
      label: "المحادثة",
      onClick: () => setShowChat(true),
    },
    ...(isLoggedIn
      ? [{ icon: User, label: "الملف الشخصي", path: "/profile" }]
      : [{ icon: LogIn, label: "تسجيل الدخول", path: "/login" }]),
  ];

  return (
    <>
      {/* Side Menu */}
      <Sheet open={showSideMenu} onOpenChange={setShowSideMenu}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 right-4 z-50 text-[#7C9D32]"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] bg-white p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-right flex items-center gap-2 justify-end">
                <span className="text-[#7C9D32]">PE COMMUNITY</span>
                <img
                  src="https://api.iconify.design/fluent-emoji-flat:whistle.svg"
                  alt="صافرة"
                  className="h-8 w-8"
                />
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-2 px-2">
                {menuItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-right"
                    onClick={() => {
                      setShowSideMenu(false);
                      if (item.path) {
                        navigate(item.path);
                      } else if (item.onClick) {
                        item.onClick();
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                  </Button>
                ))}

                {isAdmin && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-right"
                    onClick={() => {
                      setShowSideMenu(false);
                      navigate("/admin");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5" />
                      <span>لوحة التحكم</span>
                    </div>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className="w-full justify-start text-right"
                  onClick={() => {
                    setShowSideMenu(false);
                    setShowContact(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5" />
                    <span>اتصل بنا</span>
                  </div>
                </Button>

                {isLoggedIn && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-right text-red-600 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleSignOut();
                      setShowSideMenu(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="h-5 w-5" />
                      <span>تسجيل الخروج</span>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          {menuItems.slice(0, 4).map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                } else if (item.onClick) {
                  item.onClick();
                }
              }}
              className="flex flex-col items-center justify-center flex-1 h-full text-gray-600 hover:text-[#748D19]"
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <Sheet open={showCalendar} onOpenChange={setShowCalendar}>
        <SheetContent className="w-[90%] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>التقويم الرياضي</SheetTitle>
          </SheetHeader>
          <Calendar className="border-none shadow-none" />
        </SheetContent>
      </Sheet>

      <Sheet open={showContact} onOpenChange={setShowContact}>
        <SheetContent className="w-[90%] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>اتصل بنا</SheetTitle>
          </SheetHeader>
          <Contact />
        </SheetContent>
      </Sheet>

      <Sheet open={showChat} onOpenChange={setShowChat}>
        <SheetContent className="w-[90%] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>المحادثة مع المسؤولين</SheetTitle>
          </SheetHeader>
          <ChatDialog onClose={() => setShowChat(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileNav;
