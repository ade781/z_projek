import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";

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
                setError("🔐 Data login tidak ditemukan. Harap login kembali!");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${BASE_URL}/logactivity/${id_petualang}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setMisiList(res.data.data || []);
            } catch (err) {
                setError("⚡ Gagal memuat misi. Coba lagi nanti!");
                console.error("Error:", err);
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
        <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-10 px-4 sm:px-8">
            {/* Header with Adventure Theme */}
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 font-serif tracking-wide">
                        🏆 Papan Misi Petualang
                    </h1>
                    <p className="mt-3 text-gray-300 text-lg">
                        Temukan misi, kumpulkan hadiah, dan jadilah legenda!
                    </p>
                </div>

                {/* Loading & Error State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-yellow-400 font-medium">Memuat daftar misi...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/50 border-l-4 border-red-500 p-4 rounded-lg mb-8">
                        <p className="text-red-200 font-bold">⚠️ {error}</p>
                    </div>
                ) : (
                    <>
                        {/* Filter Section */}
                        <div className="mb-8 bg-stone-700/50 backdrop-blur-sm p-4 rounded-xl border border-yellow-600/30">
                            <label className="block text-yellow-400 text-sm font-bold mb-2">
                                🎯 Filter Misi
                            </label>
                            <select
                                className="w-full bg-stone-800 border border-yellow-600/50 text-yellow-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="semua">📜 Semua Misi</option>
                                <option value="aktif">⚔️ Misi Aktif</option>
                                <option value="selesai">🏅 Misi Selesai</option>
                            </select>
                        </div>

                        {/* Mission Cards (4 per row) */}
                        {filteredMisi.length === 0 ? (
                            <div className="bg-stone-800/50 p-8 text-center rounded-xl border-2 border-dashed border-yellow-600/30">
                                <p className="text-yellow-400 text-xl">📭 Tidak ada misi tersedia</p>
                                <p className="text-gray-400 mt-2">Cek lagi nanti atau bicara dengan NPC Guild!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredMisi.map((log) => (
                                    <div
                                        key={log.id_log}
                                        className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border ${
                                            log.misi?.status_misi === 'selesai'
                                                ? 'border-green-600/30 bg-stone-800/50'
                                                : 'border-yellow-600/30 bg-stone-800/70'
                                        }`}
                                    >
                                        {/* Status Badge */}
                                        <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full ${
                                            log.misi?.status_misi === 'selesai'
                                                ? 'bg-green-700/80 text-green-100'
                                                : 'bg-yellow-700/80 text-yellow-100'
                                        }`}>
                                            {log.misi?.status_misi === 'selesai' ? 'SELESAI' : 'AKTIF'}
                                        </div>

                                        <div className="p-5">
                                            {/* Mission Title */}
                                            <h3 className="text-xl font-bold text-yellow-400 mb-2 font-serif">
                                                {log.misi?.judul_misi || "Misi Rahasia"}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                                {log.misi?.deskripsi || "Deskripsi tidak tersedia..."}
                                            </p>

                                            {/* Rewards Section */}
                                            <div className="bg-stone-700/50 p-3 rounded-lg mb-4">
                                                <p className="text-yellow-300 text-sm font-medium mb-2">🎁 Hadiah:</p>
                                                <div className="flex justify-between">
                                                    <span className="flex items-center text-yellow-200">
                                                        <span className="mr-1">🪙</span> {log.misi?.hadiah_koin ?? 0} Koin
                                                    </span>
                                                    <span className="flex items-center text-yellow-200">
                                                        <span className="mr-1">✨</span> {log.misi?.hadiah_xp ?? 0} XP
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Level Requirement & Action Button */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-400">
                                                    ⚔️ Level {log.misi?.level_required || "1"}
                                                </span>
                                                {log.misi?.status_misi !== 'selesai' && (
                                                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-1 px-3 rounded-lg transition">
                                                        Ambil Misi
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardMisiPetualang;