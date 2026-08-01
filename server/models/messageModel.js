import db from "../config/db.js";

export const addMessage = async (data) => {
  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  const [result] = await db.execute(sql, [data.name, data.email, data.message]);
  return result;
};

export const getMessages = async () => {
  const [rows] = await db.execute("SELECT * FROM messages ORDER BY id DESC");
  return rows || [];
};