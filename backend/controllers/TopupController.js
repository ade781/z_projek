import TopupRequest from "../models/TopupRequestModel.js";
import WargaDesa from "../models/WargaDesaModel.js";
import Owner from "../models/OwnerModel.js";
import db from "../config/Database.js";

export const createTopupRequest = async (req, res) => {
  try {
    const { id_warga_desa, amount } = req.body;
    if (!id_warga_desa || !amount || amount <= 0) {
      return res.status(400).json({ message: "Amount harus diisi." });
    }

    const warga = await WargaDesa.findOne({ where: { id_warga_desa } });
    if (!warga) {
      return res.status(404).json({ message: "Warga tidak ditemukan." });
    }

    const request = await TopupRequest.create({
      id_warga_desa,
      amount,
      status: "pending",
    });

    res.status(201).json({ message: "Permohonan koin dikirim.", data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopupRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const requests = await TopupRequest.findAll({
      where,
      include: [WargaDesa],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopupByWarga = async (req, res) => {
  try {
    const { id_warga_desa } = req.params;
    const requests = await TopupRequest.findAll({
      where: { id_warga_desa },
      include: [WargaDesa],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveTopup = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const { id } = req.params;
    const { id_owner, catatan_owner } = req.body;

    const request = await TopupRequest.findOne({
      where: { id_topup_request: id },
    });
    if (!request) {
      await transaction.rollback();
      return res.status(404).json({ message: "Request tidak ditemukan." });
    }
    if (request.status !== "pending") {
      await transaction.rollback();
      return res.status(400).json({ message: "Request sudah diproses." });
    }

    const owner = await Owner.findOne({ where: { id_owner } });
    if (!owner) {
      await transaction.rollback();
      return res.status(404).json({ message: "Owner tidak ditemukan." });
    }
    if (owner.total_koin < request.amount) {
      await transaction.rollback();
      return res.status(400).json({ message: "Koin owner tidak cukup." });
    }

    const warga = await WargaDesa.findOne({ where: { id_warga_desa: request.id_warga_desa } });
    if (!warga) {
      await transaction.rollback();
      return res.status(404).json({ message: "Warga tidak ditemukan." });
    }

    await owner.update(
      { total_koin: owner.total_koin - request.amount },
      { transaction }
    );
    await warga.update(
      { koin: warga.koin + request.amount },
      { transaction }
    );
    await request.update(
      { status: "approved", id_owner, catatan_owner: catatan_owner || null },
      { transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: "Topup disetujui." });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

export const rejectTopup = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_owner, catatan_owner } = req.body;
    const request = await TopupRequest.findOne({
      where: { id_topup_request: id },
    });
    if (!request) {
      return res.status(404).json({ message: "Request tidak ditemukan." });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request sudah diproses." });
    }

    await request.update({
      status: "rejected",
      id_owner: id_owner || null,
      catatan_owner: catatan_owner || null,
    });
    res.status(200).json({ message: "Topup ditolak." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
