import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import GithubIcon from "../../assets/GithubIcon";
import LinkedinIcon from "../../assets/LinkedinIcon";

export default function Home() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-[350px] w-[350px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-12">
        {/* ================= LEFT CONTENT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-center md:col-span-7 md:text-left"
        >
          <div className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-sky-400">
            <Sparkles size={16} />
            Available for Full Stack & Software Engineering Opportunities
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Hi, I'm <br />
            <span className="text-gradient">Mayuresh Kasar</span>
          </h1>

          <h2 className="text-xl font-light text-gray-300 md:text-2xl">
            Full Stack Developer • React.js • Node.js • Express.js • Linux
          </h2>

          <p className="max-w-2xl leading-relaxed text-gray-400">
            Passionate Full Stack Developer specializing in building secure,
            scalable, and responsive web applications using React.js, Node.js,
            Express.js, JavaScript, and MySQL/TiDB. Experienced in developing
            RESTful APIs, implementing JWT authentication, and creating modern
            user experiences with clean, maintainable code.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2 md:justify-start">
            <Link
              to="/projects"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:scale-[1.02] hover:shadow-sky-500/40"
            >
              Explore Projects
              <ArrowRight size={18} />
            </Link>

            <a
              href="/Mayuresh_Kasar_Resume.pdf"
              download
              aria-label="Download Resume"
              className="glass-card flex items-center gap-2 rounded-2xl px-8 py-4 font-semibold text-gray-200 transition hover:text-white"
            >
              Download Resume
              <Download size={18} />
            </a>
          </div>

          <div className="flex justify-center gap-4 pt-4 md:justify-start">
            <a
              href="https://github.com/mayuresh-2601"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="glass-card rounded-2xl p-3.5 text-gray-400 transition hover:text-sky-400"
            >
              <GithubIcon size={20} />
            </a>

            <a
              href="https://www.linkedin.com/in/mayuresh2601/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="glass-card rounded-2xl p-3.5 text-gray-400 transition hover:text-sky-400"
            >
              <LinkedinIcon size={20} />
            </a>

          </div>
        </motion.div>

        {/* ================= RIGHT CONTENT ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center md:col-span-5"
        >
          <div className="group relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 opacity-30 blur-2xl transition duration-1000 group-hover:opacity-60" />

            <div className="glass-card relative overflow-hidden rounded-3xl p-3">
              <img
                src="/Profile.png"
                alt="Mayuresh Kasar - Full Stack Developer"
                loading="eager"
                decoding="async"
                draggable={false}
                className="h-72 w-72 rounded-2xl object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0 md:h-80 md:w-80"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}