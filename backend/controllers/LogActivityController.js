import LogActivity from "../models/LogActivityModel.js";
import Misi from "../models/MisiModel.js";
import Petualang from "../models/PetualangModel.js";
import {
  generateFinalSummary,
  generateStage,
} from "../services/GeminiService.js";

const STAGE_MAX = 5;

const getRequiredLevelForStage = (baseLevel, stage) => {
  if (stage <= 2) return baseLevel;
  if (stage <= 4) return baseLevel + 1;
  return baseLevel + 2;
};

const getLevelFromXP = (xp) => {
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 600) return 3;
  if (xp < 1000) return 4;
  if (xp < 1500) return 5;
  if (xp < 2100) return 6;
  if (xp < 2800) return 7;
  if (xp < 3600) return 8;
  if (xp < 4500) return 9;
  if (xp < 5500) return 10;
  if (xp < 6600) return 11;
  return 12;
};

const normalizeHistory = (history) => {
  if (Array.isArray(history)) return history;
  if (typeof history === "string") {
    try {
      const parsed = JSON.parse(history);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

// Get all log aktivitas
export const getLogActivities = async (req, res) => {
  try {
    const { id_misi, id_petualang, status_approval, aktivitas } = req.query;
    const where = {};
    if (id_misi) where.id_misi = id_misi;
    if (id_petualang) where.id_petualang = id_petualang;
    if (status_approval) where.status_approval = status_approval;
    if (aktivitas) where.aktivitas = aktivitas;

    const logs = await LogActivity.findAll({
      where,
      include: ["petualang", "misi"],
      order: [["tanggal_waktu", "ASC"]],
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get log aktivitas by id_log
export const getLogActivityById = async (req, res) => {
  try {
    const log = await LogActivity.findOne({
      where: { id_log: req.params.id },
      include: ["petualang", "misi"],
    });
    if (!log)
      return res.status(404).json({ message: "Log aktivitas tidak ditemukan" });
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new log aktivitas (general)
export const createLogActivity = async (req, res) => {
  try {
    const {
      id_petualang,
      id_misi,
      aktivitas,
      keterangan,
      summary_ai,
      status_approval,
      history_pilihan,
    } = req.body;
    if (!id_petualang || !id_misi || !aktivitas) {
      return res.status(400).json({ message: "Data wajib diisi lengkap" });
    }
    const newLog = await LogActivity.create({
      id_petualang,
      id_misi,
      aktivitas,
      keterangan,
      summary_ai,
      status_approval,
      history_pilihan,
    });
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const ambilMisi = async (req, res) => {
  try {
    const { id_petualang, id_misi } = req.body;

    if (!id_petualang || !id_misi) {
      return res
        .status(400)
        .json({ message: "ID petualang dan misi wajib diisi" });
    }

    const petualang = await Petualang.findOne({ where: { id_petualang } });
    if (!petualang)
      return res.status(404).json({ message: "Petualang tidak ditemukan" });

    const misi = await Misi.findOne({ where: { id_misi } });
    if (!misi) return res.status(404).json({ message: "Misi tidak ditemukan" });

    if (petualang.level < misi.level_required) {
      return res.status(403).json({ message: "Level belum memenuhi syarat" });
    }

    const logPending = await LogActivity.findOne({
      where: { id_petualang, id_misi, status_approval: "pending" },
      order: [["tanggal_waktu", "DESC"]],
    });

    if (logPending && !logPending.summary_ai) {
      return res.status(400).json({ message: "Petualangan masih berjalan" });
    }

    const logBaru = await LogActivity.create({
      id_petualang,
      id_misi,
      aktivitas: "ambil misi",
      keterangan: "Petualang mengambil misi ini",
      history_pilihan: [],
      status_approval: "pending",
    });

    res.status(201).json({ message: "Misi berhasil diambil", data: logBaru });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update log aktivitas by id_log
export const updateLogActivity = async (req, res) => {
  try {
    const log = await LogActivity.findOne({ where: { id_log: req.params.id } });
    if (!log)
      return res.status(404).json({ message: "Log aktivitas tidak ditemukan" });

    const {
      id_petualang,
      id_misi,
      aktivitas,
      keterangan,
      summary_ai,
      status_approval,
      history_pilihan,
    } = req.body;
    await LogActivity.update(
      {
        id_petualang,
        id_misi,
        aktivitas,
        keterangan,
        summary_ai,
        status_approval,
        history_pilihan,
      },
      { where: { id_log: req.params.id } }
    );

    res.json({ message: "Log aktivitas berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete log aktivitas by id_log
export const deleteLogActivity = async (req, res) => {
  try {
    const log = await LogActivity.findOne({ where: { id_log: req.params.id } });
    if (!log)
      return res.status(404).json({ message: "Log aktivitas tidak ditemukan" });

    await LogActivity.destroy({ where: { id_log: req.params.id } });
    res.json({ message: "Log aktivitas berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMisiByPetualang = async (req, res) => {
  try {
    const { id_petualang } = req.params;
    const logactivities = await LogActivity.findAll({
      where: { id_petualang },
      include: [
        {
          model: Misi,
          attributes: [
            "id_misi",
            "judul_misi",
            "deskripsi",
            "hadiah_koin",
            "hadiah_xp",
            "status_misi",
            "level_required",
          ],
        },
      ],
    });
    res.status(200).json({ data: logactivities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const playMissionNext = async (req, res) => {
  try {
    const { id_misi, id_petualang, pilihan } = req.body;
    const petualangId = id_petualang;

    if (!id_misi || !petualangId) {
      return res
        .status(400)
        .json({ message: "id_misi dan id_petualang wajib diisi" });
    }

    const misi = await Misi.findOne({ where: { id_misi } });
    if (!misi) return res.status(404).json({ message: "Misi tidak ditemukan" });

    const petualang = await Petualang.findOne({
      where: { id_petualang: petualangId },
    });
    if (!petualang)
      return res.status(404).json({ message: "Petualang tidak ditemukan" });

    const assignedId = misi.id_petualang_ambil ?? misi.id_petualang;
    if (
      misi.status_misi !== "aktif" ||
      Number(assignedId) !== Number(petualangId)
    ) {
      return res
        .status(403)
        .json({ message: "Misi belum aktif atau bukan untuk petualang ini" });
    }

    let log = await LogActivity.findOne({
      where: { id_misi, id_petualang: petualangId, status_approval: "pending" },
      order: [["tanggal_waktu", "DESC"]],
    });

    if (!log) {
      log = await LogActivity.create({
        id_petualang: petualangId,
        id_misi,
        aktivitas: "quest",
        keterangan: "Petualangan dimulai",
        history_pilihan: [],
        status_approval: "pending",
      });
    }

    if (log.summary_ai) {
      return res.status(409).json({
        message: "Petualangan sudah selesai",
        summary_ai: log.summary_ai,
        status_approval: log.status_approval,
      });
    }

    const history = normalizeHistory(log.history_pilihan);
    const lastEntry = history[history.length - 1];

    if (lastEntry && lastEntry.status === "completed") {
      const summary = log.summary_ai
        ? log.summary_ai
        : await generateFinalSummary(misi, history);
      if (!log.summary_ai) {
        await log.update({ summary_ai: summary });
      }
      return res.status(200).json({
        stage: STAGE_MAX,
        narasi: "Petualangan telah berakhir.",
        opsi: [],
        status: "completed",
        summary_ai: summary,
        status_approval: log.status_approval,
      });
    }

    if (!pilihan && lastEntry && !lastEntry.pilihan) {
      return res.status(200).json({
        stage: lastEntry.stage,
        narasi: lastEntry.narasi,
        opsi: lastEntry.opsi,
        status: lastEntry.status || "ongoing",
        status_approval: log.status_approval,
      });
    }

    let choiceUpdated = false;
    if (pilihan) {
      if (!lastEntry) {
        return res.status(400).json({
          message: "Stage belum dimulai, mulai dulu tanpa pilihan.",
        });
      }
      const normalizedChoice = String(pilihan).trim();
      if (lastEntry.pilihan) {
        // Pilihan sudah tersimpan sebelumnya, lanjutkan ke stage berikutnya.
      } else {
        const normalizedOptions = Array.isArray(lastEntry.opsi)
          ? lastEntry.opsi.map((option) => String(option).trim())
          : [];
        if (
          normalizedOptions.length > 0 &&
          !normalizedOptions.includes(normalizedChoice)
        ) {
          return res
            .status(400)
            .json({ message: "Pilihan tidak valid untuk stage ini." });
        }
        history[history.length - 1] = {
          ...lastEntry,
          pilihan: normalizedChoice,
        };
        choiceUpdated = true;
      }
    }

    const stageToGenerate =
      history.length === 0
        ? 1
        : history[history.length - 1].pilihan
          ? history.length + 1
          : history.length;

    if (history.length >= STAGE_MAX && lastEntry) {
      const summary = log.summary_ai
        ? log.summary_ai
        : await generateFinalSummary(misi, history);
      await log.update({
        history_pilihan: history.map((entry, index) => {
          if (index === history.length - 1) {
            return { ...entry, status: "completed", opsi: [] };
          }
          return entry;
        }),
        summary_ai: summary,
      });
      return res.status(200).json({
        stage: STAGE_MAX,
        narasi: "Petualangan telah berakhir.",
        opsi: [],
        status: "completed",
        summary_ai: summary,
        status_approval: log.status_approval,
      });
    }

    if (stageToGenerate > STAGE_MAX) {
      const summary = log.summary_ai
        ? log.summary_ai
        : await generateFinalSummary(misi, history);
      await log.update({ history_pilihan: history, summary_ai: summary });
      return res.status(200).json({
        stage: STAGE_MAX,
        narasi: "Petualangan telah berakhir.",
        opsi: [],
        status: "completed",
        summary_ai: summary,
        status_approval: log.status_approval,
      });
    }

    if (choiceUpdated) {
      await log.update({ history_pilihan: history });
    }

    const requiredLevel = getRequiredLevelForStage(
      misi.level_required,
      stageToGenerate
    );
    if (petualang.level < requiredLevel) {
      return res.status(403).json({
        message: "Level petualang belum cukup untuk stage ini",
        required_level: requiredLevel,
        stage: stageToGenerate,
      });
    }

    const stageResult = await generateStage(misi, stageToGenerate, history);
    if (stageToGenerate >= STAGE_MAX) {
      stageResult.status = "completed";
      stageResult.opsi = [];
    }
    history.push({
      stage: stageToGenerate,
      narasi: stageResult.narasi,
      opsi: stageResult.opsi,
      pilihan: null,
      status: stageResult.status,
    });

    let summary = null;
    if (stageResult.status !== "ongoing" || stageToGenerate >= STAGE_MAX) {
      summary = await generateFinalSummary(misi, history);
    }

    await log.update({
      history_pilihan: history,
      summary_ai: summary ? summary : log.summary_ai,
    });

    res.status(200).json({
      stage: stageToGenerate,
      narasi: stageResult.narasi,
      opsi: stageResult.opsi,
      status: stageResult.status,
      summary_ai: summary,
      status_approval: log.status_approval,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveMission = async (req, res) => {
  try {
    const { id_misi, id_petualang } = req.body;
    if (!id_misi || !id_petualang) {
      return res
        .status(400)
        .json({ message: "id_misi dan id_petualang wajib diisi" });
    }

    const log = await LogActivity.findOne({
      where: { id_misi, id_petualang, status_approval: "pending" },
      order: [["tanggal_waktu", "DESC"]],
    });
    if (!log) {
      return res.status(404).json({ message: "Log petualangan tidak ditemukan" });
    }
    if (!log.summary_ai) {
      return res
        .status(400)
        .json({ message: "Petualangan belum selesai untuk disetujui" });
    }

    const misi = await Misi.findOne({ where: { id_misi } });
    if (!misi) return res.status(404).json({ message: "Misi tidak ditemukan" });

    const petualang = await Petualang.findOne({
      where: { id_petualang },
    });
    if (!petualang)
      return res.status(404).json({ message: "Petualang tidak ditemukan" });

    const xpBaru = (petualang.poin_pengalaman || 0) + (misi.hadiah_xp || 0);
    const levelBaru = getLevelFromXP(xpBaru);
    const koinBaru = (petualang.koin || 0) + (misi.hadiah_koin || 0);
    const jumlahMisiSelesai =
      (petualang.jumlah_misi_selesai || 0) + 1;

    await Petualang.update(
      {
        koin: koinBaru,
        poin_pengalaman: xpBaru,
        jumlah_misi_selesai: jumlahMisiSelesai,
        level: levelBaru,
      },
      { where: { id_petualang } }
    );

    await Misi.update({ status_misi: "selesai" }, { where: { id_misi } });
    await LogActivity.update(
      { status_approval: "approved" },
      { where: { id_log: log.id_log } }
    );

    res.status(200).json({
      message: "Misi disetujui, hadiah diberikan",
      data: {
        koin: koinBaru,
        poin_pengalaman: xpBaru,
        level: levelBaru,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectMission = async (req, res) => {
  try {
    const { id_misi, id_petualang, alasan } = req.body;
    if (!id_misi || !id_petualang) {
      return res
        .status(400)
        .json({ message: "id_misi dan id_petualang wajib diisi" });
    }

    const log = await LogActivity.findOne({
      where: { id_misi, id_petualang, status_approval: "pending" },
      order: [["tanggal_waktu", "DESC"]],
    });
    if (!log) {
      return res.status(404).json({ message: "Log petualangan tidak ditemukan" });
    }

    await LogActivity.update(
      {
        status_approval: "rejected",
        keterangan: alasan ? `Ditolak: ${alasan}` : log.keterangan,
      },
      { where: { id_log: log.id_log } }
    );

    await Misi.update(
      { status_misi: "belum diambil", id_petualang: null, id_petualang_ambil: null },
      { where: { id_misi } }
    );

    res.status(200).json({
      message: "Misi ditolak dan dapat diulang dari awal",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





