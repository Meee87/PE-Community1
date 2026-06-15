import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainHeader from "./components/header/MainHeader";
import MobileNav from "./components/MobileNav";
import AIAssistant from "./components/ai/AIAssistant";

// تحميل كسول للصفحات (تقسيم الـ bundle → تحميل أسرع)
const LandingPage = lazy(() => import("./components/landing/LandingPage"));
const AuthForm = lazy(() => import("./components/auth/AuthForm"));
const Home = lazy(() => import("./components/home"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const Profile = lazy(() => import("./components/profile/Profile"));
const ContentSection = lazy(() => import("./components/content/ContentSection"));
const UploadGuide = lazy(() => import("./components/UploadGuide"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));
const DeleteAccountConfirmation = lazy(
  () => import("./components/DeleteAccountConfirmation"),
);
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-[#8A1538]/20 border-t-[#8A1538] animate-spin" />
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-0 md:pt-16 pb-16 md:pb-0">
      <MainHeader />
      <MobileNav />
      <AIAssistant />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/stage/:stageId" element={<ContentSection />} />
            <Route path="/upload-guide" element={<UploadGuide />} />
            <Route
              path="/account-deleted"
              element={<DeleteAccountConfirmation />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
