import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const DashboardMisiPetualang = () => {
    const [misiList, setMisiList] = useState([]);
    const [filterStatus, setFilterStatus] = useState("semua");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMisi = async () => {
            const id_petualang = localStorage.getItem("id_petualang");
            const accessToken = localStorage.getItem("accessToken");

            if (!id_petualang || !accessToken) {
                setError("Data login tidak ditemukan.");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${BASE_URL}/logactivity/${id_petualang}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                console.log("Data misi dari backend:", res.data.data); // <-- cek data
                setMisiList(res.data.data || []);
            } catch (err) {
                // ...
            } finally {
                setLoading(false);
            }
        };

        fetchMisi();
    }, []);

    const filteredMisi = misiList.filter((log) => {
        if (filterStatus === "semua") return true;
        return log.misi?.status_misi === filterStatus;
    });



    return (
        <div className="container mt-4">
            <h2>Dashboard Misi Petualang</h2>

            {loading ? (
                <p>Memuat data...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <>
                    <div className="mb-3">
                        <label className="form-label">Filter status:</label>
                        <select
                            className="form-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="semua">Semua</option>
                            <option value="aktif">Aktif</option>
                            <option value="selesai">Selesai</option>
                        </select>
                    </div>

                    {filteredMisi.length === 0 ? (
                        <p>Tidak ada misi ditemukan.</p>
                    ) : (
                        <ul className="list-group">
                            {filteredMisi.map((log) => (
                                <li key={log.id_log} className="list-group-item">
                                    <h5>{log.misi?.judul_misi || "Judul tidak tersedia"}</h5>
                                    <p><strong>Status:</strong> {log.misi?.status_misi || "-"}</p>
                                    <p><strong>Deskripsi:</strong> {log.misi?.deskripsi || "-"}</p>
                                    <p><strong>Hadiah:</strong> {log.misi?.hadiah_koin ?? 0} koin, {log.misi?.hadiah_xp ?? 0} XP</p>
                                    <p><strong>Level Dibutuhkan:</strong> {log.misi?.level_required || "-"}</p>
                                </li>

                            ))}
                        </ul>
                    )}

                </>
            )}
        </div>
    );
};

export default DashboardMisiPetualang;