import QuestTemplate from "../models/QuestTemplateModel.js";
import PetualangQuest from "../models/PetualangQuestModel.js";
import Petualang from "../models/PetualangModel.js";
import { createNotification } from "./NotificationService.js";

const DEFAULT_TEMPLATES = [
  {
    title: "Misi Harian: Jejak Pertama",
    description: "Selesaikan 1 misi hari ini.",
    type: "daily",
    objective_type: "complete_misi",
    target_value: 1,
    reward_koin: 50,
    reward_xp: 40,
  },
  {
    title: "Harian: Harta Ringan",
    description: "Kumpulkan 100 koin hari ini.",
    type: "daily",
    objective_type: "earn_koin",
    target_value: 100,
    reward_koin: 60,
    reward_xp: 30,
  },
  {
    title: "Harian: Api Pengalaman",
    description: "Raih 80 XP hari ini.",
    type: "daily",
    objective_type: "earn_xp",
    target_value: 80,
    reward_koin: 40,
    reward_xp: 60,
  },
  {
    title: "Mingguan: Pahlawan Konsisten",
    description: "Selesaikan 5 misi minggu ini.",
    type: "weekly",
    objective_type: "complete_misi",
    target_value: 5,
    reward_koin: 250,
    reward_xp: 200,
  },
  {
    title: "Mingguan: Dompet Guild",
    description: "Kumpulkan 600 koin minggu ini.",
    type: "weekly",
    objective_type: "earn_koin",
    target_value: 600,
    reward_koin: 300,
    reward_xp: 180,
  },
  {
    title: "Mingguan: Obor Pengetahuan",
    description: "Raih 400 XP minggu ini.",
    type: "weekly",
    objective_type: "earn_xp",
    target_value: 400,
    reward_koin: 220,
    reward_xp: 260,
  },
];

const getWeekKey = (date) => {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

export const getPeriodKey = (type, date = new Date()) => {
  if (type === "weekly") return getWeekKey(date);
  return date.toISOString().slice(0, 10);
};

const getPeriodExpiry = (type, date = new Date()) => {
  if (type === "weekly") {
    const day = date.getDay();
    const diff = (7 - day) % 7;
    const end = new Date(date);
    end.setDate(date.getDate() + diff);
    end.setHours(23, 59, 59, 999);
    return end;
  }
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const seedQuestTemplates = async () => {
  const count = await QuestTemplate.count();
  if (count > 0) return;
  await QuestTemplate.bulkCreate(DEFAULT_TEMPLATES);
};

export const ensureActiveQuests = async (id_petualang) => {
  await seedQuestTemplates();
  const templates = await QuestTemplate.findAll();
  const now = new Date();

  for (const template of templates) {
    const periodKey = getPeriodKey(template.type, now);
    const existing = await PetualangQuest.findOne({
      where: {
        id_petualang,
        id_quest_template: template.id_quest_template,
        period_key: periodKey,
      },
    });
    if (!existing) {
      await PetualangQuest.create({
        id_petualang,
        id_quest_template: template.id_quest_template,
        progress: 0,
        status: "ongoing",
        period_key: periodKey,
        expires_at: getPeriodExpiry(template.type, now),
      });
    }
  }
};

export const updateQuestProgress = async (
  id_petualang,
  updates = { complete_misi: 0, earn_koin: 0, earn_xp: 0 }
) => {
  await ensureActiveQuests(id_petualang);
  const now = new Date();
  const quests = await PetualangQuest.findAll({
    where: { id_petualang },
    include: [QuestTemplate],
  });

  const result = [];
  for (const quest of quests) {
    const template = quest.quest_template;
    if (!template || quest.status !== "ongoing") continue;
    const periodKey = getPeriodKey(template.type, now);
    if (quest.period_key !== periodKey) continue;

    let increment = 0;
    if (template.objective_type === "complete_misi") {
      increment = updates.complete_misi || 0;
    } else if (template.objective_type === "earn_koin") {
      increment = updates.earn_koin || 0;
    } else if (template.objective_type === "earn_xp") {
      increment = updates.earn_xp || 0;
    }

    if (increment <= 0) continue;

    const newProgress = quest.progress + increment;
    const completed = newProgress >= template.target_value;
    await quest.update({
      progress: newProgress,
      status: completed ? "completed" : quest.status,
    });

    if (completed) {
      await createNotification(
        id_petualang,
        "Quest Harian/Mingguan Selesai!",
        `Quest "${template.title}" sudah selesai. Klaim hadiahmu!`,
        "quest"
      );
    }
    result.push(quest);
  }

  return result;
};

export const claimQuestReward = async (id_petualang, id_petualang_quest) => {
  const quest = await PetualangQuest.findOne({
    where: { id_petualang_quest, id_petualang },
    include: [QuestTemplate],
  });
  if (!quest || quest.status !== "completed") return null;

  const template = quest.quest_template;
  const petualang = await Petualang.findOne({ where: { id_petualang } });
  if (!petualang) return null;

  const newKoin = (petualang.koin || 0) + (template.reward_koin || 0);
  const newXp = (petualang.poin_pengalaman || 0) + (template.reward_xp || 0);
  await petualang.update({ koin: newKoin, poin_pengalaman: newXp });
  await quest.update({ status: "claimed" });

  await createNotification(
    id_petualang,
    "Hadiah Quest Diterima",
    `Hadiah quest "${template.title}" sudah masuk. Teruskan petualanganmu!`,
    "quest"
  );

  return {
    reward_koin: template.reward_koin || 0,
    reward_xp: template.reward_xp || 0,
  };
};
