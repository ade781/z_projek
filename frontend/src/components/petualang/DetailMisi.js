import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, } from "react-router-dom";
import { BASE_URL } from "../../utils";

const DetailMisi = () => {
    const { id } = useParams(); // ambil id misi dari route param

    const [misi, setMisi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        const fetchMisiDetail = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setErrorMsg("Please login first.");
                    setLoading(false);
                    return;
                }
                const res = await axios.get(`${BASE_URL}/misi/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMisi(res.data.data || res.data); // sesuaikan dengan response backend
            } catch (error) {
                setErrorMsg("Gagal mengambil detail misi.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMisiDetail();
    }, [id]);

    const handleAmbilMisi = async () => {
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const token = localStorage.getItem("accessToken");
            const id_petualang = localStorage.getItem("id_petualang");

            if (!token || !id_petualang) {
                setErrorMsg("Please login first.");
                return;
            }

            if (Number(localStorage.getItem("level_petualang") || 0) < misi.level_required) {
                setErrorMsg("Level belum memenuhi untuk mengambil misi ini.");
                return;
            }

            // 1. Insert ke logactivity
            const resAmbil = await axios.post(
                `${BASE_URL}/logactivity/ambil-misi`,
                { id_petualang, id_misi: misi.id_misi },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (resAmbil.data.message !== "Misi berhasil diambil") {
                setErrorMsg(resAmbil.data.message || "Gagal mengambil misi (logactivity).");
                return;
            }

            // 2. Update status misi
            const resUpdateMisi = await axios.post(
                `${BASE_URL}/misi/ambil-misi`,
                { id_petualang, id_misi: misi.id_misi },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (resUpdateMisi.data.message !== "Status misi berhasil diperbarui") {
                setErrorMsg(resUpdateMisi.data.message || "Gagal update status misi.");
                return;
            }

            setSuccessMsg("Misi berhasil diambil!");
            // Refresh data misi agar status terbaru muncul
            const resRefresh = await axios.get(`${BASE_URL}/misi/${misi.id_misi}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMisi(resRefresh.data.data || resRefresh.data);

        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Gagal mengambil misi. Coba lagi nanti.");
            console.error(error);
        }
    };


    if (loading) return <p>Loading...</p>;
    if (errorMsg) return <p style={{ color: "red" }}>{errorMsg}</p>;
    if (!misi) return <p>Misi tidak ditemukan.</p>;

    return (
        <div>
            <h2>{misi.judul_misi}</h2>
            <p>{misi.deskripsi}</p>
            <p>Hadiah Koin: {misi.hadiah_koin}</p>
            <p>Hadiah XP: {misi.hadiah_xp}</p>
            <p>Status: {misi.status_misi}</p>
            <p>Level Required: {misi.level_required}</p>

            {misi.status_misi === "belum diambil" && (
                <button onClick={handleAmbilMisi}>Ambil Misi</button>
            )}

            {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
        </div>
    );
};

export default DetailMisi;
