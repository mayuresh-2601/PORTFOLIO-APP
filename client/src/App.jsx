import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Skills from "./pages/public/Skills";
import Projects from "./pages/public/Projects";
import Certificates from "./pages/public/Certificates";
import Contact from "./pages/public/Contact";
import System from "./pages/public/System";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/protected/ProtectedRoute";

function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-4 text-7xl font-black text-gradient">404</h1>

      <h2 className="mb-3 text-3xl font-bold text-white">
        Page Not Found
      </h2>

      <p className="max-w-md text-gray-400">
        The page you are looking for doesn't exist or may have been moved.
      </p>
    </section>
  );
}

export default function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-[#030712] text-gray-100">
      {!isAdminRoute && <Navbar />}

      <main className="grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/system" element={<System />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}