import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Particle effect for magical ambiance
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.className = 'fixed top-0 left-0 w-full h-full pointer-events-none z-0';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = window.innerWidth < 768 ? 30 : 60;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: `hsl(${Math.random() * 30 + 20}, 70%, ${Math.random() * 30 + 50}%)`
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();

                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            });

            requestAnimationFrame(animate);
        }

        animate();

        return () => {
            document.body.removeChild(canvas);
        };
    }, []);

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

            // Add success animation before navigation
            document.querySelector('.login-container').classList.add('animate-pulse');
            setTimeout(() => navigate("/misi"), 1000);
        } catch (err) {
            setErrorMsg("Username atau Password salah");
            // Shake animation on error
            document.querySelector('.login-container').classList.add('animate-shake');
            setTimeout(() => {
                document.querySelector('.login-container').classList.remove('animate-shake');
            }, 500);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4
    bg-[url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1350&q=80')] 
    bg-cover bg-center bg-fixed">
            {/* Animated Torch Lights */}
            <div className="fixed top-10 left-10 w-16 h-16 bg-yellow-500 rounded-full filter blur-xl opacity-30 animate-flicker"></div>
            <div className="fixed top-10 right-10 w-16 h-16 bg-yellow-500 rounded-full filter blur-xl opacity-30 animate-flicker-delay"></div>

            <div className="login-container relative z-10 w-full max-w-md transition-all duration-300">
                <div className="bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-amber-900 rounded-lg overflow-hidden shadow-2xl border-4 border-amber-800 transform hover:rotate-1 transition-transform duration-500">
                    {/* Wooden sign header with animated glow */}
                    <div className="relative bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-amber-800 p-4 text-center border-b-4 border-amber-900">
                        <div className="absolute inset-0 bg-yellow-600 opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                        <h2 className="text-3xl font-bold text-amber-100 font-serif tracking-wider text-shadow-lg shadow-amber-900/50 relative">
                            <span className="inline-block transform hover:scale-110 transition-transform duration-200">
                                G
                            </span>
                            <span className="inline-block transform hover:scale-110 transition-transform duration-200 delay-75">
                                U
                            </span>
                            <span className="inline-block transform hover:scale-110 transition-transform duration-200 delay-100">
                                I
                            </span>
                            <span className="inline-block transform hover:scale-110 transition-transform duration-200 delay-150">
                                L
                            </span>
                            <span className="inline-block transform hover:scale-110 transition-transform duration-200 delay-200">
                                D
                            </span>
                            <span className="mx-2">✧</span>
                            <span className="inline-block transform hover:scale-110 transition-transform duration-200 delay-250">
                                L
                            </span>
                            <span className="inline-block transform hover:scale-110 transition-transform duration-200 delay-300">
                                O
                            </span>
                            <span className="inline-block transform hover:scale-110 transition-transform duration-200 delay-350">
                                G
                            </span>
                            <span className="inline-block transform hover:scale-110 transition-transform duration-200 delay-400">
                                I
                            </span>
                            <span className="inline-block transform hover:scale-110 transition-transform duration-200 delay-450">
                                N
                            </span>
                        </h2>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
                    </div>

                    {/* Main form area with parchment texture */}
                    <div className="p-6 bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] bg-amber-50 relative">
                        {/* Animated quill decoration */}
                        <div className="absolute top-4 right-4 w-12 h-12 bg-[url('https://www.freepnglogos.com/uploads/feather-png/feather-the-symbolism-object-30.png')] bg-contain bg-no-repeat bg-center opacity-70 transform hover:rotate-12 hover:scale-110 transition-transform duration-300"></div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="group relative">
                                <label className="block text-amber-900 font-medium mb-1 ml-1 transition-all duration-300 group-hover:text-amber-700 group-hover:ml-2">
                                    ✦ Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-100/80 backdrop-blur-sm transition-all duration-300 hover:border-amber-400 hover:bg-amber-50 hover:shadow-md placeholder-amber-400/60"
                                    placeholder="Your adventurer name..."
                                />
                                <div className="absolute bottom-0 left-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-500"></div>
                            </div>

                            <div className="group relative">
                                <label className="block text-amber-900 font-medium mb-1 ml-1 transition-all duration-300 group-hover:text-amber-700 group-hover:ml-2">
                                    ✦ Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-100/80 backdrop-blur-sm transition-all duration-300 hover:border-amber-400 hover:bg-amber-50 hover:shadow-md placeholder-amber-400/60"
                                    placeholder="Your secret phrase..."
                                />
                                <div className="absolute bottom-0 left-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-500 delay-100"></div>
                            </div>

                            {errorMsg && (
                                <div className="p-3 bg-red-100/90 text-red-800 rounded-lg border-2 border-red-200 text-center transform hover:scale-[1.01] transition-transform duration-300 backdrop-blur-sm shadow-inner">
                                    ✧ {errorMsg} ✧
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-500 shadow-lg ${isLoading
                                        ? 'bg-amber-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 hover:shadow-xl hover:scale-[1.02] active:scale-95'
                                    } relative overflow-hidden group`}
                            >
                                <span className="relative z-10 text-amber-50 flex items-center justify-center">
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Casting Spell...
                                        </>
                                    ) : (
                                        <>
                                            <span className="group-hover:animate-bounce inline-block mr-2">⚔️</span>
                                            Enter the Guild Hall
                                            <span className="group-hover:animate-bounce inline-block ml-2">🛡️</span>
                                        </>
                                    )}
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-transparent to-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shine"></span>
                            </button>
                        </form>

                        <div className="mt-8 pt-4 border-t border-amber-200/60 text-center relative">
                            <p className="text-amber-800 font-medium">
                                Are you the <b className="text-amber-900 font-extrabold">Guild Master</b>?{" "}
                                <button
                                    onClick={() => navigate("/login-owner")}
                                    className="ml-1 text-amber-700 hover:text-amber-900 font-bold underline focus:outline-none transform hover:scale-105 transition-transform duration-300 relative group"
                                >
                                    Claim your throne
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-700 group-hover:w-full transition-all duration-300"></span>
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Wooden footer with animated runes */}
                    <div className="bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-amber-800 p-3 text-center border-t-4 border-amber-900 relative overflow-hidden">
                        <div className="flex justify-center space-x-4 mb-1">
                            {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ'].map((rune, i) => (
                                <span
                                    key={i}
                                    className="text-amber-200/60 hover:text-amber-100 hover:scale-125 transition-all duration-300 cursor-default transform hover:rotate-6"
                                    title="Ancient Runes of Power"
                                >
                                    {rune}
                                </span>
                            ))}
                        </div>
                        <div className="text-xs text-amber-200/80 tracking-wider">
                            © {new Date().getFullYear()} Ancient Adventurer's Guild
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style jsx global>{`
                @keyframes flicker {
                    0%, 100% { opacity: 0.3; }
                    20%, 60% { opacity: 0.6; }
                    40%, 80% { opacity: 0.4; }
                }
                @keyframes flicker-delay {
                    0%, 100% { opacity: 0.4; }
                    30%, 70% { opacity: 0.6; }
                    50%, 90% { opacity: 0.3; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                @keyframes shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(100%) skewX(-15deg); }
                }
                .animate-flicker {
                    animation: flicker 3s infinite;
                }
                .animate-flicker-delay {
                    animation: flicker-delay 3s infinite;
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                .animate-shine {
                    animation: shine 1.5s infinite;
                }
                .text-shadow-lg {
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </div>
    );
};

export default Login;