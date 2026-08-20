import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Code, Folder, Award, Mail, Shield, Menu, X, Activity } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/about", icon: User },
  { name: "Skills", path: "/skills", icon: Code },
  { name: "Projects", path: "/projects", icon: Folder },
  { name: "Certificates", path: "/certificates", icon: Award },
  { name: "System", path: "/system", icon: Activity },
  { name: "Contact", path: "/contact", icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3 glass-panel shadow-2xl" : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tight text-gradient">
          Mayuresh<span className="text-sky-400">.dev</span>
        </Link>

        <ul className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-sky-500/10 border border-sky-500/30 rounded-full"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <Icon size={16} className={isActive ? "text-sky-400" : ""} />
                  {link.name}
                </Link>
              </li>
            );
          })}

          <li>
              <Link
                to="/admin/dashboard"
                className="ml-4 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-amber-500/20 transition"
              >
                <Shield size={16} /> Admin
              </Link>
            </li>
        </ul>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl glass-card text-gray-300 hover:text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-b border-white/10"
          >
            <div className="px-6 py-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition"
                >
                  <link.icon size={18} className="text-sky-400" />
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}