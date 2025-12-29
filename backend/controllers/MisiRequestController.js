import MisiRequest from "../models/MisiRequestModel.js";
import WargaDesa from "../models/WargaDesaModel.js";
import Misi from "../models/MisiModel.js";
import db from "../config/Database.js";

export const createMisiRequest = async (req, res) => {
  try {
    const { id_warga_desa, judul_misi, deskripsi, hadiah_koin } = req.body;
    if (!id_warga_desa || !judul_misi || !deskripsi) {
      return res.status(400).json({ message: "Data wajib diisi lengkap." });
    }

    const warga = await WargaDesa.findOne({ where: { id_warga_desa } });
    if (!warga) {
      return res.status(404).json({ message: "Warga tidak ditemukan." });
    }

    const request = await MisiRequest.create({
      id_warga_desa,
      judul_misi,
      deskripsi,
      hadiah_koin: hadiah_koin || 0,
      status: "pending",
    });

    res.status(201).json({
      message: "Pengajuan misi berhasil.",
      data: request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMisiRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const requests = await MisiRequest.findAll({
      where,
      include: [WargaDesa],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMisiRequestByWarga = async (req, res) => {
  try {
    const { id_warga_desa } = req.params;
    const requests = await MisiRequest.findAll({
      where: { id_warga_desa },
      include: [WargaDesa],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveMisiRequest = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { id } = req.params;
    const { level_required, hadiah_xp, id_owner, catatan_owner } = req.body;

    const request = await MisiRequest.findOne({ where: { id_misi_request: id } });
    if (!request) {
      await transaction.rollback();
      return res.status(404).json({ message: "Request tidak ditemukan." });
    }
    if (request.status !== "pending") {
      await transaction.rollback();
      return res.status(400).json({ message: "Request sudah diproses." });
    }
    if (level_required === undefined || hadiah_xp === undefined || !id_owner) {
      await transaction.rollback();
      return res.status(400).json({ message: "Level, XP, dan owner wajib diisi." });
    }

    const warga = await WargaDesa.findOne({ where: { id_warga_desa: request.id_warga_desa } });
    if (!warga) {
      await transaction.rollback();
      return res.status(404).json({ message: "Warga tidak ditemukan." });
    }

    const biayaKoin = Number(request.hadiah_koin || 0);
    if (warga.koin < biayaKoin) {
      await transaction.rollback();
      return res.status(400).json({ message: "Koin warga tidak cukup untuk misi ini." });
    }

    const misi = await Misi.create(
      {
        judul_misi: request.judul_misi,
        deskripsi: request.deskripsi,
        hadiah_koin: request.hadiah_koin,
        hadiah_xp,
        level_required,
        status_misi: "belum diambil",
        id_pembuat: id_owner,
      },
      { transaction }
    );

    await warga.update(
      { koin: warga.koin - biayaKoin },
      { transaction }
    );

    await request.update(
      {
        status: "approved",
        level_required,
        hadiah_xp,
        catatan_owner: catatan_owner || null,
        id_owner,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: "Request disetujui.", data: misi });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

export const rejectMisiRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_owner, catatan_owner } = req.body;
    const request = await MisiRequest.findOne({ where: { id_misi_request: id } });
    if (!request) {
      return res.status(404).json({ message: "Request tidak ditemukan." });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request sudah diproses." });
    }

    await request.update({
      status: "rejected",
      catatan_owner: catatan_owner || null,
      id_owner: id_owner || null,
    });
    res.status(200).json({ message: "Request ditolak." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
