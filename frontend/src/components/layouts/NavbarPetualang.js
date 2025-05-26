import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils";

const NavbarPetualang = () => {
    const navigate = useNavigate();
    const [petualang, setPetualang] = useState({
        username: "",
        role: "",
        level: 0,
        koin: 0,
    });
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const id_petualang = localStorage.getItem("id_petualang");

            if (!token || !id_petualang) return;

            try {
                const res = await axios.get(`${BASE_URL}/petualang/${id_petualang}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const userData = res.data.data || res.data;

                setPetualang({
                    username: userData.username || "",
                    role: userData.role || "",
                    level: userData.level || 0,
                    koin: userData.koin || 0,
                });
            } catch (error) {
                console.error("Error fetching petualang data:", error);
            }
        };

        fetchData();

        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("id_petualang");
        navigate("/");
    };

    return (
        <nav className={`
            fixed w-full z-50 transition-all duration-500
            ${isScrolled ? "py-2 bg-amber-900 shadow-lg" : "py-4 bg-gradient-to-b from-amber-800 to-amber-900"}
            border-b-4 border-amber-600
        `}>
            <div className="w-full px-3 flex items-center justify-between">

                {/* Logo and Guild Name */}
                <div
                    className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => navigate("/dashboard-petualang")}
                >
                    <img
                        src="/logo-guild.png"
                        alt="Guild Logo"
                        className="w-16 h-16 object-contain animate-pulse hover:animate-spin"
                    />
                    <div className="hidden md:block">
                        <h1 className="text-xl font-bold text-amber-100 font-serif tracking-wider">
                            GUILD PETUALANG
                        </h1>
                        <p className="text-xs text-amber-200 italic">
                            Adventure Awaits!
                        </p>
                    </div>
                </div>

                {/* Petualang Stats */}
                <div className="flex items-center space-x-6">
                    {/* Username Badge */}
                    <div className="relative group">
                        <div className="
                            px-4 py-2 bg-amber-700 rounded-full 
                            border-2 border-amber-500 shadow-md
                            flex items-center
                            hover:bg-amber-600 transition-colors
                        ">
                            <span className="text-amber-100 font-medium">
                                {petualang.username || "Adventurer"}
                            </span>
                            <svg
                                className="w-5 h-5 ml-2 text-amber-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="
                            absolute left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2
                            bg-amber-800 text-amber-100 text-sm rounded-md
                            opacity-0 group-hover:opacity-100 transition-opacity
                            whitespace-nowrap pointer-events-none
                            border border-amber-600 shadow-lg
                        ">
                            Your Adventurer Identity
                        </div>
                    </div>

                    {/* Role Badge */}
                    <div className="relative group">
                        <div className="
                            px-4 py-2 bg-amber-700 rounded-full 
                            border-2 border-amber-500 shadow-md
                            flex items-center
                            hover:bg-amber-600 transition-colors
                        ">
                            <span className="text-amber-100 font-medium capitalize">
                                {petualang.role || "Novice"}
                            </span>
                            <svg
                                className="w-5 h-5 ml-2 text-amber-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                        <div className="
                            absolute left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2
                            bg-amber-800 text-amber-100 text-sm rounded-md
                            opacity-0 group-hover:opacity-100 transition-opacity
                            whitespace-nowrap pointer-events-none
                            border border-amber-600 shadow-lg
                        ">
                            Your Adventurer Class
                        </div>
                    </div>

                    {/* Level Badge */}
                    <div className="relative group">
                        <div className="
                            px-4 py-2 bg-amber-700 rounded-full 
                            border-2 border-amber-500 shadow-md
                            flex items-center
                            hover:bg-amber-600 transition-colors
                        ">
                            <span className="text-amber-100 font-medium">
                                Lv. {petualang.level || "0"}
                            </span>
                            <svg
                                className="w-5 h-5 ml-2 text-amber-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                            </svg>
                        </div>
                        <div className="
                            absolute left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2
                            bg-amber-800 text-amber-100 text-sm rounded-md
                            opacity-0 group-hover:opacity-100 transition-opacity
                            whitespace-nowrap pointer-events-none
                            border border-amber-600 shadow-lg
                        ">
                            Your Adventure Rank
                        </div>
                    </div>

                    {/* Koin Badge */}
                    <div className="relative group">
                        <div className="
                            px-4 py-2 bg-amber-700 rounded-full 
                            border-2 border-amber-500 shadow-md
                            flex items-center
                            hover:bg-amber-600 transition-colors
                        ">
                            <span className="text-amber-100 font-medium">
                                {petualang.koin || "0"}
                            </span>
                            <svg
                                className="w-5 h-5 ml-2 text-amber-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="
                            absolute left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2
                            bg-amber-800 text-amber-100 text-sm rounded-md
                            opacity-0 group-hover:opacity-100 transition-opacity
                            whitespace-nowrap pointer-events-none
                            border border-amber-600 shadow-lg
                        ">
                            Your Adventure Gold
                        </div>
                    </div>

                    {/* Dashboard Button */}
                    <button
                        onClick={() => navigate("/dashboard-petualang")}
                        className="
                            px-6 py-2 bg-amber-600 hover:bg-amber-500 
                            text-amber-100 font-medium rounded-lg
                            border-2 border-amber-400 shadow-md
                            transition-all duration-300
                            hover:scale-105 hover:shadow-lg
                            flex items-center
                            relative overflow-hidden
                            group
                        "
                    >
                        <span className="relative z-10 flex items-center">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                />
                            </svg>
                            Dashboard
                        </span>
                        <span className="
                            absolute inset-0 bg-amber-500 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300
                        "></span>
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="
                            px-6 py-2 bg-red-700 hover:bg-red-600 
                            text-amber-100 font-medium rounded-lg
                            border-2 border-red-500 shadow-md
                            transition-all duration-300
                            hover:scale-105 hover:shadow-lg
                            flex items-center
                            relative overflow-hidden
                            group
                        "
                    >
                        <span className="relative z-10 flex items-center">
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Logout
                        </span>
                        <span className="
                            absolute inset-0 bg-red-600 opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300
                        "></span>
                    </button>
                </div>
            </div>

            {/* Animated Compass */}
            <div className="
                absolute -bottom-4 left-1/2 transform -translate-x-1/2
                w-8 h-8 bg-amber-700 rounded-full border-4 border-amber-600
                flex items-center justify-center shadow-lg
                animate-bounce
            ">
                <div className="w-5 h-5 border-t-2 border-r-2 border-amber-300 transform rotate-45"></div>
            </div>
        </nav>
    );
};

export default NavbarPetualang;