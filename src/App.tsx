import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import MainHeader from "./components/header/MainHeader";
import MobileNav from "./components/MobileNav";
import Home from "./components/home";
import LandingPage from "./components/landing/LandingPage";
import Profile from "./components/profile/Profile";
import ContentSection from "./components/content/ContentSection";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#F8FAF5] pt-0 md:pt-16 pb-16 md:pb-0">
        <MainHeader />
        <MobileNav />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/stage/:stageId" element={<ContentSection />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
