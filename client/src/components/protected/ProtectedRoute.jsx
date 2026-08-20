import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api/axios";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        const csrfResponse = await api.get("/auth/csrf");
        sessionStorage.setItem("csrfToken", csrfResponse.data.csrfToken);
        await api.get("/auth/me");
        if (active) setStatus("authenticated");
      } catch {
        sessionStorage.removeItem("csrfToken");
        if (active) setStatus("unauthenticated");
      }
    };

    verifySession();
    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <section className="min-h-screen flex items-center justify-center text-gray-400">
        Verifying admin session...
      </section>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin" replace />;
  }

  return children ?? null;
}
