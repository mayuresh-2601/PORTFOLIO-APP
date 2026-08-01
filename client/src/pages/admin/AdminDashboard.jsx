import { useState, useEffect } from "react";
import { Trash2, Upload, LogOut, Plus } from "lucide-react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [projectForm, setProjectForm] = useState({ title: "", description: "", github: "", demo: "", imageFile: null });
  const [skillForm, setSkillForm] = useState({ name: "", level: 80 });
  const [certForm, setCertForm] = useState({ title: "", issuer: "", link: "", imageFile: null });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pRes, sRes, cRes] = await Promise.all([
        api.get("/projects"),
        api.get("/skills"),
        api.get("/certificates"),
      ]);
      setProjects(pRes.data);
      setSkills(sRes.data);
      setCertificates(cRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const addProject = async () => {
    if (!projectForm.title || !projectForm.imageFile) return alert("Title & Image required");
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", projectForm.title);
      data.append("description", projectForm.description);
      data.append("github", projectForm.github);
      data.append("demo", projectForm.demo);
      data.append("image", projectForm.imageFile);

      await api.post("/projects", data);
      setProjectForm({ title: "", description: "", github: "", demo: "", imageFile: null });
      loadData();
    } catch (err) {
      alert("Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (endpoint, id) => {
    if (!window.confirm("Confirm deletion?")) return;
    await api.delete(`/${endpoint}/${id}`);
    loadData();
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center glass-panel p-6 rounded-2xl">
        <h1 className="text-3xl font-black text-gradient">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/20 transition flex items-center gap-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* PROJECTS CONTROL */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Plus size={18} /> Manage Projects</h2>
          <input
            placeholder="Project Title"
            value={projectForm.title}
            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          />
          <textarea
            placeholder="Description"
            value={projectForm.description}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          />
          <input
            placeholder="GitHub Link"
            value={projectForm.github}
            onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          />
          <input
            placeholder="Live Demo Link"
            value={projectForm.demo}
            onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          />
          <label className="flex items-center gap-2 p-3 rounded-xl glass-card text-gray-400 text-sm cursor-pointer border border-dashed border-white/20">
            <Upload size={16} />
            <span>{projectForm.imageFile ? projectForm.imageFile.name : "Upload Image"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProjectForm({ ...projectForm, imageFile: e.target.files[0] })}
              className="hidden"
            />
          </label>
          <button
            onClick={addProject}
            disabled={loading}
            className="w-full py-3 bg-sky-500 rounded-xl text-sm font-semibold text-white hover:bg-sky-600 transition"
          >
            Add Project
          </button>

          <div className="space-y-2 pt-4">
            {projects.map((p) => (
              <div key={p.id} className="flex justify-between items-center p-3 glass-panel rounded-xl text-sm">
                <span className="truncate max-w-[200px]">{p.title}</span>
                <button onClick={() => deleteItem("projects", p.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SKILLS CONTROL */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Plus size={18} /> Manage Skills</h2>
          <input
            placeholder="Skill Name"
            value={skillForm.name}
            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          />
          <input
            type="number"
            placeholder="Proficiency %"
            value={skillForm.level}
            onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          />
          <button
            onClick={async () => {
              if (!skillForm.name) return;
              await api.post("/skills", skillForm);
              setSkillForm({ name: "", level: 80 });
              loadData();
            }}
            className="w-full py-3 bg-indigo-500 rounded-xl text-sm font-semibold text-white hover:bg-indigo-600 transition"
          >
            Add Skill
          </button>

          <div className="space-y-2 pt-4">
            {skills.map((s) => (
              <div key={s.id} className="flex justify-between items-center p-3 glass-panel rounded-xl text-sm">
                <span>{s.name} ({s.level}%)</span>
                <button onClick={() => deleteItem("skills", s.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CERTIFICATES CONTROL */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Plus size={18} /> Manage Certificates</h2>
          <input
            placeholder="Certificate Title"
            value={certForm.title}
            onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          />
          <input
            placeholder="Issuer"
            value={certForm.issuer}
            onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          />
          <input
            placeholder="Certificate Link"
            value={certForm.link}
            onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
          />
          <label className="flex items-center gap-2 p-3 rounded-xl glass-card text-gray-400 text-sm cursor-pointer border border-dashed border-white/20">
            <Upload size={16} />
            <span>{certForm.imageFile ? certForm.imageFile.name : "Upload Image"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCertForm({ ...certForm, imageFile: e.target.files[0] })}
              className="hidden"
            />
          </label>
          <button
            onClick={async () => {
              if (!certForm.title || !certForm.imageFile) return alert("Title & Image required");
              const data = new FormData();
              data.append("title", certForm.title);
              data.append("issuer", certForm.issuer);
              data.append("link", certForm.link);
              data.append("image", certForm.imageFile);
              await api.post("/certificates", data);
              setCertForm({ title: "", issuer: "", link: "", imageFile: null });
              loadData();
            }}
            className="w-full py-3 bg-purple-500 rounded-xl text-sm font-semibold text-white hover:bg-purple-600 transition"
          >
            Add Certificate
          </button>

          <div className="space-y-2 pt-4">
            {certificates.map((c) => (
              <div key={c.id} className="flex justify-between items-center p-3 glass-panel rounded-xl text-sm">
                <span className="truncate max-w-[200px]">{c.title}</span>
                <button onClick={() => deleteItem("certificates", c.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}