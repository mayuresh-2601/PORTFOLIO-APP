import {
  getCertificates,
  addCertificate,
  deleteCertificate,
} from "../models/certificateModel.js";

export const fetchCertificates = async (req, res) => {
  try {
    const certificates = await getCertificates();
    return res.status(200).json(certificates);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch certificates" });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const { title, issuer, link } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const certificate = {
      title: title.trim(),
      issuer: issuer || "",
      image: req.file ? req.file.path : null,
      link: link || "",
    };

    const result = await addCertificate(certificate);

    return res.status(201).json({
      success: true,
      message: "Certificate added",
      id: result?.insertId || null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add certificate" });
  }
};

export const removeCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCertificate(id);
    return res.status(200).json({ success: true, message: "Certificate deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete certificate" });
  }
};