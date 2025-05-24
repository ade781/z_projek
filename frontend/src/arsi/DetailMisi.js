import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";
import { FaArrowLeft, FaCoins, FaStar, FaShieldAlt, FaFlag, FaCheck, FaHourglassStart, FaSkullCrossbones, FaMapMarkerAlt, FaCalendarAlt, FaUserAlt } from "react-icons/fa";

const DetailMisi = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [misi, setMisi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showQuestGiver, setShowQuestGiver] = useState(false);

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
                setMisi(res.data.data || res.data);

                // Simulate progress if mission is in progress
                if ((res.data.data || res.data).status_misi === "dalam progres") {
                    simulateProgress();
                }
            } catch (error) {
                setErrorMsg("Gagal mengambil detail misi.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMisiDetail();
    }, [id]);

    const simulateProgress = () => {
        setIsAnimating(true);
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 10;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                setIsAnimating(false);
            }
            setProgress(currentProgress);
        }, 300);
    };

    const handleAmbilMisi = async () => {
        setErrorMsg("");
        setSuccessMsg("");
        setShowConfirmation(false);

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
            simulateProgress();

        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Gagal mengambil misi. Coba lagi nanti.");
            console.error(error);
        }
    };

    const handleCompleteMission = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const id_petualang = localStorage.getItem("id_petualang");

            const res = await axios.post(
                `${BASE_URL}/misi/complete-misi`,
                { id_petualang, id_misi: misi.id_misi },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.message === "Misi berhasil diselesaikan") {
                setSuccessMsg("Misi berhasil diselesaikan! Hadiah telah ditambahkan ke akun Anda.");
                // Refresh mission data
                const resRefresh = await axios.get(`${BASE_URL}/misi/${misi.id_misi}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMisi(resRefresh.data.data || resRefresh.data);
                setProgress(100);
            } else {
                setErrorMsg(res.data.message || "Gagal menyelesaikan misi.");
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Gagal menyelesaikan misi.");
            console.error(error);
        }
    };

    const handleAbandonMission = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const id_petualang = localStorage.getItem("id_petualang");

            const res = await axios.post(
                `${BASE_URL}/misi/abandon-misi`,
                { id_petualang, id_misi: misi.id_misi },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.message === "Misi berhasil dibatalkan") {
                setSuccessMsg("Misi telah dibatalkan.");
                // Refresh mission data
                const resRefresh = await axios.get(`${BASE_URL}/misi/${misi.id_misi}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMisi(resRefresh.data.data || resRefresh.data);
                setProgress(0);
            } else {
                setErrorMsg(res.data.message || "Gagal membatalkan misi.");
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Gagal membatalkan misi.");
            console.error(error);
        }
    };

    const renderStatusBadge = () => {
        switch (misi.status_misi) {
            case "belum diambil":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        <FaHourglassStart className="mr-1" /> Available
                    </span>
                );
            case "dalam progres":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <FaFlag className="mr-1" /> In Progress
                    </span>
                );
            case "selesai":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FaCheck className="mr-1" /> Completed
                    </span>
                );
            case "dibatalkan":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <FaSkullCrossbones className="mr-1" /> Abandoned
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <FaShieldAlt className="mr-1" /> {misi.status_misi}
                    </span>
                );
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-lg font-medium text-gray-700">Memuat detail misi...</p>
            </div>
        </div>
    );

    if (errorMsg) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
                <p className="text-gray-600 mb-6">{errorMsg}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                    Kembali
                </button>
            </div>
        </div>
    );

    if (!misi) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
                <div className="text-gray-500 text-5xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Misi Tidak Ditemukan</h2>
                <p className="text-gray-600 mb-6">Misi yang Anda cari tidak ditemukan atau mungkin telah dihapus.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                    Kembali
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
            {/* Header */}
            <header className="bg-amber-800 text-white shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-amber-200 hover:text-white transition-colors"
                        >
                            <FaArrowLeft className="mr-2" /> Kembali
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold text-center font-serif">Papan Misi Petualangan</h1>
                        <div className="w-8"></div> {/* Spacer for alignment */}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Mission Card */}
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-amber-700 mb-8">
                        {/* Mission Header */}
                        <div className="bg-amber-700 p-6 text-white relative">
                            <div className="absolute top-4 right-4">
                                {renderStatusBadge()}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2 font-serif">{misi.judul_misi}</h2>
                            <div className="flex items-center text-amber-200">
                                <FaUserAlt className="mr-2" />
                                <span className="text-sm">Ditawarkan oleh: {misi.quest_giver || "Guild Owner"}</span>
                            </div>
                        </div>

                        {/* Mission Body */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {/* Left Column */}
                                <div className="md:col-span-2">
                                    <h3 className="text-xl font-bold mb-4 text-amber-800 border-b pb-2">Deskripsi Misi</h3>
                                    <p className="text-gray-700 mb-6 whitespace-pre-line">{misi.deskripsi}</p>

                                    {misi.tujuan_misi && (
                                        <>
                                            <h3 className="text-xl font-bold mb-4 text-amber-800 border-b pb-2">Tujuan Misi</h3>
                                            <ul className="list-disc pl-5 text-gray-700 mb-6">
                                                {Array.isArray(misi.tujuan_misi) ? (
                                                    misi.tujuan_misi.map((tujuan, index) => (
                                                        <li key={index} className="mb-2">{tujuan}</li>
                                                    ))
                                                ) : (
                                                    <li>{misi.tujuan_misi}</li>
                                                )}
                                            </ul>
                                        </>
                                    )}

                                    {misi.catatan && (
                                        <>
                                            <h3 className="text-xl font-bold mb-4 text-amber-800 border-b pb-2">Catatan Penting</h3>
                                            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-gray-700 mb-6">
                                                <p className="whitespace-pre-line">{misi.catatan}</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Right Column - Mission Details */}
                                <div className="space-y-6">
                                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                        <h3 className="font-bold text-lg mb-3 text-amber-800">Detail Misi</h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <FaShieldAlt className="text-amber-600 mr-2" />
                                                <span className="font-medium">Level Dibutuhkan: </span>
                                                <span className="ml-auto bg-amber-100 px-2 py-1 rounded text-sm font-bold">
                                                    {misi.level_required}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <FaCoins className="text-amber-600 mr-2" />
                                                <span className="font-medium">Hadiah Koin: </span>
                                                <span className="ml-auto bg-amber-100 px-2 py-1 rounded text-sm font-bold">
                                                    {misi.hadiah_koin} <FaCoins className="inline ml-1 text-amber-500" />
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <FaStar className="text-amber-600 mr-2" />
                                                <span className="font-medium">Hadiah XP: </span>
                                                <span className="ml-auto bg-amber-100 px-2 py-1 rounded text-sm font-bold">
                                                    {misi.hadiah_xp} <FaStar className="inline ml-1 text-amber-500" />
                                                </span>
                                            </div>

                                            {misi.lokasi && (
                                                <div className="flex items-start">
                                                    <FaMapMarkerAlt className="text-amber-600 mr-2 mt-1" />
                                                    <div>
                                                        <span className="font-medium">Lokasi: </span>
                                                        <p className="text-gray-700">{misi.lokasi}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {misi.deadline && (
                                                <div className="flex items-center">
                                                    <FaCalendarAlt className="text-amber-600 mr-2" />
                                                    <span className="font-medium">Deadline: </span>
                                                    <span className="ml-auto">{new Date(misi.deadline).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quest Giver */}
                                    <div
                                        className="bg-amber-50 rounded-lg p-4 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
                                        onClick={() => setShowQuestGiver(!showQuestGiver)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg text-amber-800">Pemberi Misi</h3>
                                            <span className="text-amber-600">{showQuestGiver ? "▲" : "▼"}</span>
                                        </div>
                                        {showQuestGiver && (
                                            <div className="mt-3 flex items-center">
                                                <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center mr-3">
                                                    <FaUserAlt className="text-amber-600 text-xl" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{misi.quest_giver || "Penjaga Desa"}</p>
                                                    <p className="text-sm text-gray-600">Tingkat Kesulitan: {misi.kesulitan || "Sedang"}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    {(misi.status_misi === "dalam progres" || progress > 0) && (
                                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                            <h3 className="font-bold text-lg mb-2 text-amber-800">Progress Misi</h3>
                                            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                                                <div
                                                    className="bg-amber-600 h-4 rounded-full transition-all duration-500 ease-out"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-right text-sm text-gray-600">
                                                {Math.round(progress)}% selesai
                                                {isAnimating && " (memperbarui...)"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="border-t pt-6 mt-6 flex flex-wrap gap-4 justify-center">
                                {misi.status_misi === "belum diambil" && (
                                    <>
                                        <button
                                            onClick={() => setShowConfirmation(true)}
                                            className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center"
                                        >
                                            <FaFlag className="mr-2" /> Ambil Misi Ini
                                        </button>
                                        <button
                                            onClick={() => navigate(-1)}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                        >
                                            Lihat Misi Lain
                                        </button>
                                    </>
                                )}

                                {misi.status_misi === "dalam progres" && (
                                    <>
                                        <button
                                            onClick={handleCompleteMission}
                                            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center"
                                            disabled={progress < 100}
                                        >
                                            <FaCheck className="mr-2" /> Selesaikan Misi
                                        </button>
                                        <button
                                            onClick={handleAbandonMission}
                                            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center"
                                        >
                                            <FaSkullCrossbones className="mr-2" /> Batalkan Misi
                                        </button>
                                        <button
                                            onClick={() => navigate('/misi')}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                        >
                                            Lihat Misi Lain
                                        </button>
                                    </>
                                )}

                                {(misi.status_misi === "selesai" || misi.status_misi === "dibatalkan") && (
                                    <button
                                        onClick={() => navigate('/misi')}
                                        className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
                                    >
                                        Temukan Misi Baru
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {errorMsg && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
                            <div className="flex items-center">
                                <FaSkullCrossbones className="mr-2" />
                                <p>{errorMsg}</p>
                            </div>
                        </div>
                    )}

                    {successMsg && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg">
                            <div className="flex items-center">
                                <FaCheck className="mr-2" />
                                <p>{successMsg}</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 text-amber-800">Konfirmasi Ambil Misi</h3>
                        <p className="mb-6">Anda yakin ingin mengambil misi <span className="font-bold">"{misi.judul_misi}"</span>?</p>

                        <div className="bg-amber-50 p-4 rounded-lg mb-6">
                            <h4 className="font-bold mb-2">Persyaratan:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Level Anda harus minimal {misi.level_required}</li>
                                <li>Anda tidak bisa mengambil misi lain sampai menyelesaikan ini</li>
                            </ul>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAmbilMisi}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center"
                            >
                                <FaFlag className="mr-2" /> Ambil Misi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-amber-900 text-amber-100 py-6 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p>© 2023 Papan Misi Petualangan. Semua hak dilindungi.</p>
                    <p className="mt-2 text-sm opacity-80">Temukan petualangan baru setiap hari dan tingkatkan level Anda!</p>
                </div>
            </footer>
        </div>
    );
};

export default DetailMisi;