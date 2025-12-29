import PetualangQuest from "../models/PetualangQuestModel.js";
import QuestTemplate from "../models/QuestTemplateModel.js";
import {
  ensureActiveQuests,
  claimQuestReward,
  getPeriodKey,
} from "../services/QuestService.js";

export const getActiveQuests = async (req, res) => {
  try {
    const { id_petualang } = req.params;
    await ensureActiveQuests(id_petualang);
    const quests = await PetualangQuest.findAll({
      where: { id_petualang },
      include: [QuestTemplate],
    });
    res.status(200).json({ data: quests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const claimQuest = async (req, res) => {
  try {
    const { id_petualang, id_petualang_quest } = req.body;
    const result = await claimQuestReward(id_petualang, id_petualang_quest);
    if (!result) {
      return res.status(400).json({ message: "Quest tidak bisa diklaim." });
    }
    res.status(200).json({ message: "Quest diklaim.", data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestPeriod = async (req, res) => {
  try {
    const daily = getPeriodKey("daily");
    const weekly = getPeriodKey("weekly");
    res.status(200).json({ daily, weekly });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
