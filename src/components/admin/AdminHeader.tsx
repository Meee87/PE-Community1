import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AdminHeader() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#748D19] text-white py-4 px-4 md:px-6 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">لوحة التحكم</h1>
          <Button
            variant="outline"
            className="md:hidden bg-white hover:bg-gray-50 text-[#748D19] flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="hidden md:flex bg-white hover:bg-gray-50 text-[#748D19] items-center gap-2"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4" />
          الرئيسية
        </Button>
      </div>
    </div>
  );
}
