import Achievement from "../models/AchievementModel.js";
import PetualangAchievement from "../models/PetualangAchievementModel.js";
import Petualang from "../models/PetualangModel.js";
import { createNotification } from "./NotificationService.js";

const ACHIEVEMENT_DEFS = [
  {
    code: "streak_5",
    name: "Legenda Konsisten",
    description: "Selesaikan 5 misi berturut-turut tanpa gagal.",
    category: "streak",
    target: 5,
    reward_koin: 120,
    reward_xp: 180,
    icon: "badge-streak",
  },
  {
    code: "no_fail",
    name: "Quest Tanpa Gagal",
    description: "Selesaikan satu misi tanpa penolakan.",
    category: "no_fail",
    target: 1,
    reward_koin: 80,
    reward_xp: 120,
    icon: "badge-flawless",
  },
];

export const ensureAchievements = async () => {
  for (const def of ACHIEVEMENT_DEFS) {
    const existing = await Achievement.findOne({ where: { code: def.code } });
    if (!existing) {
      await Achievement.create(def);
    }
  }
};

const upsertPetualangAchievement = async (
  id_petualang,
  achievement,
  progress,
  completed
) => {
  const existing = await PetualangAchievement.findOne({
    where: { id_petualang, id_achievement: achievement.id_achievement },
  });

  if (!existing) {
    const created = await PetualangAchievement.create({
      id_petualang,
      id_achievement: achievement.id_achievement,
      progress,
      is_completed: completed,
      completed_at: completed ? new Date() : null,
    });
    return { record: created, wasCompleted: false };
  }

  if (existing.is_completed) return { record: existing, wasCompleted: true };

  const updated = await existing.update({
    progress,
    is_completed: completed,
    completed_at: completed ? new Date() : null,
  });
  return { record: updated, wasCompleted: false };
};

const rewardAchievement = async (id_petualang, achievement) => {
  const petualang = await Petualang.findOne({ where: { id_petualang } });
  if (!petualang) return;
  const newKoin = (petualang.koin || 0) + (achievement.reward_koin || 0);
  const newXp = (petualang.poin_pengalaman || 0) + (achievement.reward_xp || 0);
  await petualang.update({ koin: newKoin, poin_pengalaman: newXp });

  await createNotification(
    id_petualang,
    "Achievement Baru!",
    `Badge "${achievement.name}" telah diraih. Hadiah sudah ditambahkan.`,
    "achievement"
  );
};

export const evaluateAchievements = async (id_petualang, context = {}) => {
  await ensureAchievements();
  const achievements = await Achievement.findAll();

  for (const achievement of achievements) {
    let progress = 0;
    let completed = false;

    if (achievement.category === "streak") {
      progress = Math.min(context.streak_selesai || 0, achievement.target);
      completed = progress >= achievement.target;
    } else if (achievement.category === "no_fail") {
      progress = context.no_fail ? 1 : 0;
      completed = progress >= achievement.target;
    } else {
      continue;
    }

    const { record, wasCompleted } = await upsertPetualangAchievement(
      id_petualang,
      achievement,
      progress,
      completed
    );

    if (completed && !wasCompleted) {
      await rewardAchievement(id_petualang, achievement);
    }
  }
};
