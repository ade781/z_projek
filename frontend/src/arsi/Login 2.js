import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [adventurerClass, setAdventurerClass] = useState("warrior");
    const [isFloating, setIsFloating] = useState(false);
    const navigate = useNavigate();

    // Floating animation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setIsFloating(prev => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const adventurerClasses = [
        { id: "warrior", name: "Warrior", color: "bg-red-500" },
        { id: "mage", name: "Mage", color: "bg-blue-500" },
        { id: "archer", name: "Archer", color: "bg-green-500" },
        { id: "cleric", name: "Cleric", color: "bg-yellow-500" },
        { id: "rogue", name: "Rogue", color: "bg-purple-500" },
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsLoading(true);
        
        try {
            const res = await axios.post(`${BASE_URL}/petualang/login`, {
                username,
                password,
            });

            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("id_petualang", res.data.petualang.id_petualang);
            localStorage.setItem("level_petualang", res.data.petualang.level);
            localStorage.setItem("username", res.data.petualang.username);

            // Add guild welcome effect to localStorage
            localStorage.setItem("showWelcome", "true");

            navigate("/misi");
        } catch (err) {
            setErrorMsg("Username atau Password salah");
            // Shake animation on error
            const form = document.getElementById("login-form");
            form.classList.add("animate-shake");
            setTimeout(() => {
                form.classList.remove("animate-shake");
            }, 500);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 flex items-center justify-center p-4">
            {/* Animated floating elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-1/4 left-1/4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 blur-lg transition-all duration-3000 ${isFloating ? "translate-y-4" : "-translate-y-4"}`}></div>
                <div className={`absolute top-1/3 right-1/3 w-24 h-24 bg-blue-400 rounded-full opacity-15 blur-lg transition-all duration-4000 ${isFloating ? "translate-y-6" : "-translate-y-6"}`}></div>
                <div className={`absolute bottom-1/4 right-1/4 w-20 h-20 bg-purple-400 rounded-full opacity-15 blur-lg transition-all duration-3500 ${isFloating ? "translate-y-5" : "-translate-y-5"}`}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Guild Banner */}
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-900 text-center py-3 px-6 rounded-t-xl border-b-4 border-yellow-700 shadow-lg mb-1">
                    <h1 className="text-3xl font-bold font-serif tracking-wider">GUILD HALL</h1>
                    <p className="text-sm font-medium">Adventurer's Login Portal</p>
                </div>

                {/* Login Form */}
                <div id="login-form" className="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-b-xl shadow-2xl overflow-hidden border-2 border-yellow-600 p-6">
                    {/* Adventurer Class Selection */}
                    <div className="mb-6">
                        <h3 className="text-yellow-400 text-sm font-bold mb-2">SELECT YOUR CLASS</h3>
                        <div className="flex flex-wrap gap-2">
                            {adventurerClasses.map((cls) => (
                                <button
                                    key={cls.id}
                                    onClick={() => setAdventurerClass(cls.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${cls.color} ${adventurerClass === cls.id ? "ring-2 ring-yellow-400 scale-110" : "opacity-70 hover:opacity-100"}`}
                                >
                                    {cls.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-yellow-400 text-sm font-bold mb-2" htmlFor="username">
                                ADVENTURER NAME
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full bg-gray-700 text-yellow-100 border-2 border-yellow-600 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-yellow-700"
                                    placeholder="Enter your guild name"
                                />
                                <div className="absolute right-3 top-3 text-yellow-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-yellow-400 text-sm font-bold mb-2" htmlFor="password">
                                SECRET PASSWORD
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-gray-700 text-yellow-100 border-2 border-yellow-600 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-yellow-700"
                                    placeholder="Your secret spell"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-yellow-500 hover:text-yellow-300"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {errorMsg && (
                            <div className="bg-red-900 bg-opacity-70 border-l-4 border-red-500 text-red-100 p-3 rounded">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{errorMsg}</span>
                                </div>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all transform hover:scale-105 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    AUTHENTICATING...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    ENTER THE GUILD HALL
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Owner Login Option */}
                    <div className="mt-6 pt-6 border-t border-yellow-700 border-opacity-30">
                        <p className="text-gray-400 text-center mb-3">Are you the <span className="text-yellow-400 font-bold">Guild Master</span>?</p>
                        <button
                            onClick={() => navigate("/login-owner")}
                            className="w-full py-2 px-4 rounded-lg font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ACCESS GUILD MASTER PANEL
                        </button>
                    </div>
                </div>

                {/* Guild Crest */}
                <div className="mt-6 flex justify-center">
                    <div className="bg-yellow-600 bg-opacity-20 p-3 rounded-full border-2 border-yellow-500 border-opacity-30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                </div>

                {/* Floating Adventurer */}
                <div className={`absolute -bottom-10 -right-10 transition-transform duration-3000 ${isFloating ? "translate-y-4" : "-translate-y-4"}`}>
                    <div className="relative">
                        {/* Base character changes based on selected class */}
                        {adventurerClass === "warrior" && (
                            <svg className="h-32 w-32 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                                <path d="M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                <path d="M19 18v-1a7 7 0 0 0-14 0v1" />
                                <line x1="12" y1="10" x2="12" y2="14" />
                                <line x1="9" y1="13" x2="15" y2="13" />
                                <path d="M15 5l2 2" />
                                <path d="M9 5l-2 2" />
                            </svg>
                        )}
                        {adventurerClass === "mage" && (
                            <svg className="h-32 w-32 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="22" />
                                <line x1="8" y1="22" x2="16" y2="22" />
                                <path d="M7 14l-1.5 1.5" />
                                <path d="M17 14l1.5 1.5" />
                            </svg>
                        )}
                        {adventurerClass === "archer" && (
                            <svg className="h-32 w-32 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4l3 3" />
                                <path d="M16 5l-4 4-4-4" />
                                <path d="M9 15l3-3 3 3" />
                            </svg>
                        )}
                        {adventurerClass === "cleric" && (
                            <svg className="h-32 w-32 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                                <path d="M12 2v8l3 3" />
                                <path d="M12 12l-3 3" />
                                <path d="M12 22v-8l-3-3" />
                                <path d="M12 12l3-3" />
                            </svg>
                        )}
                        {adventurerClass === "rogue" && (
                            <svg className="h-32 w-32 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="3" r="1" />
                                <circle cx="19" cy="8" r="1" />
                                <circle cx="12" cy="17" r="1" />
                                <path d="M19 13l-7 7-7-7" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom CSS for shake animation */}
            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
};

export default Login;