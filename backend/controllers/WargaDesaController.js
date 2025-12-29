import WargaDesa from "../models/WargaDesaModel.js";
import bcrypt from "bcrypt";

export const registerWarga = async (req, res) => {
  try {
    const { nama, username, password } = req.body;
    if (!nama || !username || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    const existing = await WargaDesa.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ message: "Username sudah digunakan." });
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const warga = await WargaDesa.create({
      nama,
      username,
      password: hashPassword,
    });

    res.status(201).json({
      message: "Registrasi warga berhasil.",
      data: {
        id_warga_desa: warga.id_warga_desa,
        nama: warga.nama,
        username: warga.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginWarga = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib." });
    }

    const warga = await WargaDesa.findOne({ where: { username } });
    if (!warga) {
      return res.status(400).json({ message: "Username atau password salah." });
    }

    const valid = await bcrypt.compare(password, warga.password);
    if (!valid) {
      return res.status(400).json({ message: "Username atau password salah." });
    }

    res.status(200).json({
      message: "Login warga berhasil.",
      data: {
        id_warga_desa: warga.id_warga_desa,
        nama: warga.nama,
        username: warga.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWargaById = async (req, res) => {
  try {
    const warga = await WargaDesa.findOne({
      where: { id_warga_desa: req.params.id },
      attributes: { exclude: ["password"] },
    });
    if (!warga) {
      return res.status(404).json({ message: "Warga tidak ditemukan." });
    }
    res.status(200).json({ data: warga });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
