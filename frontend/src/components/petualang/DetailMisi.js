import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";

const DetailMisi = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [misi, setMisi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isTakingMission, setIsTakingMission] = useState(false);

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
        setIsTakingMission(true);

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

            const resAmbil = await axios.post(
                `${BASE_URL}/logactivity/ambil-misi`,
                { id_petualang, id_misi: misi.id_misi },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (resAmbil.data.message !== "Misi berhasil diambil") {
                setErrorMsg(resAmbil.data.message || "Gagal mengambil misi (logactivity).");
                return;
            }

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
            const resRefresh = await axios.get(`${BASE_URL}/misi/${misi.id_misi}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMisi(resRefresh.data.data || resRefresh.data);

        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Gagal mengambil misi. Coba lagi nanti.");
            console.error(error);
        } finally {
            setIsTakingMission(false);
        }
    };

    const petualangId = Number(localStorage.getItem("id_petualang") || 0);
    const assignedId = Number(misi?.id_petualang_ambil ?? misi?.id_petualang ?? 0);
    const canPlayQuest = misi?.status_misi === "aktif" && petualangId && assignedId === petualangId;

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-amber-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-amber-800 font-medium text-lg">Memuat detail misi...</p>
            </div>
        </div>
    );

    if (errorMsg) return (
        <div className="flex justify-center items-center h-screen bg-amber-50">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
                <p className="font-bold">gas</p>
                <p>{errorMsg}</p>
            </div>
        </div>
    );

    if (!misi) return (
        <div className="flex justify-center items-center h-screen bg-amber-50">
            <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 max-w-md">
                <p className="font-bold">Misi Tidak Ditemukan</p>
                <p>Misi yang Anda cari tidak dapat ditemukan di peta petualangan.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* Mission Scroll */}
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border-2 border-amber-300 transform transition-all hover:shadow-xl hover:-translate-y-1">
                {/* Mission Header */}
                <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-amber-100 font-serif tracking-wide">
                                {misi.judul_misi}
                            </h2>
                            <div className="flex items-center mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    misi.status_misi === "belum diambil" 
                                        ? "bg-amber-200 text-amber-800" 
                                        : "bg-green-200 text-green-800"
                                }`}>
                                    {misi.status_misi}
                                </span>
                                <span className="ml-3 px-3 py-1 bg-amber-900 text-amber-100 rounded-full text-xs font-semibold">
                                    Level {misi.level_required}+
                                </span>
                            </div>
                        </div>
                        <div className="bg-amber-900 text-amber-100 p-3 rounded-lg shadow-inner border border-amber-700">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{misi.hadiah_koin}</div>
                                <div className="text-xs uppercase tracking-wider">Koin</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Deskripsi Misi
                        </h3>
                        <p className="text-gray-700 pl-7 border-l-2 border-amber-200">
                            {misi.deskripsi}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <h4 className="font-medium text-amber-900 mb-2 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Hadiah XP
                            </h4>
                            <p className="text-2xl font-bold text-amber-800">{misi.hadiah_xp} XP</p>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <h4 className="font-medium text-amber-900 mb-2 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Hadiah Koin
                            </h4>
                            <p className="text-2xl font-bold text-amber-800">{misi.hadiah_koin} Koin</p>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Persyaratan
                        </h3>
                        <ul className="space-y-2 pl-7">
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Level petualang minimal {misi.level_required}</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Misi belum pernah diambil sebelumnya</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-amber-200">
                        {successMsg && (
                            <div className="mb-4 sm:mb-0 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {successMsg}
                            </div>
                        )}
                        {errorMsg && (
                            <div className="mb-4 sm:mb-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {errorMsg}
                            </div>
                        )}
                        
                        {misi.status_misi === "belum diambil" && (
                            <button
                                onClick={handleAmbilMisi}
                                disabled={isTakingMission}
                                className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-300 flex items-center ${
                                    isTakingMission
                                        ? "bg-amber-400 cursor-not-allowed"
                                        : "bg-amber-600 hover:bg-amber-700 hover:shadow-lg transform hover:-translate-y-1"
                                }`}
                            >
                                {isTakingMission ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Ambil Misi Ini
                                </>
                            )}
                            </button>
                        )}

                        {canPlayQuest && (
                            <button
                                onClick={() => navigate(`/quest/${misi.id_misi}`)}
                                className="px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-300 flex items-center bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg transform hover:-translate-y-1"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                                </svg>
                                Mulai Quest
                            </button>
                        )}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-8 h-8 bg-amber-400 rounded-full transform rotate-45"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-8 h-8 bg-amber-400 rounded-full transform rotate-45"></div>
            </div>

            {/* Adventure Theme Decoration */}
            <div className="hidden md:block fixed bottom-0 left-0 w-full h-16 bg-amber-800 opacity-10"></div>
            <div className="hidden md:block fixed top-1/4 -left-10 w-20 h-20 bg-amber-300 rounded-full opacity-20"></div>
            <div className="hidden md:block fixed bottom-1/3 -right-10 w-24 h-24 bg-amber-400 rounded-full opacity-20"></div>
        </div>
    );
};

export default DetailMisi;
