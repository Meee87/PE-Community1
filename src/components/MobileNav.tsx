import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar as CalendarIcon,
  MessageSquare,
  User,
  LogIn,
  Menu,
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

const MobileNav = () => {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
  }, []);

  const menuItems = [
    { icon: Home, label: "المحتوى", path: "/home" },
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
      ? [{ icon: User, label: "الملف", path: "/profile" }]
      : [{ icon: LogIn, label: "دخول", path: "/login" }]),
  ];

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item, index) => (
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
