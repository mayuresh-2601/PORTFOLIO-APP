import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Award, Sparkles } from "lucide-react";
import api from "../../api/axios";
import AIExplainModal from "../../components/common/AIExplainModal";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCert, setActiveCert] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/certificates");

      // Supports both:
      // [{...}]
      // { success:true, data:[...] }
      const certificatesData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setCertificates(certificatesData);
    } catch (err) {
      console.error("Failed to fetch certificates:", err);

      setCertificates([]);

      setError(
        err.response?.data?.message ||
          "Unable to load certificates. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen px-6 pb-20 pt-32">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Heading */}
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-black md:text-5xl">
            My <span className="text-gradient">Certificates</span>
          </h2>

          <p className="mx-auto max-w-xl text-gray-400">
            Licenses, certifications, and technical accomplishments.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-gray-400">
            Loading certificates...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="glass-card rounded-2xl border border-red-500/20 p-8 text-center">
            <h3 className="mb-2 text-xl font-bold text-red-400">
              Failed to Load Certificates
            </h3>

            <p className="text-gray-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && certificates.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <Award size={48} className="mx-auto mb-4 text-sky-400" />

            <h3 className="mb-2 text-2xl font-bold text-white">
              No Certificates Available
            </h3>

            <p className="text-gray-400">
              Certificates will appear here after being added from the admin dashboard.
            </p>
          </div>
        )}

        {/* Certificates Grid */}
        {!loading && !error && certificates.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass-card flex flex-col justify-between overflow-hidden rounded-2xl p-6"
              >
                {cert.image && (
                  <div className="mb-5 h-44 overflow-hidden rounded-xl bg-white/5">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-sky-400">
                    <Award size={16} />
                    {cert.issuer}
                  </div>

                  <button
                    onClick={() => setActiveCert(cert)}
                    className="group flex items-center gap-2 text-left text-xl font-bold text-white transition hover:text-sky-400"
                    title="Ask AI to explain this certificate"
                  >
                    {cert.title}
                    <Sparkles
                      size={14}
                      className="text-sky-400 opacity-0 transition group-hover:opacity-100"
                    />
                  </button>
                </div>

                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-sky-400"
                  >
                    View Credential
                    <ExternalLink size={16} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AIExplainModal
        open={!!activeCert}
        onClose={() => setActiveCert(null)}
        title={activeCert ? activeCert.title : ""}
        endpoint="/ai/explain-certificate"
        payload={activeCert ? { title: activeCert.title, issuer: activeCert.issuer } : {}}
      />
    </section>
  );
}