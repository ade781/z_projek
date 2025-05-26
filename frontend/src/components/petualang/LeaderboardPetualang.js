import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const LeaderboardPetualang = () => {
    const [petualangs, setPetualangs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [highlightedRow, setHighlightedRow] = useState(null);

    useEffect(() => {
        const fetchPetualangs = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(`${BASE_URL}/petualang`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = res.data.data || res.data;
                const cleanData = Array.isArray(data) ? data.map(p => ({
                    id_petualang: p.id_petualang,
                    username: p.username,
                    role: p.role,
                    level: p.level,
                    jumlah_misi_selesai: p.jumlah_misi_selesai,
                    poin_pengalaman: p.poin_pengalaman,
                })) : [];

                cleanData.sort((a, b) => b.poin_pengalaman - a.poin_pengalaman);
                setPetualangs(cleanData);
                setLoading(false);
            } catch (err) {
                setErrorMsg("Gagal memuat leaderboard");
                setLoading(false);
            }
        };

        fetchPetualangs();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="text-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-amber-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-amber-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p className="mt-4 text-amber-300 text-lg font-medium tracking-wider">
                    MEMUAT PETA PETUALANG...
                </p>
            </div>
        </div>
    );

    if (errorMsg) return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="bg-gray-800 border-l-4 border-red-500 p-6 max-w-md rounded-lg shadow-xl">
                <div className="flex items-center">
                    <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-xl font-bold text-white">ERROR</h3>
                </div>
                <p className="mt-3 text-gray-300">{errorMsg}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-md text-white font-medium transition-all transform hover:scale-105"
                >
                    COBA LAGI
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                {[...Array(10)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-amber-500/10"
                        style={{
                            width: `${Math.random() * 100 + 50}px`,
                            height: `${Math.random() * 100 + 50}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float${Math.floor(Math.random() * 3) + 1} ${Math.random() * 10 + 10}s infinite ease-in-out`,
                            opacity: 0.3
                        }}
                    />
                ))}
            </div>

        
            <div className="relative z-10 max-w-6xl mx-auto">
    
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-4 tracking-wider">
                        HALL OF HEROES
                    </h1>
                    <p className="text-gray-400 italic text-lg">
                        "Yang terkuat akan bertahan di puncak"
                    </p>
                    <div className="mt-6 flex justify-center">
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                    </div>
                </div>

           
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
           
                    <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800 border-b border-gray-700">
                        <div className="col-span-1 text-center text-sm font-medium text-amber-400 uppercase tracking-wider">RANK</div>
                        <div className="col-span-4 text-sm font-medium text-amber-400 uppercase tracking-wider">PETUALANG</div>
                        <div className="col-span-2 text-sm font-medium text-amber-400 uppercase tracking-wider">KELAS</div>
                        <div className="col-span-1 text-center text-sm font-medium text-amber-400 uppercase tracking-wider">LVL</div>
                        <div className="col-span-2 text-center text-sm font-medium text-amber-400 uppercase tracking-wider">MISI</div>
                        <div className="col-span-2 text-center text-sm font-medium text-amber-400 uppercase tracking-wider">XP</div>
                    </div>

        
                    <div className="divide-y divide-gray-700">
                        {petualangs.length > 0 ? (
                            petualangs.map((p, index) => (
                                <div 
                                    key={p.id_petualang} 
                                    className={`grid grid-cols-12 gap-4 p-4 items-center transition-all duration-300 ${
                                        highlightedRow === index 
                                            ? "bg-gray-700/50 transform scale-[1.01] shadow-lg" 
                                            : "hover:bg-gray-700/30"
                                    } ${index < 3 ? "bg-gradient-to-r from-gray-800/80 via-gray-800/50 to-gray-800/80" : ""}`}
                                    onMouseEnter={() => setHighlightedRow(index)}
                                    onMouseLeave={() => setHighlightedRow(null)}
                                >
                     
                                    <div className="col-span-1 flex justify-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                            index === 0 
                                                ? "bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900 shadow-lg shadow-amber-500/30" 
                                                : index === 1 
                                                    ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 shadow-lg shadow-gray-400/20" 
                                                    : index === 2 
                                                        ? "bg-gradient-to-br from-amber-700 to-amber-800 text-amber-100 shadow-lg shadow-amber-700/20" 
                                                        : "bg-gray-700 text-gray-300"
                                        }`}>
                                            {index + 1}
                                        </div>
                                    </div>

                                    <div className="col-span-4 flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mr-3 ${
                                            index === 0 
                                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50" 
                                                : "bg-gray-700 text-gray-300 border border-gray-600"
                                        }`}>
                                            {p.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{p.username}</div>
                                            <div className="text-xs text-gray-400">Level {p.level}</div>
                                        </div>
                                    </div>

                 
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            p.role === "Warrior" 
                                                ? "bg-red-900/30 text-red-300 border border-red-800/50" 
                                                : p.role === "Mage" 
                                                    ? "bg-blue-900/30 text-blue-300 border border-blue-800/50" 
                                                    : p.role === "Archer" 
                                                        ? "bg-green-900/30 text-green-300 border border-green-800/50" 
                                                        : "bg-purple-900/30 text-purple-300 border border-purple-800/50"
                                        }`}>
                                            {p.role}
                                        </span>
                                    </div>

             
                                    <div className="col-span-1 text-center text-white font-bold">
                                        {p.level}
                                    </div>

                  
                                    <div className="col-span-2 text-center">
                                        <div className="flex items-center justify-center">
                                            <svg className="w-4 h-4 mr-1 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-white">{p.jumlah_misi_selesai}</span>
                                        </div>
                                    </div>

                 
                                    <div className="col-span-2 text-center">
                                        <div className="flex items-center justify-center">
                                            <svg className="w-4 h-4 mr-1 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-bold text-amber-300">{p.poin_pengalaman}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <svg className="mx-auto h-16 w-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-400">Belum ada petualang terdaftar</h3>
                                <p className="mt-2 text-gray-500">Jadilah yang pertama mencapai puncak!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx global>{`
                @keyframes float1 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-15px) translateX(-15px); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(10px) translateX(5px); }
                }
            `}</style>
        </div>
    );
};

export default LeaderboardPetualang;