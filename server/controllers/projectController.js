import {
  getAllProjects,
  addProject,
  deleteProject,
  updateProject,
  getProjectById
} from "../models/projectModel.js";

export const fetchProjects = async (req, res) => {
  try {
    const projects = await getAllProjects();
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, github, demo } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title & description are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image upload is required" });
    }

    const project = {
      title: title.trim(),
      description: description.trim(),
      github: github || "",
      demo: demo || "",
      image: req.file.path,
    };

    const dbResult = await addProject(project);

    return res.status(201).json({
      success: true,
      message: "Project added successfully",
      id: dbResult?.insertId || null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add project" });
  }
};

export const updateProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, github, demo } = req.body;

    let existingProject = await getProjectById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const imageUrl = req.file ? req.file.path : existingProject.image;

    const project = {
      title: title.trim(),
      description: description.trim(),
      github: github || "",
      demo: demo || "",
      image: imageUrl,
    };

    await updateProject(id, project);
    return res.status(200).json({ success: true, message: "Project updated" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update project" });
  }
};

export const removeProject = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProject(id);
    return res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete project" });
  }
};