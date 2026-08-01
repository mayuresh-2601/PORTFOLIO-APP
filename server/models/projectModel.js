import db from "../config/db.js";

export const getAllProjects = async () => {
  const [rows] = await db.execute("SELECT * FROM projects ORDER BY id DESC");
  return rows || [];
};

export const getProjectById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM projects WHERE id = ?", [id]);
  return rows && rows.length ? rows[0] : null;
};

export const addProject = async (project) => {
  const sql = `
    INSERT INTO projects (title, description, github, demo, image)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    project.title,
    project.description,
    project.github,
    project.demo,
    project.image,
  ];
  const [result] = await db.execute(sql, values);
  return result;
};

export const updateProject = async (id, project) => {
  const sql = `
    UPDATE projects
    SET title = ?, description = ?, github = ?, demo = ?, image = COALESCE(?, image)
    WHERE id = ?
  `;
  const values = [
    project.title,
    project.description,
    project.github,
    project.demo,
    project.image,
    id,
  ];
  const [result] = await db.execute(sql, values);
  return result;
};

export const deleteProject = async (id) => {
  const [result] = await db.execute("DELETE FROM projects WHERE id = ?", [id]);
  return result;
};