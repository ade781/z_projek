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
    const [petualang, setPetualang] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

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
                setPetualang(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch petualang", err);
                setError(err.response?.data?.message || "Gagal memuat data petualang");
                setLoading(false);
            }
        };

        fetchPetualang();
    }, []);

    const handleEdit = () => {
        navigate(`/edit-petualang/${petualang.id_petualang}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-indigo-900 to-purple-900">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-amber-200 font-medium text-lg animate-pulse">
                    Membuka peta petualangan...
                </p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-indigo-900 to-purple-900">
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 p-6 rounded-xl shadow-lg max-w-md">
                <p className="font-bold text-xl mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Error
                </p>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white font-medium transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
        </div>
    );

    if (!petualang) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-indigo-900 to-purple-900">
            <div className="text-center bg-indigo-800/50 backdrop-blur-sm p-8 rounded-xl border border-indigo-600/30 shadow-lg">
                <svg className="mx-auto h-16 w-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-bold text-amber-200">Data Petualang Tidak Ditemukan</h3>
                <p className="mt-2 text-indigo-100">Anda belum terdaftar sebagai petualang</p>
                <button
                    onClick={() => navigate('/register-petualang')}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-full text-white font-bold shadow-lg hover:shadow-amber-500/30 transition-all"
                >
                    Daftar Sekarang
                </button>
            </div>
        </div>
    );

    // Calculate level progress
    const currentXP = petualang.poin_pengalaman;
    const currentLevel = petualang.level;
    const xpForCurrentLevel = getXPForLevel(currentLevel);
    const xpForNextLevel = getXPForLevel(currentLevel + 1);
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const xpProgress = currentXP - xpForCurrentLevel;
    const percentProgress = Math.min(100, Math.max(0, (xpProgress / xpNeededForNextLevel) * 100));

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-700 via-amber-700 to-black py-12 px-4 sm:px-6 lg:px-8">

            {/* Floating Adventure Elements */}
            <div className="fixed top-20 left-10 w-16 h-16 bg-amber-400/20 rounded-full animate-float1"></div>
            <div className="fixed top-1/3 right-16 w-12 h-12 bg-teal-400/20 rounded-full animate-float2"></div>
            <div className="fixed bottom-1/4 left-1/4 w-10 h-10 bg-purple-400/20 rounded-full animate-float3"></div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 font-serif tracking-wide mb-4">
                        Peta Petualangan
                    </h1>
                    <p className="text-indigo-200 italic">
                        "Catatan perjalanan seorang {petualang.role.toLowerCase()}"
                    </p>
                </div>

                {/* Adventure Card */}
                <div
                    className={`relative bg-gradient-to-br from-amber-600/50 to-red-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-amber-400/30 shadow-xl transition-all duration-500 ${isHovered ? 'scale-[1.02] shadow-yellow-400/30' : ''}`}

                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Card Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400/10 rounded-full transform -translate-x-20 translate-y-20"></div>

                    {/* Card Content */}
                    <div className="relative z-10 p-8">
                        {/* Profile Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg border-4 border-amber-300/80 overflow-hidden">
                                    <span className="text-3xl font-bold text-white">
                                        {petualang.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-amber-300">
                                    Lv. {currentLevel}
                                </div>
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl font-bold text-white mb-1">{petualang.username}</h2>
                                <p className="text-amber-300 capitalize">{petualang.role}</p>
                                <p className="text-indigo-300 text-sm mt-2">
                                    Bergabung: {new Date(petualang.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {/* Koin */}
                            <div className="bg-indigo-900/40 rounded-xl p-4 border border-indigo-700/50 hover:bg-indigo-800/60 transition-colors">
                                <div className="flex items-center justify-center w-12 h-12 bg-amber-500/20 rounded-lg mb-2 mx-auto">
                                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-center text-sm text-indigo-300 mb-1">Koin</h3>
                                <p className="text-center text-xl font-bold text-white">{petualang.koin}</p>
                            </div>

                            {/* Misi Selesai */}
                            <div className="bg-indigo-900/40 rounded-xl p-4 border border-indigo-700/50 hover:bg-indigo-800/60 transition-colors">
                                <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mb-2 mx-auto">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-center text-sm text-indigo-300 mb-1">Misi Selesai</h3>
                                <p className="text-center text-xl font-bold text-white">{petualang.jumlah_misi_selesai}</p>
                            </div>

                            {/* XP */}
                            <div className="bg-indigo-900/40 rounded-xl p-4 border border-indigo-700/50 hover:bg-indigo-800/60 transition-colors">
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-2 mx-auto">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-center text-sm text-indigo-300 mb-1">Total XP</h3>
                                <p className="text-center text-xl font-bold text-white">{petualang.poin_pengalaman}</p>
                            </div>

                            {/* Progress */}
                            <div className="bg-indigo-900/40 rounded-xl p-4 border border-indigo-700/50 hover:bg-indigo-800/60 transition-colors">
                                <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-2 mx-auto">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-center text-sm text-indigo-300 mb-1">Progress Level</h3>
                                <p className="text-center text-xl font-bold text-white">{percentProgress.toFixed(1)}%</p>
                            </div>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-amber-300">Level {currentLevel}</span>
                                <span className="text-sm font-medium text-amber-300">Level {currentLevel + 1}</span>
                            </div>
                            <div className="w-full bg-indigo-800/60 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full shadow-lg shadow-amber-500/30 transition-all duration-1000 ease-out"
                                    style={{ width: `${percentProgress}%` }}
                                ></div>
                            </div>
                            <div className="text-right mt-1">
                                <span className="text-xs text-indigo-300">
                                    {xpProgress}/{xpNeededForNextLevel} XP
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={handleEdit}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-full text-white font-bold shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profil
                            </button>
                            <button
                                onClick={() => navigate('/misi')}
                                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-full text-white font-bold shadow-lg hover:shadow-amber-500/30 transition-all flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                Lihat Misi
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            {/* Custom Animations */}
            <style>{`
                @keyframes float1 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-3deg); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                .animate-float1 { animation: float1 8s ease-in-out infinite; }
                .animate-float2 { animation: float2 6s ease-in-out infinite; }
                .animate-float3 { animation: float3 7s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default DashboardPetualang;
