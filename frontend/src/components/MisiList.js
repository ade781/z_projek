import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";

const MisiList = () => {
    const [misi, setMisi] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMisi = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setErrorMsg("Please login first.");
                    setLoading(false);
                    return;
                }
                const res = await axios.get(`${BASE_URL}/misi`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (Array.isArray(res.data)) {
                    setMisi(res.data);
                } else if (Array.isArray(res.data.data)) {
                    setMisi(res.data.data);
                } else {
                    setErrorMsg("Data misi tidak valid.");
                }
            } catch (error) {
                setErrorMsg("Gagal mengambil data misi.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMisi();
    }, []);

    // Fungsi navigasi ke detail misi
    const handleDetailMisi = (id_misi) => {
        navigate(`/detail-misi/${id_misi}`);
    };

    if (loading) return <p>Loading...</p>;

return (
    <div>
        <h2>Daftar Misi</h2>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        {Array.isArray(misi) && misi.length === 0 && <p>Belum ada misi.</p>}
        {Array.isArray(misi) &&
            misi.map((item) => (
                <div
                    key={item.id_misi}
                    onClick={() => handleDetailMisi(item.id_misi)} // klik di mana saja pada card
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "10px",
                        cursor: "pointer",
                    }}
                >
                    <h3>{item.judul_misi}</h3>
                    <p>{item.deskripsi}</p>
                    <p>Hadiah Koin: {item.hadiah_koin}</p>
                    <p>Hadiah XP: {item.hadiah_xp}</p>
                    <p>Status: {item.status_misi}</p>
                    <p>Level Required: {item.level_required}</p>

                    {item.status_misi === "belum diambil" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // agar klik tombol tidak ikut klik card
                                handleDetailMisi(item.id_misi);
                            }}
                        >
                            Ambil Misi
                        </button>
                    )}
                </div>
            ))}
    </div>
);

};

export default MisiList;
