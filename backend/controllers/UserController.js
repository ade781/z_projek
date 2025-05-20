import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// GET
async function getUsers(req, res) {
    try {
        const users = await User.findAll();
        res.status(200).json({
            status: "Success",
            message: "Users Retrieved",
            data: users,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

// GET BY ID
async function getUserById(req, res) {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        if (!user) {
            const error = new Error("User tidak ditemukan 😮");
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({
            status: "Success",
            message: "User Retrieved",
            data: user,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

// CREATE
async function createUser(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            const msg = `${!name ? "Name" : !email ? "Email" : "Password"} field cannot be empty 😠`;
            const error = new Error(msg);
            error.statusCode = 401;
            throw error;
        }

        const encryptPassword = await bcrypt.hash(password, 5);

        await User.create({
            name,
            email,
            password: encryptPassword,
        });

        res.status(201).json({
            status: "Success",
            message: "User Created",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

// UPDATE
async function updateUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const ifUserExist = await User.findOne({ where: { id: req.params.id } });

        if (!name || !email || !password) {
            const error = new Error("Field cannot be empty 😠");
            error.statusCode = 401;
            throw error;
        }

        if (!ifUserExist) {
            const error = new Error("User tidak ditemukan 😮");
            error.statusCode = 400;
            throw error;
        }

        const encryptPassword = await bcrypt.hash(password, 5);

        await User.update(
            { name, email, password: encryptPassword },
            { where: { id: req.params.id } }
        );

        res.status(200).json({
            status: "Success",
            message: "User Updated",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

// DELETE
async function deleteUser(req, res) {
    try {
        const ifUserExist = await User.findOne({ where: { id: req.params.id } });
        if (!ifUserExist) {
            const error = new Error("User tidak ditemukan 😮");
            error.statusCode = 400;
            throw error;
        }

        await User.destroy({ where: { id: req.params.id } });
        res.status(200).json({
            status: "Success",
            message: "User Deleted",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

// LOGIN
async function loginHandler(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (user) {
            const userPlain = user.toJSON();
            const { password: _, refresh_token: __, ...safeUserData } = userPlain;

            const decryptPassword = await bcrypt.compare(password, user.password);
            if (decryptPassword) {
                const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '300s'
                });
                const refreshToken = jwt.sign(safeUserData, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: '1d'
                });
                await User.update({ refresh_token: refreshToken }, {
                    where: { id: user.id }
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: false,
                    sameSite: 'none',
                    maxAge: 24 * 60 * 60 * 1000,
                    secure: true
                });
                res.status(200).json({
                    status: "Success",
                    message: "Login Berhasil",
                    safeUserData,
                    accessToken
                });
            } else {
                res.status(400).json({
                    status: "Failed",
                    message: "Password atau email salah",
                });
            }
        } else {
            res.status(400).json({
                status: "Failed",
                message: "Password atau email salah",
            });
        }
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message
        });
    }
}

// LOGOUT
async function logout(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user?.refresh_token) return res.sendStatus(204);
    await User.update({ refresh_token: null }, { where: { id: user.id } });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginHandler,
    logout
};
