import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Get authentication token from localStorage
  const token = localStorage.getItem("token");

  // Redirect to admin login if token is missing or invalid
  if (!token || token.trim() === "") {
    return <Navigate to="/admin" replace />;
  }

  // Render protected content
  return children ?? null;
}