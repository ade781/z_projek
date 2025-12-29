import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const SideBarOwner = ({ setFilterStatus }) => {
    const navigate = useNavigate();
    const ownerName = localStorage.getItem("nama_owner") || "Guild Master";
    const [misiMenuOpen, setMisiMenuOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("id_owner");
        localStorage.removeItem("nama_owner");
        navigate("/login-owner");
    };

    return (
        <div className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-indigo-900 to-indigo-800 text-white p-4 flex flex-col shadow-xl rounded-r-2xl overflow-hidden z-50 border-r-2 border-yellow-500 border-opacity-30">
            {/* Guild Crest Decoration */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-500 rounded-full opacity-10"></div>
            <div className="absolute -right-16 top-1/4 w-24 h-24 bg-indigo-700 rounded-full opacity-20"></div>

            {/* Guild Header */}
            <div className="flex flex-col items-center mb-8 pt-4">
                <img
                    src="/logo-guild.png"
                    alt="Guild Logo"
                    className="w-16 h-16 mb-3 animate-float"
                />
                <h2 className="text-xl font-bold text-yellow-300">Guild Hoshigami</h2>
                <p className="text-indigo-200 text-sm">Pemilik Guild</p>
            </div>

            {/* Guild Master Info */}
            <div className="bg-indigo-800 rounded-lg p-4 mb-6 border border-yellow-500 border-opacity-30 relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-yellow-500 rounded-full opacity-10"></div>
                <div className="flex items-center space-x-3 z-10">
                    <div className="bg-yellow-500 w-10 h-10 rounded-full flex items-center justify-center text-indigo-900 font-bold shadow-md">
                        {ownerName.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm text-indigo-200">Selamat datang,</p>
                        <p className="font-bold text-yellow-300 truncate max-w-[160px]">{ownerName}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-800 pr-2">
                <NavLink
                    to="/misi-owner"
                    className={({ isActive }) =>
                        `flex items-center space-x-2 p-3 rounded-lg transition-all ${isActive ? 'bg-yellow-600 text-white font-bold shadow-md' : 'hover:bg-indigo-700 text-indigo-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Papan Misi</span>
                </NavLink>

                {/* Mission Filter Dropdown */}
                <div className="bg-indigo-800 rounded-lg overflow-hidden border border-indigo-700">
                    <div
                        onClick={() => setMisiMenuOpen(!misiMenuOpen)}
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-indigo-700 transition-all"
                    >
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span>Filter Misi</span>
                        </div>
                        <span className="text-yellow-400">{misiMenuOpen ? "▼" : "▶"}</span>
                    </div>

                    {misiMenuOpen && (
                        <div className="pl-4 pb-2 space-y-1">
                            <button
                                onClick={() => setFilterStatus("semua")}
                                className="w-full text-left px-3 py-2 rounded hover:bg-indigo-700 transition-all text-sm flex items-center"
                            >
                                <span className="w-2 h-2 rounded-full bg-white mr-2"></span>
                                Semua Misi
                            </button>
                            <button
                                onClick={() => setFilterStatus("belum diambil")}
                                className="w-full text-left px-3 py-2 rounded hover:bg-indigo-700 transition-all text-sm flex items-center"
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                                Belum Diambil
                            </button>
                            <button
                                onClick={() => setFilterStatus("aktif")}
                                className="w-full text-left px-3 py-2 rounded hover:bg-indigo-700 transition-all text-sm flex items-center"
                            >
                                <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                                Misi Aktif
                            </button>
                            <button
                                onClick={() => setFilterStatus("selesai")}
                                className="w-full text-left px-3 py-2 rounded hover:bg-indigo-700 transition-all text-sm flex items-center"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                                Misi Selesai
                            </button>
                            <button
                                onClick={() => setFilterStatus("batal")}
                                className="w-full text-left px-3 py-2 rounded hover:bg-indigo-700 transition-all text-sm flex items-center"
                            >
                                <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                                Misi Batal
                            </button>
                        </div>
                    )}
                </div>

                <NavLink
                    to="/misi-owner/tambah"
                    className={({ isActive }) =>
                        `flex items-center space-x-2 p-3 rounded-lg transition-all ${isActive ? 'bg-yellow-600 text-white font-bold shadow-md' : 'hover:bg-indigo-700 text-indigo-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Buat Misi Baru</span>
                </NavLink>

                <NavLink
                    to="/register-petualang"
                    className={({ isActive }) =>
                        `flex items-center space-x-2 p-3 rounded-lg transition-all ${isActive ? 'bg-yellow-600 text-white font-bold shadow-md' : 'hover:bg-indigo-700 text-indigo-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Rekrut Petualang</span>
                </NavLink>

                <NavLink
                    to="/data-petualang"
                    className={({ isActive }) =>
                        `flex items-center space-x-2 p-3 rounded-lg transition-all ${isActive ? 'bg-yellow-600 text-white font-bold shadow-md' : 'hover:bg-indigo-700 text-indigo-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Daftar Petualang</span>
                </NavLink>

                <NavLink
                    to="/review-center"
                    className={({ isActive }) =>
                        `flex items-center space-x-2 p-3 rounded-lg transition-all ${isActive ? 'bg-yellow-600 text-white font-bold shadow-md' : 'hover:bg-indigo-700 text-indigo-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Review Misi</span>
                </NavLink>

                <NavLink
                    to="/request-misi-warga"
                    className={({ isActive }) =>
                        `flex items-center space-x-2 p-3 rounded-lg transition-all ${isActive ? 'bg-yellow-600 text-white font-bold shadow-md' : 'hover:bg-indigo-700 text-indigo-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                    </svg>
                    <span>Request Warga</span>
                </NavLink>

                <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                        `flex items-center space-x-2 p-3 rounded-lg transition-all ${isActive ? 'bg-yellow-600 text-white font-bold shadow-md' : 'hover:bg-indigo-700 text-indigo-100'}`
                    }
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3v18m4-14v14m4-10v10M7 9v12M3 13v8" />
                    </svg>
                    <span>Analitik Guild</span>
                </NavLink>
            </nav>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="mt-auto flex items-center space-x-2 p-3 rounded-lg hover:bg-red-700 transition-all text-red-100 hover:text-white border border-red-700 hover:border-red-600 mb-4"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Keluar Guild</span>
            </button>

            {/* Decorative Bottom Elements */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 to-transparent opacity-20"></div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-yellow-400 rounded-full opacity-30"></div>
        </div>
    );
};

export default SideBarOwner;
