import { getSkills, addSkill, deleteSkill } from "../models/skillModel.js";

export const fetchSkills = async (req, res) => {
  try {
    const skills = await getSkills();
    return res.status(200).json(skills || []);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch skills" });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    let skillLevel = parseInt(level);
    if (isNaN(skillLevel)) skillLevel = 80;

    const result = await addSkill(name.trim(), skillLevel);

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      id: result?.insertId || null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add skill" });
  }
};

export const removeSkill = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteSkill(id);
    return res.status(200).json({ success: true, message: "Skill deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete skill" });
  }
};