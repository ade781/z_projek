import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const getXPForLevel = (level) => {
    let totalXP = 0;
    for (let i = 1; i < level; i++) {
        totalXP += i * 100;
    }
    return totalXP;
};



const DashboardPetualang = () => {
    const [petualangs, setPetualangs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPetualang = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const id_petualang = localStorage.getItem("id_petualang");

                const res = await axios.get(`${BASE_URL}/petualang/${id_petualang}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("API Response:", res.data);

                const data = res.data.data || res.data;

                setPetualangs([data]); // Bungkus dalam array biar bisa pakai .map()
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch petualang", err);
                setError(err.response?.data?.message || "Gagal memuat data petualang");
                setLoading(false);
            }
        };

        fetchPetualang();
    }, []);

    const handleEdit = (id_petualang) => {
        navigate(`/edit-petualang/${id_petualang}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Dashboard Petualang</h2>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Level</th>
                        <th>Koin</th>
                        <th>Jumlah Misi Selesai</th>
                        <th>Poin Pengalaman</th>
                        <th>Progress Level</th>
                        <th>Created At</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {petualangs.length > 0 ? (
                        petualangs.map((p) => {
                            const currentXP = p.poin_pengalaman;
                            const currentLevel = p.level;
                            const xpForCurrentLevel = getXPForLevel(currentLevel);
                            const xpForNextLevel = getXPForLevel(currentLevel + 1);
                            const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
                            const xpProgress = currentXP - xpForCurrentLevel;
                            const percentProgress = Math.min(100, Math.max(0, (xpProgress / xpNeededForNextLevel) * 100));


                            return (
                                <tr key={p.id_petualang}>
                                    <td>{p.id_petualang}</td>
                                    <td>{p.username}</td>
                                    <td>{p.role}</td>
                                    <td>{p.level}</td>
                                    <td>{p.koin}</td>
                                    <td>{p.jumlah_misi_selesai}</td>
                                    <td>{p.poin_pengalaman}</td>
                                    <td>{percentProgress.toFixed(2)}%</td>
                                    <td>{new Date(p.created_at).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => handleEdit(p.id_petualang)}>Edit</button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="10">Data petualang tidak ditemukan.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardPetualang;
