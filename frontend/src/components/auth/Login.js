import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [swordGlow, setSwordGlow] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsSubmitting(true);
        setSwordGlow(true);

        try {
            const res = await axios.post(`${BASE_URL}/petualang/login`, {
                username,
                password,
            });

            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("id_petualang", res.data.petualang.id_petualang);
            localStorage.setItem("level_petualang", res.data.petualang.level);

            setTimeout(() => navigate("/misi"), 1000);
        } catch (err) {
            setErrorMsg("Username atau Password salah");
            // Trigger sword shake animation
            setSwordGlow(false);
            setTimeout(() => setSwordGlow(true), 100);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
 <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900 p-6 relative overflow-hidden font-serif">
 {/* Animated background elements */}
            <div className="absolute text-4xl opacity-30 left-10 top-20 animate-float-1">☁️</div>
            <div className="absolute text-4xl opacity-30 right-20 top-40 animate-float-2">☁️</div>
            <div className="absolute text-4xl opacity-30 left-1/4 bottom-1/4 animate-float-3">☁️</div>

            {/* Main card */}
            <div className="w-full max-w-md bg-black bg-opacity-70 p-10 rounded-xl shadow-2xl border border-gold-300 backdrop-blur-sm relative overflow-hidden">
                {/* Animated sword */}
                <div className={`absolute -top-8 right-8 text-5xl transition-all duration-500 ${swordGlow ?
                    "animate-sword-glow transform rotate-12" :
                    "animate-sword-shake"}`}>⚔️</div>

                {/* Guild logo */}
                <div className="relative mb-8 flex justify-center">
                    <img
                        src="/logo-guild.png"
                        alt="Guild Logo"
                        className="w-20 h-20 drop-shadow-gold animate-pulse"
                    />
                    <div className="absolute -inset-4 bg-yellow-500 rounded-full opacity-30 blur-md animate-ping-slow"></div>
                </div>

                <h2 className="text-3xl font-bold text-yellow-400 mb-1 text-center tracking-wider">Guild Petualang Hoshigami</h2>
                <p className="text-white text-lg italic mb-8 text-center">Login Petualang</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <label className="block text-yellow-300 mb-2 text-sm uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-800 bg-opacity-70 border-b-2 border-yellow-600 focus:border-yellow-400 text-white placeholder-gray-500 outline-none transition-all duration-300 group-hover:bg-opacity-90"
                            placeholder="Masukkan nama petualang"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-500 group-hover:w-full"></div>
                    </div>

                    <div className="relative group">
                        <label className="block text-yellow-300 mb-2 text-sm uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-800 bg-opacity-70 border-b-2 border-yellow-600 focus:border-yellow-400 text-white placeholder-gray-500 outline-none transition-all duration-300 group-hover:bg-opacity-90"
                            placeholder="Masukkan kata sandi rahasia"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-500 group-hover:w-full"></div>
                    </div>

                    {errorMsg && (
                        <div className="animate-shake text-red-400 text-center py-2 px-4 bg-red-900 bg-opacity-50 rounded">
                            {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-6 rounded-lg font-bold tracking-wider flex items-center justify-center space-x-2 transition-all duration-300 ${isSubmitting ?
                            "bg-yellow-800 text-yellow-200" :
                            "bg-gradient-to-r from-yellow-600 to-yellow-800 text-white hover:from-yellow-500 hover:to-yellow-700 hover:shadow-lg hover:shadow-yellow-500/30"
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memanggil Roh Petualang...
                            </span>
                        ) : (
                            <>
                                <span>Masuk Ke Guild</span>
                                <span className="text-xl">⚔️</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-yellow-800"></div>
                    <div className="px-3 text-yellow-500 text-sm">ATAU</div>
                    <div className="flex-1 border-t border-yellow-800"></div>
                </div>

                <p className="text-center text-gray-300 mb-4">
                    Anda adalah <span className="font-bold text-yellow-300 bg-gray-800 px-2 py-1 rounded-md">Owner</span>?
                </p>
                <button
                    onClick={() => navigate("/login-owner")}
                    className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-purple-500/20"
                >
                    <span>Masuk sebagai Owner</span>
                    <span className="text-xl">🏰</span>
                </button>
            </div>

            {/* Footer with animated coins */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className={`text-xl animate-spin-slow`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                    >🪙</span>
                ))}
            </div>

            {/* Custom animations */}
            <style jsx>{`
                @keyframes float-1 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                @keyframes float-2 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-15px) translateX(-5px); }
                }
                @keyframes float-3 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-25px) translateX(5px); }
                }
                @keyframes spin-slow {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(360deg); }
                }
                @keyframes sword-glow {
                    0% { filter: drop-shadow(0 0 5px gold); }
                    50% { filter: drop-shadow(0 0 15px gold); }
                    100% { filter: drop-shadow(0 0 5px gold); }
                }
                @keyframes sword-shake {
                    0%, 100% { transform: translateX(0) rotate(12deg); }
                    20%, 60% { transform: translateX(-5px) rotate(8deg); }
                    40%, 80% { transform: translateX(5px) rotate(16deg); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-5px); }
                    40%, 80% { transform: translateX(5px); }
                }
                @keyframes ping-slow {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    70%, 100% { transform: scale(1.3); opacity: 0; }
                }
                .animate-float-1 {
                    animation: float-1 8s ease-in-out infinite;
                }
                .animate-float-2 {
                    animation: float-2 7s ease-in-out infinite 1s;
                }
                .animate-float-3 {
                    animation: float-3 9s ease-in-out infinite 2s;
                }
                .animate-spin-slow {
                    animation: spin-slow 4s linear infinite;
                }
                .animate-sword-glow {
                    animation: sword-glow 2s ease-in-out infinite;
                }
                .animate-sword-shake {
                    animation: sword-shake 0.5s ease-in-out;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                .animate-ping-slow {
                    animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                .drop-shadow-gold {
                    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.7));
                }
            `}</style>
        </div>
    );
};

export default Login;