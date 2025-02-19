import React from "react";
import { Calendar } from "@/components/ui/calendar";
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
  Calendar as CalendarIcon,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

const MainHeader = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-[#7C9D32] text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-display tracking-wide">PE COMMUNITY</h1>
        </div>
        <div className="flex items-center gap-4">
          {location.pathname !== "/" && (
            <Button
              variant="outline"
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#7C9D32]"
              onClick={() => navigate("/")}
            >
              الرئيسية
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Calendar */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#7C9D32]"
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                التقويم
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>

          {/* Contact Us */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#7C9D32]"
              >
                اتصل بنا
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-4">
                  اتصل بنا
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#7C9D32]">
                  <Mail className="h-5 w-5" />
                  <a
                    href="mailto:contact@pecommunity.com"
                    className="hover:underline"
                  >
                    contact@pecommunity.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-[#7C9D32]">
                  <Phone className="h-5 w-5" />
                  <a href="tel:+966500000000" className="hover:underline">
                    +966 50 000 0000
                  </a>
                </div>
                <div className="flex items-center gap-3 text-[#7C9D32]">
                  <MessageCircle className="h-5 w-5" />
                  <span>متاح للدردشة من 8 صباحاً - 4 مساءً</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
