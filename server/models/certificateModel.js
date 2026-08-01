import db from "../config/db.js";

export const getCertificates = async () => {
  const [rows] = await db.execute("SELECT * FROM certificates ORDER BY id DESC");
  return rows || [];
};

export const addCertificate = async (cert) => {
  const sql = `
    INSERT INTO certificates (title, issuer, image, link)
    VALUES (?, ?, ?, ?)
  `;
  const values = [cert.title, cert.issuer, cert.image, cert.link];
  const [result] = await db.execute(sql, values);
  return result;
};

export const deleteCertificate = async (id) => {
  const [result] = await db.execute("DELETE FROM certificates WHERE id = ?", [id]);
  return result;
};