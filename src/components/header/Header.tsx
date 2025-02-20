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
      setIsAdmin(session?.user?.email === "eng.mohamed87@live.com");

      if (session?.user) {
        // Check if profile exists, if not create it
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!profile && !profileError) {
          await supabase.from("profiles").insert([
            {
              id: session.user.id,
              username: session.user.email?.split("@")[0],
              full_name: session.user.user_metadata?.full_name || "",
              email: session.user.email,
              role: "user",
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
              school: "",
              specialization: "",
              years_of_experience: "",
            },
          ]);
        }
      }
    };
    checkAuth();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setIsAdmin(session?.user?.email === "eng.mohamed87@live.com");
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
  };

  const buttonClasses =
    "text-xs sm:text-sm font-medium text-white hover:bg-[#FFD700] hover:text-[#748D19] px-2 py-2 sm:px-4 rounded-md transition-colors";

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#748D19] shadow-sm z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
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
            <img src="/vite.svg" alt="Logo" className="h-6 w-6" />
            <span className="text-base sm:text-lg font-bold hidden sm:inline tracking-wider cursor-pointer text-white">
              PE COMMUNITY
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4">
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

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className={buttonClasses}>
                <div className="flex items-center gap-2 no-reverse">
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

          <Button
            variant="ghost"
            className={buttonClasses}
            onClick={() => navigate("/home")}
          >
            المحتوى
          </Button>
        </nav>

        <div className="flex items-center gap-2">
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
                  الملف
                </Button>
              </Link>
              <Button
                variant="ghost"
                className={buttonClasses}
                onClick={handleLogout}
              >
                خروج
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button className="bg-white hover:bg-gray-100 text-[#748D19] text-xs sm:text-sm px-2 py-2 sm:px-4">
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
