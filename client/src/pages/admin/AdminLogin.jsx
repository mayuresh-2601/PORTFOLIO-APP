import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LoaderCircle } from "lucide-react";
import api from "../../api/axios";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    const email = form.email.trim();

    if (!email || !form.password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", {
        email,
        password: form.password,
      });

      localStorage.setItem("token", data.token);

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-[#030712]">
      <form
        onSubmit={handleLogin}
        className="glass-card w-full max-w-md rounded-3xl p-8 space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/30">
            <ShieldCheck className="text-sky-400" size={30} />
          </div>

          <h1 className="text-3xl font-black text-gradient">
            Admin Portal
          </h1>

          <p className="text-sm text-gray-400">
            Sign in to manage your portfolio dashboard.
          </p>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          disabled={loading}
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-gray-500 focus:border-sky-500 focus:outline-none disabled:opacity-60"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          disabled={loading}
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white placeholder:text-gray-500 focus:border-sky-500 focus:outline-none disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-4 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <LoaderCircle className="animate-spin" size={18} />
              Authenticating...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </section>
  );
}