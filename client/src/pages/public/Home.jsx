import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import GithubIcon from "../../assets/GithubIcon";
import LinkedinIcon from "../../assets/LinkedinIcon";

export default function Home() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-7 space-y-6 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sky-400 text-sm">
            <Sparkles size={16} /> Open for Full Stack Opportunities
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            Hi, I'm <br />
            <span className="text-gradient">Mayuresh Kasar</span>
          </h1>

          <h2 className="text-xl md:text-2xl text-gray-300 font-light">
            Full Stack Developer | React, Node.js & MySQL
          </h2>

          <p className="text-gray-400 leading-relaxed max-w-2xl text-base">
            I engineer modern, performant, and scalable web applications backed by clean architecture and optimized database schemas.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
            <Link
              to="/projects"
              className="px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl font-semibold text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] transition flex items-center gap-2"
            >
              Explore Projects <ArrowRight size={18} />
            </Link>

            <a
              href="/Mayuresh_Kasar_Resume.pdf"
              download
              className="px-8 py-4 glass-card rounded-2xl font-semibold text-gray-200 hover:text-white transition flex items-center gap-2"
            >
              Resume <Download size={18} />
            </a>
          </div>

          <div className="flex gap-4 pt-4 justify-center md:justify-start">
            <a href="https://github.com/mayuresh-2601" target="_blank" rel="noreferrer" className="p-3.5 glass-card rounded-2xl text-gray-400 hover:text-sky-400 transition">
              <GithubIcon size={20} />
            </a>
            <a href="https://www.linkedin.com/in/mayuresh2601/" target="_blank" rel="noreferrer" className="p-3.5 glass-card rounded-2xl text-gray-400 hover:text-sky-400 transition">
              <LinkedinIcon size={20} />
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:col-span-5 flex justify-center"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-purple-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition duration-1000" />
            <div className="relative rounded-3xl overflow-hidden glass-card p-3">
              <img
                src="/Profile.png"
                alt="Mayuresh Kasar"
                className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-2xl grayscale group-hover:grayscale-0 transition duration-500"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}