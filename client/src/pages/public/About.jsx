import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-black">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A developer dedicated to building clean, accessible, and high-performance web solutions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-5 flex justify-center"
          >
            <div className="glass-card p-3 rounded-3xl relative">
              <img
                src="/Profile.png"
                alt="Mayuresh Kasar"
                className="w-full h-80 object-cover rounded-2xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-7 space-y-6"
          >
            <h3 className="text-2xl font-bold text-sky-400">
              Full Stack Engineer
            </h3>

            <p className="text-gray-300 leading-relaxed font-light">
              I specialize in developing modern web applications from ideation to deployment[cite: 5, 6]. My focus is on writing maintainable, well-structured code that brings smooth user experiences on the frontend and solid database design on the backend[cite: 5, 6].
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm pt-2">
              <div className="glass-card p-4 rounded-xl">
                <span className="text-gray-500 block">Name</span>
                <span className="font-medium text-white">Mayuresh Kasar</span>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <span className="text-gray-500 block">Location</span>
                <span className="font-medium text-white">Maharashtra, India</span>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <span className="text-gray-500 block">Email</span>
                <span className="font-medium text-white truncate block">kasarmayuresh99@gmail.com</span>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <span className="text-gray-500 block">Status</span>
                <span className="font-medium text-emerald-400">Available for Hire</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}