import {
  getCertificates,
  addCertificate,
  deleteCertificate,
} from "../models/certificateModel.js";

/* 
   Get All Certificates
 */

export const fetchCertificates = async (req, res, next) => {
  try {
    const certificates = await getCertificates();

    return res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

/* 
   Create Certificate
 */

export const createCertificate = async (req, res, next) => {
  try {
    const { title, issuer, link } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Certificate title is required.",
      });
    }

    const certificate = {
      title: title.trim(),
      issuer: issuer?.trim() || "Unknown",
      image: req.file ? req.file.path : null,
      link: link?.trim() || null,
    };

    const result = await addCertificate(certificate);

    return res.status(201).json({
      success: true,
      message: "Certificate created successfully.",
      id: result.id,
    });
  } catch (error) {
    next(error);
  }
};

/* 
   Delete Certificate
 */

export const removeCertificate = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID.",
      });
    }

    const result = await deleteCertificate(id);

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};