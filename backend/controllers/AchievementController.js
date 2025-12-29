import Achievement from "../models/AchievementModel.js";
import PetualangAchievement from "../models/PetualangAchievementModel.js";
import { ensureAchievements } from "../services/AchievementService.js";

export const getAchievements = async (req, res) => {
  try {
    await ensureAchievements();
    const achievements = await Achievement.findAll();
    res.status(200).json({ data: achievements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPetualangAchievements = async (req, res) => {
  try {
    await ensureAchievements();
    const { id_petualang } = req.params;
    const data = await PetualangAchievement.findAll({
      where: { id_petualang },
      include: [Achievement],
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
