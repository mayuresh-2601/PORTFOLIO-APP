import {
  getSkills,
  addSkill,
  deleteSkill,
} from "../models/skillModel.js";

/* 
   Get All Skills
 */

export const fetchSkills = async (req, res, next) => {
  try {
    const skills = await getSkills();

    return res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

/* 
   Create Skill
 */

export const createSkill = async (req, res, next) => {
  try {
    const { name, level } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required.",
      });
    }

    // Validate level
    let skillLevel = Number(level);

    if (Number.isNaN(skillLevel)) {
      skillLevel = 80;
    }

    if (skillLevel < 0 || skillLevel > 100) {
      return res.status(400).json({
        success: false,
        message: "Skill level must be between 0 and 100.",
      });
    }

    const result = await addSkill(
      name.trim(),
      skillLevel
    );

    return res.status(201).json({
      success: true,
      message: "Skill created successfully.",
      id: result.id,
    });
  } catch (error) {
    next(error);
  }
};

/* 
   Delete Skill
 */

export const removeSkill = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID.",
      });
    }

    const result = await deleteSkill(id);

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};