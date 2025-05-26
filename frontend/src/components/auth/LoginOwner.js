import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const LoginOwner = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const res = await axios.post(`${BASE_URL}/owner/login`, {
                username,
                password,
            });

            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("id_owner", res.data.owner.id_owner);
            localStorage.setItem("nama_owner", res.data.owner.nama_owner);

            navigate("/misi-owner");
        } catch (err) {
            setErrorMsg("Mantra rahasia atau stempel guild salah");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Bintang latar belakang */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-white animate-twinkle"
                        style={{
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Guild Banner */}
            <div className="w-full max-w-md bg-indigo-800 rounded-t-lg border-b-4 border-indigo-600 p-4 shadow-lg z-10">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <img
                        src="/logo-guild.png"
                        alt="Guild Logo"
                        className="w-20 h-20 animate-float"
                    />
                    <h1 className="text-4xl font-bold text-yellow-300 font-serif tracking-wider text-center">
                        GUILD HOSHIGAMI
                    </h1>
                    <p className="text-indigo-200 italic">Pemilik Guild</p>
                </div>
            </div>

            {/* Login Scroll */}
            <div className="w-full max-w-md bg-amber-50 rounded-b-lg p-8 shadow-xl relative overflow-hidden z-10">
                {/* Parchment texture effect */}
                <div className="absolute inset-0 bg-paper-texture opacity-10 pointer-events-none"></div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 border-4 border-yellow-600 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 border-4 border-yellow-600 rounded-full opacity-20"></div>
                
                <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center font-serif border-b-2 border-indigo-800 pb-2">
                    Ruang Rahasia Guild Master
                </h2>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-indigo-800 font-medium flex items-center">
                            <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                            </svg>
                            Stempel Guild
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded border-2 border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all font-medium text-indigo-900 placeholder-indigo-300"
                            placeholder="Masukkan stempel guild Anda"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-indigo-800 font-medium flex items-center">
                            <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Mantra Rahasia
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded border-2 border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all font-medium text-indigo-900 placeholder-indigo-300"
                            placeholder="Ucapkan mantra rahasia"
                        />
                    </div>
                    
                    {errorMsg && (
                        <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 animate-shake flex items-start">
                            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p>{errorMsg}</p>
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 border-b-4 border-yellow-800 active:border-b-2 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Buka Portal Guild
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-indigo-700">
                        Bukan Guild Master? Kembali ke{" "}
                        <button
                            onClick={() => navigate("/")}
                            className="text-yellow-700 font-bold hover:text-yellow-800 underline hover:underline-offset-4 transition-all"
                        >
                            Pintu Petualang
                        </button>
                    </p>
                </div>
            </div>

            {/* Guild Motto */}
            <div className="mt-8 text-yellow-200 text-center max-w-md z-10">
                <p className="italic text-lg">"Di bawah bintang Hoshigami, petualangan abadi dimulai"</p>
                <div className="flex justify-center space-x-4 mt-3">
                    <span className="text-yellow-300 text-xl">✧</span>
                    <span className="text-yellow-300 text-xl">✦</span>
                    <span className="text-yellow-300 text-xl">✧</span>
                </div>
            </div>
        </div>
    );
};

export default LoginOwner;

// Tambahkan ini ke CSS global Anda:
/*
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

@keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 1; }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

.animate-twinkle {
    animation: twinkle 2s ease-in-out infinite;
}

.bg-paper-texture {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d97706' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}
*/