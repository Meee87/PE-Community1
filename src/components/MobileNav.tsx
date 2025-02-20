import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar as CalendarIcon,
  MessageSquare,
  User,
  LogIn,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Calendar from "./Calendar";
import Contact from "./Contact";
import ChatDialog from "./chat/ChatDialog";

const MobileNav = () => {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
  }, []);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#748D19] text-white z-50 h-16 border-t border-white/10">
        <div className="flex items-center justify-around h-full">
          <Link
            to="/home"
            className="flex flex-col items-center justify-center"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">المحتوى</span>
          </Link>

          <button
            onClick={() => setShowCalendar(true)}
            className="flex flex-col items-center justify-center text-white"
          >
            <CalendarIcon className="h-5 w-5" />
            <span className="text-xs mt-1">التقويم</span>
          </button>

          <button
            onClick={() => setShowChat(true)}
            className="flex flex-col items-center justify-center text-white"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">المحادثة</span>
          </button>

          {isLoggedIn ? (
            <Link
              to="/profile"
              className="flex flex-col items-center justify-center"
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">الملف</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex flex-col items-center justify-center"
            >
              <LogIn className="h-5 w-5" />
              <span className="text-xs mt-1">دخول</span>
            </Link>
          )}
        </div>
      </nav>

      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>التقويم الرياضي</DialogTitle>
          </DialogHeader>
          <Calendar className="border-none shadow-none" />
        </DialogContent>
      </Dialog>

      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>اتصل بنا</DialogTitle>
          </DialogHeader>
          <Contact />
        </DialogContent>
      </Dialog>

      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>المحادثة مع المسؤولين</DialogTitle>
          </DialogHeader>
          <ChatDialog onClose={() => setShowChat(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileNav;
