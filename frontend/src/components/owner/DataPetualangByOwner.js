import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const DataPetualang = () => {
    const [petualangs, setPetualangs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPetualang, setSelectedPetualang] = useState(null);
    const navigate = useNavigate();

    const roleEmojis = {
        swordsman: "⚔️",
        mage: "🔮",
        archer: "🏹",
        healer: "💉",
        thief: "🗡️",
        monk: "🧘",
        necromancer: "☠️",
        summoner: "👾",
        berserker: "🤬",
        paladin: "🛡️",
        alchemist: "🧪",
        beast_tamer: "🐾"
    };

    useEffect(() => {
        const fetchPetualangs = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const res = await axios.get(`${BASE_URL}/petualang`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = res.data.data || res.data;
                const cleanData = Array.isArray(data)
                    ? data.map((p) => ({
                        id_petualang: p.id_petualang,
                        username: p.username,
                        role: p.role,
                        level: p.level,
                        koin: p.koin || 0,
                        jumlah_misi_selesai: p.jumlah_misi_selesai || 0,
                        poin_pengalaman: p.poin_pengalaman || 0,
                        reputasi: p.reputasi || 0,
                        is_banned: p.is_banned || false,
                        banned_until: p.banned_until,
                        created_at: p.created_at
                    }))
                    : [];

                setPetualangs(cleanData);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch petualang", err);
                setErrorMsg("Gagal memuat data petualang.");
                setLoading(false);
            }
        };

        fetchPetualangs();
    }, [navigate]);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedPetualangs = React.useMemo(() => {
        let sortableItems = [...petualangs];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [petualangs, sortConfig]);

    const filteredPetualangs = sortedPetualangs.filter((p) =>
        p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id_petualang.toString().includes(searchTerm)
    );

    const handleDeleteClick = (petualang) => {
        setSelectedPetualang(petualang);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedPetualang) return;

        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.delete(
                `${BASE_URL}/petualang/delete-petualang/${selectedPetualang.id_petualang}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data.status === "Success") {
                setPetualangs((prev) =>
                    prev.filter((p) => p.id_petualang !== selectedPetualang.id_petualang)
                );
                setShowDeleteModal(false);
            } else {
                setErrorMsg("Gagal menghapus petualang, coba lagi.");
            }
        } catch (error) {
            setErrorMsg("Terjadi kesalahan saat menghapus petualang.");
            console.error(error);
        }
    };

    const handleBan = async (petualang, days = 7) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(
                `${BASE_URL}/petualang/ban/${petualang.id_petualang}`,
                { days },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPetualangs((prev) =>
                prev.map((p) =>
                    p.id_petualang === petualang.id_petualang
                        ? { ...p, is_banned: true }
                        : p
                )
            );
        } catch (error) {
            setErrorMsg("Gagal memblokir petualang.");
        }
    };

    const handleUnban = async (petualang) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(
                `${BASE_URL}/petualang/unban/${petualang.id_petualang}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPetualangs((prev) =>
                prev.map((p) =>
                    p.id_petualang === petualang.id_petualang
                        ? { ...p, is_banned: false, banned_until: null }
                        : p
                )
            );
        } catch (error) {
            setErrorMsg("Gagal mencabut ban petualang.");
        }
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return "↕️";
        return sortConfig.direction === "asc" ? "⬆️" : "⬇️";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-blue-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="text-red-500 text-center text-lg mb-4">{errorMsg}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800">Data Petualang</h1>
                        <p className="text-blue-600">
                            Daftar semua petualang yang terdaftar dalam sistem
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/register-petualang")}
                        className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Tambah Petualang</span>
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Cari petualang..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm text-gray-500">
                            Menampilkan {filteredPetualangs.length} dari {petualangs.length} petualang
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("id_petualang")}
                                    >
                                        <div className="flex items-center">
                                            ID {getSortIcon("id_petualang")}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("username")}
                                    >
                                        <div className="flex items-center">
                                            Username {getSortIcon("username")}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("role")}
                                    >
                                        <div className="flex items-center">
                                            Class {getSortIcon("role")}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("level")}
                                    >
                                        <div className="flex items-center">
                                            Level {getSortIcon("level")}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("jumlah_misi_selesai")}
                                    >
                                        <div className="flex items-center">
                                            Misi Selesai {getSortIcon("jumlah_misi_selesai")}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("poin_pengalaman")}
                                    >
                                        <div className="flex items-center">
                                            XP {getSortIcon("poin_pengalaman")}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("reputasi")}
                                    >
                                        <div className="flex items-center">
                                            Reputasi {getSortIcon("reputasi")}
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                                    >
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPetualangs.length > 0 ? (
                                    filteredPetualangs.map((p) => (
                                        <tr key={p.id_petualang} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {p.id_petualang}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {p.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <span className="mr-2">{roleEmojis[p.role] || "👤"}</span>
                                                    <span className="capitalize">{p.role.replace("_", " ")}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                                        <span className="text-blue-800 font-medium">{p.level}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-yellow-500 mr-1"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    {p.jumlah_misi_selesai}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-green-500 mr-1"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                                        />
                                                    </svg>
                                                    {p.poin_pengalaman}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 py-1 rounded-full text-xs ${p.reputasi < 40 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                                    {p.reputasi}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleDeleteClick(p)}
                                                        className="text-red-600 hover:text-red-900 transition-colors flex items-center"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 mr-1"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                        Hapus
                                                    </button>
                                                    {p.is_banned ? (
                                                        <button
                                                            onClick={() => handleUnban(p)}
                                                            className="text-green-600 hover:text-green-900 transition-colors flex items-center"
                                                        >
                                                            Cabut Ban
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleBan(p, 7)}
                                                            className="text-yellow-600 hover:text-yellow-800 transition-colors flex items-center"
                                                        >
                                                            Ban 7 hari
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            Tidak ada petualang yang ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedPetualang && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl transform transition-all duration-300 scale-100 max-w-md w-full">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">
                                Konfirmasi Penghapusan
                            </h3>
                            <p className="mb-6 text-gray-600">
                                Apakah Anda yakin ingin menghapus petualang{" "}
                                <span className="font-semibold">{selectedPetualang.username}</span>? Aksi ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataPetualang;
