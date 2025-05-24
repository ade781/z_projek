import Petualang from "../models/PetualangModel.js";
import LogActivity from "../models/LogActivityModel.js";
import Misi from "../models/MisiModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// GET ALL PETUALANGS
export async function getPetualangs(req, res) {
    try {
        const petualangs = await Petualang.findAll({
           
            attributes: { exclude: ["password"] },
        });
        res.status(200).json({
            status: "Success",
            message: "Petualangs Retrieved",
            data: petualangs,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

// GET PETUALANG BY ID
export async function getPetualangById(req, res) {
    try {
        const petualang = await Petualang.findOne({
            where: { id_petualang: req.params.id },
            attributes: { exclude: ["password"] },
        });
        if (!petualang) {
            const error = new Error("Petualang tidak ditemukan 😮");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            status: "Success",
            message: "Petualang Retrieved",
            data: petualang,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

// CREATE PETUALANG (REGISTER)
export async function createPetualang(req, res) {
    try {
        const { username, password, role, level, koin } = req.body;

        if (!username || !password) {
            const msg = `${!username ? "Username" : "Password"} tidak boleh kosong 😠`;
            const error = new Error(msg);
            error.statusCode = 400;
            throw error;
        }

        // Cek username sudah ada?
        const existPetualang = await Petualang.findOne({ where: { username } });
        if (existPetualang) {
            const error = new Error("Username sudah digunakan");
            error.statusCode = 409;
            throw error;
        }

        const hashPassword = await bcrypt.hash(password, 5);

        await Petualang.create({
            username,
            password: hashPassword,
            role: role || "player",
            level: level || 1,
            koin: koin || 0,
            jumlah_misi_selesai: 0,
            poin_pengalaman: 0,
        });

        res.status(201).json({
            status: "Success",
            message: "Petualang berhasil dibuat",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

// UPDATE PETUALANG
export async function updatePetualang(req, res) {
  try {
    const {
      username,
      password, // optional
      role,
      level,
      koin,
      jumlah_misi_selesai,
      poin_pengalaman,
    } = req.body;

    const petualang = await Petualang.findOne({
      where: { id_petualang: req.params.id },
    });

    if (!petualang) {
      const error = new Error("Petualang tidak ditemukan 😮");
      error.statusCode = 404;
      throw error;
    }

    let updateData = {
      username: username !== undefined ? username : petualang.username,
      role: role !== undefined ? role : petualang.role,
      level: level !== undefined ? level : petualang.level,
      koin: koin !== undefined ? koin : petualang.koin,
      jumlah_misi_selesai:
        jumlah_misi_selesai !== undefined
          ? jumlah_misi_selesai
          : petualang.jumlah_misi_selesai,
      poin_pengalaman:
        poin_pengalaman !== undefined
          ? poin_pengalaman
          : petualang.poin_pengalaman,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 5);
    }

    await Petualang.update(updateData, {
      where: { id_petualang: req.params.id },
    });

    res.status(200).json({
      status: "Success",
      message: "Petualang berhasil diperbarui",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}



// DELETE PETUALANG
export async function deletePetualang(req, res) {
    try {
        const petualang = await Petualang.findOne({ where: { id_petualang: req.params.id } });
        if (!petualang) {
            const error = new Error("Petualang tidak ditemukan 😮");
            error.statusCode = 404;
            throw error;
        }

        await Petualang.destroy({ where: { id_petualang: req.params.id } });
        res.status(200).json({
            status: "Success",
            message: "Petualang berhasil dihapus",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

// LOGIN PETUALANG
export async function loginPetualang(req, res) {
    try {
        const { username, password } = req.body;
        const petualang = await Petualang.findOne({ where: { username } });

        if (!petualang) {
            return res.status(400).json({
                status: "Failed",
                message: "Username atau password salah",
            });
        }

        const validPassword = await bcrypt.compare(password, petualang.password);
        if (!validPassword) {
            return res.status(400).json({
                status: "Failed",
                message: "Username atau password salah",
            });
        }

        const petualangPlain = petualang.toJSON();
        const { password: _, ...safePetualang } = petualangPlain;

        const accessToken = jwt.sign(safePetualang, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "300s",
        });

        const refreshToken = jwt.sign(safePetualang, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "1d",
        });

        await Petualang.update({ refresh_token: refreshToken }, {
            where: { id_petualang: petualang.id_petualang },
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            status: "Success",
            message: "Login berhasil",
            petualang: safePetualang,
            accessToken,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

// LOGOUT PETUALANG
export async function logoutPetualang(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(204);

        const petualang = await Petualang.findOne({ where: { refresh_token: refreshToken } });
        if (!petualang) return res.sendStatus(204);

        await Petualang.update({ refresh_token: null }, { where: { id_petualang: petualang.id_petualang } });
        res.clearCookie("refreshToken");
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message,
        });
    }
}
