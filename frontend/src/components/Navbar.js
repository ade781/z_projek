import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onSearch }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.2rem 3rem",
            background: "linear-gradient(135deg, rgba(10, 15, 25, 0.98) 0%, rgba(26, 42, 74, 0.95) 100%)",
            color: "#e0e0e0",
            borderBottom: "1px solid rgba(138, 164, 212, 0.3)",
            boxShadow: "0 2px 30px rgba(0, 10, 30, 0.6)",
            fontFamily: "'Cormorant Garamond', serif",
            zIndex: 1000,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
        }}>
            {/* Left Section - Logo */}
            <div>
                <h2
                    style={{
                        cursor: "pointer",
                        margin: 0,
                        fontSize: "1.9rem",
                        fontWeight: 400,
                        letterSpacing: "1.2px",
                        background: "linear-gradient(90deg, #a8c1f8, #d7e3ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 0 8px rgba(168, 193, 248, 0.4)",
                        transition: "all 0.3s ease",
                        position: "relative",
                        fontStyle: "italic"
                    }}
                    onClick={() => navigate("/note")}
                    onMouseOver={(e) => {
                        e.currentTarget.style.textShadow = "0 0 15px rgba(168, 193, 248, 0.6)";
                        e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.textShadow = "0 0 8px rgba(168, 193, 248, 0.4)";
                        e.currentTarget.style.transform = "translateX(0)";
                    }}
                >
                    Moonlight Sonata
                    <span style={{
                        position: "absolute",
                        bottom: "-5px",
                        left: 0,
                        width: "100%",
                        height: "1px",
                        background: "linear-gradient(90deg, rgba(168, 193, 248, 0.7), transparent)",
                        transition: "all 0.3s ease"
                    }} />
                </h2>
            </div>

            {/* Right Section - Search and Auth */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem"
            }}>
                <div style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <input
                        type="text"
                        placeholder="Search notes..."
                        onChange={(e) => onSearch(e.target.value)}
                        style={{
                            padding: "0.7rem 1.2rem 0.7rem 3rem",
                            width: "240px",
                            borderRadius: "30px",
                            border: "1px solid rgba(138, 164, 212, 0.2)",
                            background: "rgba(5, 15, 30, 0.4)",
                            color: "#f0f4ff",
                            fontSize: "0.95rem",
                            outline: "none",
                            transition: "all 0.3s ease",
                            boxShadow: "inset 0 1px 4px rgba(0,0,0,0.3)",
                            fontFamily: "'Cormorant Garamond', serif",
                            letterSpacing: "0.5px"
                        }}
                        onFocus={(e) => {
                            e.target.style.border = "1px solid rgba(138, 164, 212, 0.5)";
                            e.target.style.background = "rgba(5, 15, 30, 0.7)";
                            e.target.style.boxShadow = "0 0 15px rgba(138, 164, 212, 0.2)";
                        }}
                        onBlur={(e) => {
                            e.target.style.border = "1px solid rgba(138, 164, 212, 0.2)";
                            e.target.style.background = "rgba(5, 15, 30, 0.4)";
                            e.target.style.boxShadow = "inset 0 1px 4px rgba(0,0,0,0.3)";
                        }}
                    />
                    <span style={{
                        position: "absolute",
                        left: "1.2rem",
                        fontSize: "1.1rem",
                        color: "rgba(168, 193, 248, 0.7)",
                        pointerEvents: "none"
                    }}>
                        ⌕
                    </span>
                </div>

                {isLoggedIn ? (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem"
                    }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                cursor: "pointer",
                                padding: "0.7rem 1.5rem",
                                background: "transparent",
                                color: "#a8c1f8",
                                border: "1px solid rgba(168, 193, 248, 0.3)",
                                borderRadius: "30px",
                                fontSize: "0.95rem",
                                letterSpacing: "0.8px",
                                transition: "all 0.3s ease",
                                fontFamily: "'Cormorant Garamond', serif",
                                position: "relative",
                                overflow: "hidden"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = "rgba(168, 193, 248, 0.08)";
                                e.currentTarget.style.border = "1px solid rgba(168, 193, 248, 0.5)";
                                e.currentTarget.style.boxShadow = "0 0 15px rgba(168, 193, 248, 0.2)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.border = "1px solid rgba(168, 193, 248, 0.3)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            Logout
                            <span style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                height: "1px",
                                background: "linear-gradient(90deg, rgba(168, 193, 248, 0.5), transparent)",
                                transform: "translateX(-100%)",
                                transition: "transform 0.3s ease"
                            }} />
                        </button>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, rgba(168, 193, 248, 0.2), rgba(168, 193, 248, 0.1))",
                            border: "1px solid rgba(168, 193, 248, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = "linear-gradient(135deg, rgba(168, 193, 248, 0.3), rgba(168, 193, 248, 0.2))";
                                e.currentTarget.style.border = "1px solid rgba(168, 193, 248, 0.4)";
                                e.currentTarget.style.boxShadow = "0 0 15px rgba(168, 193, 248, 0.2)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = "linear-gradient(135deg, rgba(168, 193, 248, 0.2), rgba(168, 193, 248, 0.1))";
                                e.currentTarget.style.border = "1px solid rgba(168, 193, 248, 0.2)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <span style={{
                                color: "#a8c1f8",
                                fontSize: "1.2rem",
                                fontWeight: 300
                            }}>
                                A
                            </span>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            cursor: "pointer",
                            padding: "0.7rem 1.8rem",
                            background: "linear-gradient(90deg, rgba(168, 193, 248, 0.2), rgba(168, 193, 248, 0.1))",
                            color: "#f0f4ff",
                            border: "1px solid rgba(168, 193, 248, 0.4)",
                            borderRadius: "30px",
                            fontSize: "0.95rem",
                            letterSpacing: "0.8px",
                            transition: "all 0.3s ease",
                            fontFamily: "'Cormorant Garamond', serif",
                            position: "relative",
                            overflow: "hidden"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "linear-gradient(90deg, rgba(168, 193, 248, 0.3), rgba(168, 193, 248, 0.2))";
                            e.currentTarget.style.border = "1px solid rgba(168, 193, 248, 0.6)";
                            e.currentTarget.style.boxShadow = "0 0 20px rgba(168, 193, 248, 0.3)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "linear-gradient(90deg, rgba(168, 193, 248, 0.2), rgba(168, 193, 248, 0.1))";
                            e.currentTarget.style.border = "1px solid rgba(168, 193, 248, 0.4)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        Login
                        <span style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "1px",
                            background: "linear-gradient(90deg, rgba(168, 193, 248, 0.7), transparent)",
                            transform: "translateX(-100%)",
                            transition: "transform 0.3s ease"
                        }} />
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
