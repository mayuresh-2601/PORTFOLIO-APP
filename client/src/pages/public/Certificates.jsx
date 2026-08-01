import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import api from "../../api/axios";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/certificates")
      .then((res) => setCertificates(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black">
            My <span className="text-gradient">Certificates</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Licenses, certifications, and technical accomplishments.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading certificates...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between p-6 space-y-4"
              >
                {cert.image && (
                  <div className="h-44 rounded-xl overflow-hidden bg-white/5">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 text-sm font-medium">
                    <Award size={16} /> {cert.issuer}
                  </div>
                  <h3 className="text-xl font-bold text-white">{cert.title}</h3>
                </div>

                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-sky-400 transition pt-2"
                  >
                    View Credential <ExternalLink size={16} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}