import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/landing/LandingPage";
import Home from "./components/home";
import routes from "tempo-routes";
import Header from "./components/header/Header";
import ContentSection from "./components/content/ContentSection";
import Login from "./components/auth/login";
import Profile from "./components/profile/Profile";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Header />
      <div className="pt-14 min-h-screen bg-[#7C9D32]/10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/stage/:stageId" element={<ContentSection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={<Navigate to="/" />} />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </div>
    </Suspense>
  );
}

export default App;
