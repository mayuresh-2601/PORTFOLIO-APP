import db from "../config/db.js";

export const getSkills = async () => {
  const [rows] = await db.execute("SELECT * FROM skills ORDER BY id DESC");
  return rows || [];
};

export const addSkill = async (name, level = 80) => {
  const sql = "INSERT INTO skills (name, level) VALUES (?, ?)";
  const [result] = await db.execute(sql, [name, level]);
  return result;
};

export const deleteSkill = async (id) => {
  const [result] = await db.execute("DELETE FROM skills WHERE id = ?", [id]);
  return result;
};