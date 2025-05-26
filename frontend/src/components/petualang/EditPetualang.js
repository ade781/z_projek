import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils";

const EditPetualang = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const roles = [
        "Warrior", "Mage", "Archer", "Healer",
        "Rogue", "Paladin", "Summoner", "Berserker"
    ];

    useEffect(() => {
        const fetchPetualang = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(`${BASE_URL}/petualang/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = res.data.data || res.data;
                setUsername(data.username);
                setRole(data.role);
                setLoading(false);
            } catch (err) {
                setError("Gagal memuat data petualang.");
                setLoading(false);
            }
        };

        fetchPetualang();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("accessToken");
            await axios.put(`${BASE_URL}/petualang/edit-petualang/${id}`, {
                username,
                role
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate("/dashboard-petualang");
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengupdate data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-amber-50 to-amber-100">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-amber-800 font-medium text-lg">Memuat data petualang...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-amber-50 to-amber-100">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
                <p className="font-bold">Error</p>
                <p>{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-medium transition-colors"
                >
                    Kembali
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-900 via-amber-700 to-stone-800 py-12 px-4 sm:px-6 lg:px-8">

            <div className="fixed top-20 left-10 w-16 h-16 bg-amber-400/20 rounded-full animate-float1"></div>
            <div className="fixed top-1/3 right-16 w-12 h-12 bg-amber-500/20 rounded-full animate-float2"></div>
            <div className="fixed bottom-1/4 left-1/4 w-10 h-10 bg-amber-600/20 rounded-full animate-float3"></div>

 
            <div className="max-w-md mx-auto">
          
                <div className="bg-gradient-to-br from-amber-800/90 to-amber-900/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-amber-600/30 shadow-xl">
                    <div className="bg-gradient-to-r from-amber-700 to-amber-800 p-6 text-center">
                        <h2 className="text-2xl font-bold text-amber-100 font-serif tracking-wide">
                            Edit Petualang
                        </h2>
                        <p className="text-amber-200 text-sm mt-1">
                            Perbarui identitas petualanganmu
                        </p>

                        <img
                            src="https://storage.googleapis.com/sumanto-public/bucket.png"
                            alt="Bucket"
                            className="mx-auto mt-4 w-20 h-auto"
                        />
                    </div>


                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-amber-100 text-sm font-medium mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-amber-100/90 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 placeholder-amber-600 transition-all"
                                        placeholder="Nama petualang"
                                    />
                                    <div className="absolute right-3 top-3 text-amber-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-amber-100 text-sm font-medium mb-2">
                                    Kelas Petualang
                                </label>
                                <div className="relative">
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-amber-100/90 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 appearance-none transition-all"
                                    >
                                        <option value="" disabled className="text-amber-600">Pilih Kelas</option>
                                        {roles.map((r) => (
                                            <option key={r} value={r} className="text-amber-900">{r}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-3 text-amber-600 pointer-events-none">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 bg-transparent border-2 border-amber-500 text-amber-100 hover:bg-amber-700/50 rounded-lg font-medium shadow-md transition-all hover:shadow-amber-500/30"
                                >
                                    Kembali
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center ${isSubmitting
                                        ? "bg-amber-600 cursor-not-allowed"
                                        : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:shadow-lg"
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Simpan Perubahan
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx global>{`
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

export default EditPetualang;