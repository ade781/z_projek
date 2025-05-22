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

    // Catat log aktivitas
    await LogActivity.create({
      id_petualang,
      id_misi,
      aktivitas: "ambil_misi",
      keterangan: "Petualang mengambil misi",
    });

    res.status(200).json({ status: "Success", message: "Misi berhasil diambil" });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};


export const misiSelesai = async (req, res) => {
  const { id_misi } = req.body;

  try {
    // 1. Cek misi ada dan status aktif
    const misi = await Misi.findByPk(id_misi);
    if (!misi) {
      return res.status(404).json({ message: "Misi tidak ditemukan" });
    }
    if (misi.status_misi !== "aktif") {
      return res.status(400).json({ message: "Misi harus dalam status aktif untuk diselesaikan" });
    }

    // 2. Cari log aktivitas yang menunjukkan petualang yang ambil misi ini
    // Asumsi aktivitas 'ambil-misi' menunjukkan petualang yang mengambil
    const logAmbilMisi = await LogAktivitas.findOne({
      where: { id_misi, aktivitas: "ambil-misi" },
      order: [["tanggal_waktu", "DESC"]], // ambil yang terbaru
    });

    if (!logAmbilMisi) {
      return res.status(404).json({ message: "Petualang yang mengambil misi tidak ditemukan" });
    }

    const id_petualang = logAmbilMisi.id_petualang;

    // 3. Update petualang
    const petualang = await Petualang.findByPk(id_petualang);
    if (!petualang) {
      return res.status(404).json({ message: "Petualang tidak ditemukan" });
    }
    petualang.koin += misi.hadiah_koin;
    petualang.poin_pengalaman += misi.hadiah_xp;
    petualang.jumlah_misi_selesai += 1;
    await petualang.save();

    // 4. Update status misi
    misi.status_misi = "selesai";
    await misi.save();

    // 5. Catat log aktivitas bahwa owner menyelesaikan misi
    await LogAktivitas.create({
      id_petualang,
      id_misi,
      aktivitas: "misi disetujui owner",
      keterangan: `Misi "${misi.judul_misi}" telah disetujui dan diselesaikan oleh owner.`,
      tanggal_waktu: new Date(),
    });

    return res.json({ message: "Misi berhasil diselesaikan dan di-approve oleh owner" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};






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
