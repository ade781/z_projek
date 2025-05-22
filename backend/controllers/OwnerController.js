import Owner from "../models/OwnerModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// GET ALL OWNERS
export async function getOwners(req, res) {
  try {
    const owners = await Owner.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json({
      status: "Success",
      message: "Owners retrieved",
      data: owners,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// GET OWNER BY ID
export async function getOwnerById(req, res) {
  try {
    const owner = await Owner.findOne({
      where: { id_owner: req.params.id },
      attributes: { exclude: ["password"] },
    });
    if (!owner) {
      const error = new Error("Owner tidak ditemukan 😮");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: "Success",
      message: "Owner retrieved",
      data: owner,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// CREATE OWNER (REGISTER)
export async function createOwner(req, res) {
  try {
    const { nama_owner, username, password, total_koin } = req.body;

    if (!username || !password || !nama_owner) {
      const missingField = !nama_owner
        ? "Nama owner"
        : !username
        ? "Username"
        : "Password";
      const error = new Error(`${missingField} tidak boleh kosong 😠`);
      error.statusCode = 400;
      throw error;
    }

    // Cek username sudah ada?
    const existOwner = await Owner.findOne({ where: { username } });
    if (existOwner) {
      const error = new Error("Username sudah digunakan");
      error.statusCode = 409;
      throw error;
    }

    const hashPassword = await bcrypt.hash(password, 5);

    await Owner.create({
      nama_owner,
      username,
      password: hashPassword,
      total_koin: total_koin || 0,
    });

    res.status(201).json({
      status: "Success",
      message: "Owner berhasil dibuat",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// UPDATE OWNER
export async function updateOwner(req, res) {
  try {
    const { nama_owner, username, password, total_koin } = req.body;

    const owner = await Owner.findOne({ where: { id_owner: req.params.id } });
    if (!owner) {
      const error = new Error("Owner tidak ditemukan 😮");
      error.statusCode = 404;
      throw error;
    }

    if (!username || !password || !nama_owner) {
      const missingField = !nama_owner
        ? "Nama owner"
        : !username
        ? "Username"
        : "Password";
      const error = new Error(`${missingField} tidak boleh kosong 😠`);
      error.statusCode = 400;
      throw error;
    }

    const hashPassword = await bcrypt.hash(password, 5);

    await Owner.update(
      {
        nama_owner,
        username,
        password: hashPassword,
        total_koin: total_koin ?? owner.total_koin,
      },
      { where: { id_owner: req.params.id } }
    );

    res.status(200).json({
      status: "Success",
      message: "Owner berhasil diperbarui",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// DELETE OWNER
export async function deleteOwner(req, res) {
  try {
    const owner = await Owner.findOne({ where: { id_owner: req.params.id } });
    if (!owner) {
      const error = new Error("Owner tidak ditemukan 😮");
      error.statusCode = 404;
      throw error;
    }

    await Owner.destroy({ where: { id_owner: req.params.id } });
    res.status(200).json({
      status: "Success",
      message: "Owner berhasil dihapus",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// LOGIN OWNER
export async function loginOwner(req, res) {
  try {
    const { username, password } = req.body;
    const owner = await Owner.findOne({ where: { username } });

    if (!owner) {
      return res.status(400).json({
        status: "Failed",
        message: "Username atau password salah",
      });
    }

    const validPassword = await bcrypt.compare(password, owner.password);
    if (!validPassword) {
      return res.status(400).json({
        status: "Failed",
        message: "Username atau password salah",
      });
    }

    const ownerPlain = owner.toJSON();
    const { password: _, ...safeOwner } = ownerPlain;

    const accessToken = jwt.sign(safeOwner, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "300s",
    });

    const refreshToken = jwt.sign(safeOwner, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    await Owner.update({ refresh_token: refreshToken }, {
      where: { id_owner: owner.id_owner },
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
      owner: safeOwner,
      accessToken,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

// LOGOUT OWNER
export async function logoutOwner(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const owner = await Owner.findOne({ where: { refresh_token: refreshToken } });
    if (!owner) return res.sendStatus(204);

    await Owner.update({ refresh_token: null }, { where: { id_owner: owner.id_owner } });
    res.clearCookie("refreshToken");
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
}
