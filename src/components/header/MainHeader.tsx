import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import AuthDialog from "@/components/auth/AuthDialog";
import { getCurrentUser, signOut } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

const MainHeader = () => {
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    toast({
      description: "تم تسجيل الخروج بنجاح",
    });
  };

  return (
    <header className="bg-[#7C9D32] text-white py-4 px-6 shadow-md sticky top-0 z-50">
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
          <h1 className="text-2xl font-display tracking-wide hidden sm:block">
            PE COMMUNITY
          </h1>
          <h1 className="text-2xl font-display tracking-wide sm:hidden">PE</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:bg-[#8fb339] hover:text-white"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-2">
                    <h3 className="font-bold">الإشعارات</h3>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                          <div className="h-8 w-8 rounded-full bg-[#7C9D32] flex items-center justify-center text-white">
                            !
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              تم إضافة محتوى جديد
                            </p>
                            <p className="text-xs text-gray-500">
                              تم إضافة درس جديد في المرحلة الابتدائية
                            </p>
                          </div>
                        </div>
                      ))}
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
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-3">
                    <div className="border-b pb-2">
                      <p className="font-medium">مرحباً بك</p>
                      <p className="text-sm text-gray-500">user@example.com</p>
                    </div>
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start">
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
