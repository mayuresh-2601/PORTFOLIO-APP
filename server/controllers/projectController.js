import {
  getAllProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
} from "../models/projectModel.js";

/* 
   Get All Projects
 */

export const fetchProjects = async (req, res, next) => {
  try {
    const projects = await getAllProjects();

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/* 
   Create Project
 */

export const createProject = async (req, res, next) => {
  try {
    const { title, description, github, demo } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title and description are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Project image is required.",
      });
    }

    const project = {
      title: title.trim(),
      description: description.trim(),
      github: github?.trim() || null,
      demo: demo?.trim() || null,
      image: req.file.path,
    };

    const result = await addProject(project);

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      id: result.id,
    });
  } catch (error) {
    next(error);
  }
};

/* 
   Update Project
 */

export const updateProjectById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const existingProject = await getProjectById(id);

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const project = {
      title: req.body.title?.trim() || existingProject.title,
      description:
        req.body.description?.trim() ||
        existingProject.description,

      github:
        req.body.github?.trim() ??
        existingProject.github,

      demo:
        req.body.demo?.trim() ??
        existingProject.demo,

      image: req.file
        ? req.file.path
        : existingProject.image,
    };

    const result = await updateProject(id, project);

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/* 
   Delete Project
 */

export const removeProject = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const result = await deleteProject(id);

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};