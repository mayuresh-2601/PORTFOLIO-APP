import { Mail, Heart } from "lucide-react";
import GithubIcon from "../../assets/GithubIcon";
import LinkedinIcon from "../../assets/LinkedinIcon";

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-white/10 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gradient">Mayuresh Kasar</h2>
            <p className="text-sm mt-1 text-gray-400 font-light">
              Full Stack Developer | React, Node.js & MySQL
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://github.com/mayuresh-2601"
              target="_blank"
              rel="noreferrer"
              className="p-3 glass-card rounded-xl hover:text-sky-400 transition"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/mayuresh2601/"
              target="_blank"
              rel="noreferrer"
              className="p-3 glass-card rounded-xl hover:text-sky-400 transition"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href="mailto:kasarmayuresh99@gmail.com"
              className="p-3 glass-card rounded-xl hover:text-sky-400 transition"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 my-6" />

        <div className="text-center text-sm text-gray-500 flex justify-center items-center gap-2">
          © {new Date().getFullYear()} Mayuresh Kasar. Built with
          <Heart size={14} className="text-red-500 inline fill-red-500" />
        </div>
      </div>
    </footer>
  );
}