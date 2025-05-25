import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const DataPetualang = () => {
    const [petualangs, setPetualangs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchPetualangs = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                const res = await axios.get(`${BASE_URL}/petualang`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("API Response:", res.data);

                const data = res.data.data || res.data;

                const cleanData = Array.isArray(data)
                    ? data.map((p) => ({
                        id_petualang: p.id_petualang,
                        username: p.username,
                        role: p.role,
                        level: p.level,
                        jumlah_misi_selesai: p.jumlah_misi_selesai,
                        poin_pengalaman: p.poin_pengalaman,
                    }))
                    : [];

                // Hapus sorting, langsung set data sesuai urutan API
                setPetualangs(cleanData);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch petualang", err);
                setErrorMsg("Gagal memuat data petualang.");
                setLoading(false);
            }
        };

        fetchPetualangs();
    }, []);

    const handleDelete = async (id_petualang) => {
        const confirmDelete = window.confirm("Yakin ingin menghapus petualang ini?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.delete(`${BASE_URL}/petualang/delete-petualang/${id_petualang}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.status === "Success") {
                setPetualangs((prev) => prev.filter((p) => p.id_petualang !== id_petualang));
            } else {
                alert("Gagal menghapus petualang, coba lagi.");
            }
        } catch (error) {
            alert("Terjadi kesalahan saat menghapus petualang.");
            console.error(error);
        }
    };

    if (loading) return <p>Loading leaderboard...</p>;
    if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

    return (
        <div>
            <h2>Data Petualang</h2>
            <table
                border="1"
                cellPadding="8"
                cellSpacing="0"
                style={{ borderCollapse: "collapse", width: "100%" }}
            >
                <thead>
                    <tr>
                        <th>ID</th> {/* Tambahan kolom ID */}
                        <th>Username</th>
                        <th>Role</th>
                        <th>Level</th>
                        <th>Jumlah Misi Selesai</th>
                        <th>Poin Pengalaman</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {petualangs.map((p) => (
                        <tr key={p.id_petualang || p.username}>
                            <td>{p.id_petualang}</td> {/* Tampilkan ID di sini */}
                            <td>{p.username}</td>
                            <td>{p.role}</td>
                            <td>{p.level}</td>
                            <td>{p.jumlah_misi_selesai}</td>
                            <td>{p.poin_pengalaman}</td>
                            <td>
                                <button
                                    style={{ cursor: "pointer", backgroundColor: "red", color: "white" }}
                                    onClick={() => handleDelete(p.id_petualang)}
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default DataPetualang;
