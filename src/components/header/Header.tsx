import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Calendar from "@/components/Calendar";
import Contact from "@/components/Contact";

interface HeaderProps {
  onMenuClick?: () => void;
  userName?: string;
}

const Header = ({ onMenuClick, userName }: HeaderProps) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
  };

  const buttonClasses =
    "text-sm font-medium text-white hover:bg-[#FFD700] hover:text-[#748D19] px-4 py-2 rounded-md transition-colors";

  return (
    <header className="fixed top-0 left-0 right-0 h-14 md:h-16 bg-[#748D19] shadow-md z-50">
      <div
        className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between"
        dir="rtl"
      >
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-[#FFD700] hover:text-[#748D19]"
            onClick={onMenuClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>

          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-2xl font-bold text-white">
                PE
              </span>
              <img
                src="https://api.iconify.design/fluent-emoji-flat:whistle.svg"
                alt="صافرة"
                className="h-8 w-8 md:h-10 md:w-10"
              />
              <span className="text-lg md:text-2xl font-bold text-white hidden md:inline">
                COMMUNITY
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            className={buttonClasses}
            onClick={() => navigate("/home")}
          >
            المحتوى
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className={buttonClasses}>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>التقويم</span>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>التقويم الرياضي</DialogTitle>
              </DialogHeader>
              <Calendar className="border-none shadow-none" />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className={buttonClasses}>
                اتصل بنا
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>اتصل بنا</DialogTitle>
              </DialogHeader>
              <Contact />
            </DialogContent>
          </Dialog>
        </nav>

        {/* Auth Section - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" className={buttonClasses}>
                    لوحة التحكم
                  </Button>
                </Link>
              )}
              <Link to="/profile">
                <Button variant="ghost" className={buttonClasses}>
                  الملف الشخصي
                </Button>
              </Link>
              <Button
                variant="ghost"
                className={buttonClasses}
                onClick={handleLogout}
              >
                تسجيل خروج
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#748D19] text-sm px-4 py-2">
                تسجيل الدخول
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
