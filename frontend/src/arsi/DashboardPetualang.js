import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";

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

                const data = res.data.data || res.data;
                setPetualangs([data]);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch petualang", err);
                setError(err.response?.data?.message || "Peta petualangan hilang!");
                setLoading(false);
            }
        };

        fetchPetualang();
    }, []);

    const handleEdit = (id_petualang) => {
        navigate(`/edit-petualang/${id_petualang}`);
    };

    if (loading) return (
        <div className="min-h-screen bg-amber-900 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-bounce">
                    <svg className="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                </div>
                <p className="mt-4 text-amber-200 font-bold text-xl">Memuat peta petualangan...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-red-900 flex items-center justify-center">
            <div className="bg-red-800 border-l-4 border-red-500 p-4 max-w-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-bold text-red-100">Gagal Memuat!</h3>
                        <p className="text-red-200">{error}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-900 to-gray-900 p-4 md:p-8">
            {/* Header dengan efek parchment */}
            <div className="relative mb-10">
                <div className="absolute inset-0 bg-amber-800 rounded-xl opacity-20"></div>
                <div className="relative bg-amber-100 bg-opacity-10 backdrop-blur-sm border border-amber-700 rounded-xl p-6 shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-amber-300 font-serif tracking-wider">
                                {petualangs[0]?.username || "Petualang Tak Dikenal"}
                            </h1>
                            <p className="text-amber-200 italic">"{getRandomTitle(petualangs[0]?.level || 1)}"</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center">
                            <div className="bg-amber-900 border-2 border-amber-600 rounded-full p-2 mr-4">
                                <span className="text-amber-200 text-2xl font-bold">
                                    Lv. {petualangs[0]?.level || 1}
                                </span>
                            </div>
                            <button 
                                onClick={() => handleEdit(petualangs[0]?.id_petualang)}
                                className="bg-amber-600 hover:bg-amber-700 text-amber-100 font-bold py-2 px-4 rounded-lg border border-amber-800 flex items-center transition-all duration-300 hover:scale-105"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                Edit Profil
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Card dengan efek kayu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Koin */}
                <div className="bg-amber-800 bg-opacity-60 border-2 border-amber-700 rounded-xl p-6 shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="bg-amber-600 rounded-full p-3 mr-4">
                            <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-amber-300 text-sm uppercase tracking-wider">Harta Karun</p>
                            <p className="text-2xl font-bold text-amber-100">{petualangs[0]?.koin || 0} Koin</p>
                        </div>
                    </div>
                </div>

                {/* Misi Selesai */}
                <div className="bg-amber-800 bg-opacity-60 border-2 border-amber-700 rounded-xl p-6 shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="bg-amber-600 rounded-full p-3 mr-4">
                            <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-amber-300 text-sm uppercase tracking-wider">Misi Ditaklukkan</p>
                            <p className="text-2xl font-bold text-amber-100">{petualangs[0]?.jumlah_misi_selesai || 0} Misi</p>
                        </div>
                    </div>
                </div>

                {/* XP */}
                <div className="bg-amber-800 bg-opacity-60 border-2 border-amber-700 rounded-xl p-6 shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="bg-amber-600 rounded-full p-3 mr-4">
                            <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-amber-300 text-sm uppercase tracking-wider">Poin Pengalaman</p>
                            <p className="text-2xl font-bold text-amber-100">{petualangs[0]?.poin_pengalaman || 0} XP</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar dengan efek ancient */}
            <div className="mb-10">
                <div className="flex justify-between mb-2">
                    <span className="text-amber-300 font-medium">Perkembangan Petualangan</span>
                    <span className="text-amber-200">
                        {Math.min(100, (petualangs[0]?.poin_pengalaman || 0) / 10)}% Menuju Level {petualangs[0]?.level ? petualangs[0].level + 1 : 2}
                    </span>
                </div>
                <div className="w-full bg-amber-900 rounded-full h-4">
                    <div 
                        className="bg-gradient-to-r from-amber-500 to-yellow-600 h-4 rounded-full shadow-lg shadow-amber-500/30" 
                        style={{ width: `${Math.min(100, (petualangs[0]?.poin_pengalaman || 0) / 10)}%` }}
                    ></div>
                </div>
            </div>

            {/* Detail Profil dengan scroll kuno */}
            <div className="bg-amber-800 bg-opacity-30 border-2 border-amber-700 rounded-xl p-6 shadow-lg mb-8">
                <h2 className="text-xl font-bold text-amber-300 mb-4 border-b border-amber-700 pb-2">Catatan Petualang</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-amber-400 font-medium mb-3">Identitas</h3>
                        <ul className="space-y-3">
                            <li className="flex justify-between border-b border-amber-700 pb-2">
                                <span className="text-amber-300">ID Petualang</span>
                                <span className="text-amber-100 font-mono">{petualangs[0]?.id_petualang || "???"}</span>
                            </li>
                            <li className="flex justify-between border-b border-amber-700 pb-2">
                                <span className="text-amber-300">Gelar</span>
                                <span className="text-amber-100 capitalize">{petualangs[0]?.role || "Penjelajah"}</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-amber-400 font-medium mb-3">Riwayat</h3>
                        <ul className="space-y-3">
                            <li className="flex justify-between border-b border-amber-700 pb-2">
                                <span className="text-amber-300">Bergabung Sejak</span>
                                <span className="text-amber-100">
                                    {petualangs[0]?.created_at ? new Date(petualangs[0].created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : "Waktu Tak Dikenal"}
                                </span>
                            </li>
                            <li className="flex justify-between border-b border-amber-700 pb-2">
                                <span className="text-amber-300">Status</span>
                                <span className="text-amber-100">{getActivityStatus(petualangs[0]?.jumlah_misi_selesai || 0)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Peta Petualangan (placeholder) */}
            <div className="bg-amber-800 bg-opacity-20 border-2 border-amber-700 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-amber-300 mb-4 border-b border-amber-700 pb-2">Peta Petualangan</h2>
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <svg className="w-24 h-24 mx-auto text-amber-500 opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                        </svg>
                        <p className="text-amber-400 italic">Peta petualanganmu masih kosong. Mulai jelajahi untuk mengisinya!</p>
                        <button className="mt-4 bg-amber-600 hover:bg-amber-700 text-amber-100 font-bold py-2 px-6 rounded-lg border border-amber-800 transition-all duration-300 hover:scale-105">
                            Mulai Petualangan Baru
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper functions
function getRandomTitle(level) {
    const titles = [
        "Penjelajah Pemula",
        "Pemburu Harta Karun",
        "Penakluk Misi",
        "Ahli Petualangan",
        "Legenda Hidup"
    ];
    return titles[Math.min(level - 1, titles.length - 1)] || "Petualang Misterius";
}

function getActivityStatus(missionsCompleted) {
    if (missionsCompleted === 0) return "Pemula";
    if (missionsCompleted < 5) return "Aktif";
    if (missionsCompleted < 10) return "Berpengalaman";
    return "Legenda";
}

export default DashboardPetualang;