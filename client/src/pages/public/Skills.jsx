import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Sparkles } from "lucide-react";
import api from "../../api/axios";
import AIExplainModal from "../../components/common/AIExplainModal";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSkill, setActiveSkill] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/skills");

      // Supports both:
      // [{...}]
      // { success:true, data:[...] }
      const skillsData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setSkills(skillsData);
    } catch (err) {
      console.error("Failed to fetch skills:", err);

      setSkills([]);

      setError(
        err.response?.data?.message ||
          "Unable to load skills. Please try again later."
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
            Technical <span className="text-gradient">Skills</span>
          </h2>

          <p className="mx-auto max-w-2xl text-gray-400">
            A collection of technologies, programming languages,
            frameworks, databases, and development tools I use to
            build secure, scalable, and modern web applications.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-gray-400">
            Loading skills...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="glass-card rounded-2xl border border-red-500/20 p-8 text-center">
            <h3 className="mb-2 text-xl font-bold text-red-400">
              Failed to Load Skills
            </h3>

            <p className="text-gray-400">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && skills.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <Code2
              size={48}
              className="mx-auto mb-4 text-sky-400"
            />

            <h3 className="mb-2 text-2xl font-bold text-white">
              No Skills Available
            </h3>

            <p className="text-gray-400">
              Skills will appear here after being added from the admin dashboard.
            </p>
          </div>
        )}

        {/* Skills */}
        {!loading && !error && skills.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={() => setActiveSkill(skill)}
                    className="group flex items-center gap-2 text-left text-lg font-semibold text-white transition hover:text-sky-400"
                    title="Ask AI to explain this skill"
                  >
                    {skill.name}
                    <Sparkles
                      size={14}
                      className="text-sky-400 opacity-0 transition group-hover:opacity-100"
                    />
                  </button>

                  <span className="font-semibold text-sky-400">
                    {skill.level ?? 80}%
                  </span>
                </div>

                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-white/5"
                  role="progressbar"
                  aria-label={skill.name}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={skill.level ?? 80}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${skill.level ?? 80}%`,
                    }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AIExplainModal
        open={!!activeSkill}
        onClose={() => setActiveSkill(null)}
        title={activeSkill ? `What is ${activeSkill.name}?` : ""}
        endpoint="/ai/explain-skill"
        payload={activeSkill ? { name: activeSkill.name, level: activeSkill.level } : {}}
      />
    </section>
  );
}