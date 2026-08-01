import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleLogin} className="glass-card p-8 rounded-3xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-black text-center text-gradient">Admin Portal</h2>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-sky-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-sky-500 rounded-xl font-semibold text-white hover:bg-sky-600 transition"
        >
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </section>
  );
}