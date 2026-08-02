import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, FolderOpen } from "lucide-react";
import api from "../../api/axios";
import GithubIcon from "../../assets/GithubIcon";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/projects");

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Heading */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black">
            Featured <span className="text-gradient">Projects</span>
          </h2>

          <p className="max-w-2xl mx-auto text-gray-400">
            Explore some of my featured full-stack applications built using
            React.js, Node.js, Express.js, MySQL/TiDB, and modern web
            technologies with a focus on performance, scalability, and user
            experience.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-gray-400">
            Loading projects...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="glass-card rounded-2xl border border-red-500/20 p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-400">
              Failed to Load Projects
            </h3>

            <p className="text-gray-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <FolderOpen
              size={50}
              className="mx-auto mb-4 text-sky-400"
            />

            <h3 className="mb-2 text-2xl font-bold text-white">
              No Projects Available
            </h3>

            <p className="text-gray-400">
              Projects will appear here once they are added from the admin
              dashboard.
            </p>
          </div>
        )}

        {/* Project Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group glass-card overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-2"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={project.image || "/placeholder-project.png"}
                    alt={project.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-project.png";
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-4 p-6">
                  <h3 className="text-xl font-bold text-white">
                    {project.title}
                  </h3>

                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-5 pt-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View source code for ${project.title}`}
                        className="flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-sky-400"
                      >
                        <GithubIcon size={16} />
                        Source Code
                      </a>
                    )}

                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View live demo for ${project.title}`}
                        className="flex items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-emerald-400"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
