import Misi from "../models/MisiModel.js";
import LogActivity from "../models/LogActivityModel.js";
import Owner from "../models/OwnerModel.js";

// GET ALL MISI
export const getMisis = async (req, res) => {
    try {
        const misis = await Misi.findAll({
            include: [
                { model: LogActivity, as: "log_aktivitas" },
                { model: Owner, as: "owner" },
            ],
        });;
        res.status(200).json({
            status: "Success",
            message: "Misi Retrieved",
            data: misis,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
};

// GET MISI BY ID
export const getMisiById = async (req, res) => {
    try {
        const misi = await Misi.findOne({ where: { id_misi: req.params.id } });
        if (!misi) {
            return res.status(404).json({
                status: "Error",
                message: "Misi tidak ditemukan",
            });
        }
        res.status(200).json({
            status: "Success",
            message: "Misi Retrieved",
            data: misi,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
};

// CREATE MISI
export const createMisi = async (req, res) => {
    try {
        const {
            judul_misi,
            deskripsi,
            hadiah_koin,
            hadiah_xp,
            status_misi,
            level_required,
            id_pembuat,
        } = req.body;

        if (!judul_misi || !id_pembuat) {
            return res.status(400).json({
                status: "Error",
                message: "Judul misi dan ID pembuat wajib diisi",
            });
        }

        const newMisi = await Misi.create({
            judul_misi,
            deskripsi,
            hadiah_koin,
            hadiah_xp,
            status_misi,
            level_required,
            id_pembuat,
        });

        res.status(201).json({
            status: "Success",
            message: "Misi Created",
            data: newMisi,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
};

// UPDATE MISI
export const updateMisi = async (req, res) => {
    try {
        const misi = await Misi.findOne({ where: { id_misi: req.params.id } });
        if (!misi) {
            return res.status(404).json({
                status: "Error",
                message: "Misi tidak ditemukan",
            });
        }

        const {
            judul_misi,
            deskripsi,
            hadiah_koin,
            hadiah_xp,
            status_misi,
            level_required,
            id_pembuat,
        } = req.body;

        // Validasi status_misi (optional)
        const validStatus = ["belum diambil", "aktif", "batal", "selesai"];
        if (status_misi && !validStatus.includes(status_misi)) {
            return res.status(400).json({
                status: "Error",
                message: `Status misi harus salah satu dari: ${validStatus.join(", ")}`,
            });
        }

        await Misi.update(
            {
                judul_misi,
                deskripsi,
                hadiah_koin,
                hadiah_xp,
                status_misi,
                level_required,
                id_pembuat,
            },
            { where: { id_misi: req.params.id } }
        );

        res.status(200).json({
            status: "Success",
            message: "Misi Updated",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
};

// Ambil misi (ubah status misi dan catat di log aktivitas)
export const ambilMisi = async (req, res) => {
    try {
        const { id_petualang, id_misi } = req.body;

        const misi = await Misi.findOne({ where: { id_misi } });
        if (!misi) {
            return res.status(404).json({ status: "Error", message: "Misi tidak ditemukan" });
        }
        if (misi.status_misi !== "belum diambil") {
            return res.status(400).json({ status: "Error", message: "Misi sudah diambil atau tidak bisa diambil" });
        }

        // Update status misi jadi 'aktif' dan simpan id_petualang
        await Misi.update(
            { status_misi: "aktif", id_petualang: id_petualang },
            { where: { id_misi } }
        );


        res.status(200).json({ status: "Success", message: "Misi berhasil diambil" });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};


function getLevelFromXP(xp) {
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
}




// DELETE MISI
export const deleteMisi = async (req, res) => {
    try {
        const misi = await Misi.findOne({ where: { id_misi: req.params.id } });
        if (!misi) {
            return res.status(404).json({
                status: "Error",
                message: "Misi tidak ditemukan",
            });
        }

        await Misi.destroy({ where: { id_misi: req.params.id } });

        res.status(200).json({
            status: "Success",
            message: "Misi Deleted",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
};
