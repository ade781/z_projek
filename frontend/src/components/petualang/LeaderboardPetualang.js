import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const LeaderboardPetualang = () => {
    const [petualangs, setPetualangs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, ] = useState("");

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

            // Kalau data nested (ada relasi), ambil properti yang dibutuhkan saja:
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

            // Urutkan berdasarkan poin_pengalaman desc
            cleanData.sort((a, b) => b.poin_pengalaman - a.poin_pengalaman);

            setPetualangs(cleanData);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch petualang", err);
            setLoading(false);
        }
    };

    fetchPetualangs();
}, []);



    if (loading) return <p>Loading leaderboard...</p>;
    if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;

    return (
        <div>
            <h2>Leaderboard Petualang</h2>
            <table
                border="1"
                cellPadding="8"
                cellSpacing="0"
                style={{ borderCollapse: "collapse", width: "100%" }}
            >
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Level</th>
                        <th>Jumlah Misi Selesai</th>
                        <th>Poin Pengalaman</th>
                    </tr>
                </thead>
                <tbody>
                    {petualangs.map((p) => (
                        <tr key={p.id_petualang || p.username}>
                            <td>{p.username}</td>
                            <td>{p.role}</td>
                            <td>{p.level}</td>
                            <td>{p.jumlah_misi_selesai}</td>
                            <td>{p.poin_pengalaman}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardPetualang;
