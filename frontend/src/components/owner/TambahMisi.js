import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const TambahMisi = () => {
    const [form, setForm] = useState({
        judul_misi: "",
        deskripsi: "",
        hadiah_koin: 0,
        hadiah_xp: 0,
        level_required: 1,
    });

    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const parsedValue =
            ["hadiah_koin", "hadiah_xp", "level_required"].includes(name)
                ? parseInt(value) || 0
                : value;

        setForm((prev) => ({
            ...prev,
            [name]: parsedValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        const token = localStorage.getItem("accessToken");
        const id_owner = localStorage.getItem("id_owner");

        if (!token || !id_owner) {
            setErrorMsg("Anda harus login sebagai owner terlebih dahulu.");
            return;
        }

        if (!form.judul_misi.trim()) {
            setErrorMsg("Judul misi tidak boleh kosong.");
            return;
        }

        try {
            const misiData = {
                ...form,
                id_pembuat: parseInt(id_owner),
                status_misi: "belum diambil", // WAJIB dikirim, backend tidak set default
            };

            await axios.post(`${BASE_URL}/misi`, misiData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            navigate("/misi-owner");
        } catch (error) {
            console.error("Gagal menambahkan misi:", error.response?.data || error.message);
            setErrorMsg(error.response?.data?.message || "Gagal menambahkan misi.");
        }
    };

    return (
        <div>
            <h2>Tambah Misi Baru</h2>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Judul Misi:</label>
                    <input
                        type="text"
                        name="judul_misi"
                        value={form.judul_misi}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Deskripsi:</label>
                    <textarea
                        name="deskripsi"
                        value={form.deskripsi}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Hadiah Koin:</label>
                    <input
                        type="number"
                        name="hadiah_koin"
                        value={form.hadiah_koin}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Hadiah XP:</label>
                    <input
                        type="number"
                        name="hadiah_xp"
                        value={form.hadiah_xp}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Level Required:</label>
                    <input
                        type="number"
                        name="level_required"
                        value={form.level_required}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Simpan</button>
            </form>
        </div>
    );
};

export default TambahMisi;
