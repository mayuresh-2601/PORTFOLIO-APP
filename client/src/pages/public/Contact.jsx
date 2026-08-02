import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import api from "../../api/axios";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status.loading) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.subject ||
      !payload.message
    ) {
      setStatus({
        loading: false,
        success: "",
        error: "Please fill in all required fields.",
      });
      return;
    }

    try {
      setStatus({
        loading: true,
        success: "",
        error: "",
      });

      const { data } = await api.post("/messages", payload);

      setStatus({
        loading: false,
        success:
          data?.message || "Your message has been sent successfully!",
        error: "",
      });

      resetForm();
    } catch (error) {
      setStatus({
        loading: false,
        success: "",
        error:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section className="min-h-screen bg-[#030712] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-8 md:p-10"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/20">
              <Mail size={30} className="text-sky-400" />
            </div>

            <h2 className="text-4xl font-black text-white">
              Get In <span className="text-gradient">Touch</span>
            </h2>

            <p className="mt-3 text-gray-400">
              Have a project idea, freelance opportunity, or collaboration?
              Feel free to send me a message.
            </p>
          </div>

          {status.success && (
            <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
              {status.success}
            </div>
          )}

          {status.error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">


              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  disabled={status.loading}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-sky-500 focus:outline-none disabled:opacity-60"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  disabled={status.loading}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-sky-500 focus:outline-none disabled:opacity-60"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Subject
              </label>

              <input
                type="text"
                name="subject"
                disabled={status.loading}
                value={formData.subject}
                onChange={handleChange}
                placeholder="Project Discussion"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-sky-500 focus:outline-none disabled:opacity-60"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Message
              </label>

              <textarea
                rows={6}
                name="message"
                disabled={status.loading}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-sky-500 focus:outline-none disabled:opacity-60"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: status.loading ? 1 : 1.02 }}
              whileTap={{ scale: status.loading ? 1 : 0.98 }}
              type="submit"
              disabled={status.loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-4 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Send size={18} />

              {status.loading ? "Sending Message..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}