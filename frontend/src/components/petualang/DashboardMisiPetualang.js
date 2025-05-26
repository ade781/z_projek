import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const DashboardMisiPetualang = () => {
    const [misiList, setMisiList] = useState([]);
    const [filterStatus, setFilterStatus] = useState("semua");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedMission, setExpandedMission] = useState(null);

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
                setMisiList(res.data.data || []);
            } catch (err) {
                setError("Gagal memuat data misi. Silakan coba lagi.");
                console.error("Error fetching missions:", err);
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

    const toggleExpandMission = (id) => {
        setExpandedMission(expandedMission === id ? null : id);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "aktif":
                return "bg-yellow-500 text-black";
            case "selesai":
                return "bg-green-600 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    return (
       <div className="min-h-screen bg-gradient-to-b from-yellow-600 via-amber-700 to-red-800 py-8 px-4 sm:px-6 lg:px-8">

            {/* Adventure Header */}
            <div className="max-w-6xl mx-auto mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-amber-900 font-serif tracking-wide mb-2">
                    <span className="inline-block bg-amber-100 px-6 py-3 rounded-lg border-2 border-amber-300 shadow-lg">
                        Riwayat Petualangan
                    </span>
                </h1>
                <p className="text-amber-800 italic">
                    "Catatan perjalanan dan pencapaianmu"
                </p>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
                {/* Filter Section */}
               <div className="mb-8 bg-amber-200/30 backdrop-blur-sm p-4 rounded-xl border border-amber-300/50 shadow-lg shadow-yellow-100/30">

                    <label className="block text-sm font-medium text-amber-900 mb-2">
                        Filter Status:
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {["semua", "aktif", "selesai"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterStatus === status
                                        ? "bg-amber-600 text-white shadow-inner"
                                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
                        <p>{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredMisi.length === 0 && (
                    <div className="text-center py-12 bg-amber-50/50 rounded-xl border-2 border-dashed border-amber-300">
                        <svg
                            className="mx-auto h-12 w-12 text-amber-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-amber-900">
                            Tidak ada misi ditemukan
                        </h3>
                        <p className="mt-1 text-amber-800">
                            {filterStatus === "semua"
                                ? "Kamu belum memiliki riwayat misi"
                                : `Tidak ada misi dengan status "${filterStatus}"`}
                        </p>
                    </div>
                )}

                {/* Mission List */}
                {!loading && !error && filteredMisi.length > 0 && (
                    <div className="space-y-4">
                        {filteredMisi.map((log) => (
                            <div
                                key={log.id_log}
                                className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${log.misi?.status_misi === "selesai"
                                        ? "border-green-500/30"
                                        : "border-amber-500/30"
                                    } transition-all hover:shadow-lg`}
                            >
                                {/* Mission Header */}
                                <div
                                    className={`p-4 cursor-pointer flex justify-between items-center ${log.misi?.status_misi === "selesai"
                                            ? "bg-green-600/10"
                                            : "bg-amber-600/10"
                                        }`}
                                    onClick={() => toggleExpandMission(log.id_log)}
                                >
                                    <div>
                                        <h3 className="text-lg font-bold text-amber-900">
                                            {log.misi?.judul_misi || "Judul tidak tersedia"}
                                        </h3>
                                        <div className="flex items-center mt-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.misi?.status_misi)}`}>
                                                {log.misi?.status_misi || "-"}
                                            </span>
                                        </div>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-amber-700 transform transition-transform ${expandedMission === log.id_log ? "rotate-180" : ""
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>

                                {/* Expanded Content */}
                                {expandedMission === log.id_log && (
                                    <div className="p-4 border-t border-amber-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-amber-800 mb-1">
                                                    Deskripsi Misi:
                                                </h4>
                                                <p className="text-amber-900">
                                                    {log.misi?.deskripsi || "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-amber-800 mb-1">
                                                    Level Dibutuhkan:
                                                </h4>
                                                <p className="text-amber-900">
                                                    {log.misi?.level_required || "-"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Rewards */}
                                        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                                            <h4 className="text-sm font-medium text-amber-800 mb-2">
                                                Hadiah Petualangan:
                                            </h4>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                                                        <svg
                                                            className="w-5 h-5 text-amber-600"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <span className="font-bold text-amber-900">
                                                        {log.misi?.hadiah_koin ?? 0} Koin
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                                                        <svg
                                                            className="w-5 h-5 text-green-600"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <span className="font-bold text-green-900">
                                                        {log.misi?.hadiah_xp ?? 0} XP
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardMisiPetualang;