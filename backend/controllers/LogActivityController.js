import LogActivity from "../models/LogActivityModel.js";
import Misi from "../models/MisiModel.js";
import Petualang from "../models/PetualangModel.js";


// Get all log aktivitas
export const getLogActivities = async (req, res) => {
  try {
    const logs = await LogActivity.findAll({
      include: ["petualang", "misi"], // pastikan asosiasi sudah dibuat di model
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
    if (!log) return res.status(404).json({ message: "Log aktivitas tidak ditemukan" });
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new log aktivitas (general)
export const createLogActivity = async (req, res) => {
  try {
    const { id_petualang, id_misi, aktivitas, keterangan } = req.body;
    if (!id_petualang || !id_misi || !aktivitas) {
      return res.status(400).json({ message: "Data wajib diisi lengkap" });
    }
    const newLog = await LogActivity.create({
      id_petualang,
      id_misi,
      aktivitas,
      keterangan,
    });
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const ambilMisi = async (req, res) => {
  try {
    const { id_petualang, id_misi } = req.body; // ambil id_petualang dari body

    if (!id_petualang || !id_misi) {
      return res.status(400).json({ message: "ID petualang dan misi wajib diisi" });
    }

    // cari petualang dan misi seperti biasa
    const petualang = await Petualang.findOne({ where: { id_petualang } });
    if (!petualang) return res.status(404).json({ message: "Petualang tidak ditemukan" });

    const misi = await Misi.findOne({ where: { id_misi } });
    if (!misi) return res.status(404).json({ message: "Misi tidak ditemukan" });

    if (petualang.level < misi.level_required) {
      return res.status(403).json({ message: "Level belum memenuhi syarat" });
    }

    const sudahAmbil = await LogActivity.findOne({
      where: { id_petualang, id_misi, aktivitas: "ambil misi" },
    });

    if (sudahAmbil) {
      return res.status(400).json({ message: "Misi sudah diambil" });
    }

    const logBaru = await LogActivity.create({
      id_petualang,
      id_misi,
      aktivitas: "ambil misi",
      keterangan: "Petualang mengambil misi ini",
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
    if (!log) return res.status(404).json({ message: "Log aktivitas tidak ditemukan" });

    const { id_petualang, id_misi, aktivitas, keterangan } = req.body;
    await LogActivity.update(
      { id_petualang, id_misi, aktivitas, keterangan },
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
    if (!log) return res.status(404).json({ message: "Log aktivitas tidak ditemukan" });

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
      include: [{
        model: Misi,
        attributes: ['id_misi', 'judul_misi', 'deskripsi', 'hadiah_koin', 'hadiah_xp', 'status_misi', 'level_required']
      }]
    });
    res.status(200).json({ data: logactivities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const misiSelesai = async (req, res) => {
  const { id_petualang, id_misi } = req.body;

  try {
    await LogAktivitas.create({
      id_petualang,
      id_misi,
      aktivitas: "misi diselesaikan owner",
      keterangan: `Misi dengan ID ${id_misi} telah diselesaikan dan di-approve oleh owner.`,
      tanggal_waktu: new Date(),
    });

    return res.json({ message: "Log aktivitas misi selesai berhasil dibuat" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server saat membuat log aktivitas" });
  }
};





