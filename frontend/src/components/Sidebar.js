import React from "react";

const emojiMap = {
    Pribadi: "🌿",
    Pekerjaan: "💼",
    Keuangan: "💰",
    Pendidikan: "📚",
    Kesehatan: "🏥",
    Hiburan: "🎬",
    Lainnya: "✨"
};

const Sidebar = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div style={{
            width: "240px",
            padding: "1.5rem 1rem",
            backgroundColor: "#0a1128",
            boxSizing: "border-box",
            borderRight: "1px solid rgba(58, 91, 160, 0.3)",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: "#e0e6f0",
            position: "sticky",
            top: 0,
            height: "100vh",

            background: `linear-gradient(
                135deg,
                rgba(10, 17, 40, 0.95) 0%,
                rgba(26, 42, 74, 0.9) 100%
            )`,
            backdropFilter: "blur(4px)",
            boxShadow: "8px 0 25px -10px rgba(0, 0, 40, 0.6)"
        }}>
            {/* Header with decorative elements */}
            <div style={{
                position: "relative",
                marginBottom: "2rem",
                paddingBottom: "1.5rem",
                borderBottom: "1px solid rgba(58, 91, 160, 0.5)"
            }}>
                <div style={{
                    position: "absolute",
                    top: -10,
                    left: 0,
                    width: "30px",
                    height: "3px",
                    background: "linear-gradient(90deg, #3a5ba0, #c9d4f5)",
                    borderRadius: "3px"
                }} />
                <h3 style={{
                    color: "#c9d4f5",
                    fontSize: "1.4rem",
                    margin: "0.5rem 0 0 0",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    fontWeight: "300",
                    display: "flex",
                    alignItems: "center"
                }}>
                </h3>
                <p style={{
                    fontSize: "0.7rem",
                    color: "rgba(201, 212, 245, 0.4)",
                    margin: "0.3rem 0 0 0",
                    letterSpacing: "1.5px"
                }}>
                    MOONLIGHT EDITION
                </p>
            </div>

            {/* Category List with Enhanced Hover Effects */}
            <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0
            }}>
                <li
                    style={{
                        padding: "0.8rem 1.2rem",
                        cursor: "pointer",
                        backgroundColor: selectedCategory === "" ? "rgba(58, 91, 160, 0.3)" : "transparent",
                        borderRadius: "6px",
                        marginBottom: "0.4rem",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        color: selectedCategory === "" ? "#f0f4ff" : "#c9d4f5",
                        fontWeight: selectedCategory === "" ? "500" : "400",
                        borderLeft: selectedCategory === "" ? "3px solid #3a5ba0" : "3px solid transparent",
                        position: "relative",
                        overflow: "hidden"
                    }}
                    onClick={() => onSelectCategory("")}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(58, 91, 160, 0.25)";
                        e.currentTarget.style.boxShadow = "0 0 15px rgba(58, 91, 160, 0.2)";
                        e.currentTarget.style.transform = "translateX(5px)";
                        e.currentTarget.querySelector('.hover-underline').style.transform = "translateX(0)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = selectedCategory === "" ? "rgba(58, 91, 160, 0.3)" : "transparent";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "translateX(0)";
                        e.currentTarget.querySelector('.hover-underline').style.transform = "translateX(-100%)";
                    }}
                >
                    <span style={{
                        marginRight: "10px",
                        fontSize: "1.1rem",
                        transition: "all 0.3s ease"
                    }}>🌕</span>
                    Semua Kategori
                    <span className="hover-underline" style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "1px",
                        background: "linear-gradient(90deg, rgba(168, 193, 248, 0.7), transparent)",
                        transform: "translateX(-100%)",
                        transition: "transform 0.3s ease"
                    }} />
                </li>
                {categories.map((cat) => (
                    <li
                        key={cat}
                        style={{
                            padding: "0.8rem 1.2rem",
                            cursor: "pointer",
                            backgroundColor: selectedCategory === cat ? "rgba(58, 91, 160, 0.3)" : "transparent",
                            borderRadius: "6px",
                            marginBottom: "0.4rem",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            color: selectedCategory === cat ? "#f0f4ff" : "#c9d4f5",
                            fontWeight: selectedCategory === cat ? "500" : "400",
                            borderLeft: selectedCategory === cat ? "3px solid #3a5ba0" : "3px solid transparent",
                            position: "relative",
                            overflow: "hidden"
                        }}
                        onClick={() => onSelectCategory(cat)}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(58, 91, 160, 0.25)";
                            e.currentTarget.style.boxShadow = "0 0 15px rgba(58, 91, 160, 0.2)";
                            e.currentTarget.style.transform = "translateX(5px)";
                            e.currentTarget.querySelector('.hover-underline').style.transform = "translateX(0)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = selectedCategory === cat ? "rgba(58, 91, 160, 0.3)" : "transparent";
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.transform = "translateX(0)";
                            e.currentTarget.querySelector('.hover-underline').style.transform = "translateX(-100%)";
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{
                                marginRight: "10px",
                                fontSize: "1.1rem",
                                opacity: 0.8,
                                transition: "all 0.3s ease"
                            }}>
                                {emojiMap[cat] || "◦"}
                            </span>
                            {cat}
                        </div>
                        {selectedCategory === cat && (
                            <span style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "#3a5ba0",
                                boxShadow: "0 0 6px #3a5ba0",
                                transition: "all 0.3s ease"
                            }} />
                        )}
                        <span className="hover-underline" style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "1px",
                            background: "linear-gradient(90deg, rgba(168, 193, 248, 0.7), transparent)",
                            transform: "translateX(-100%)",
                            transition: "transform 0.3s ease"
                        }} />
                    </li>
                ))}
            </ul>

            {/* Signature Section */}
            <div style={{
                marginTop: "3rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(58, 91, 160, 0.3)",
                position: "relative"
            }}>
                <div style={{
                    position: "absolute",
                    top: "-1px",
                    left: "20%",
                    width: "60%",
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, #3a5ba0, transparent)",
                }} />
                <p style={{
                    fontSize: "0.75rem",
                    color: "rgba(201, 212, 245, 0.5)",
                    textAlign: "center",
                    margin: "0.5rem 0",
                    fontStyle: "italic"
                }}>
                    "Harmony in every note"
                </p>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "0.5rem"
                }}>
                    <span style={{
                        fontSize: "0.65rem",
                        color: "rgba(201, 212, 245, 0.3)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        position: "relative",
                        padding: "0 10px"
                    }}>
                        Made by
                        <span style={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            width: "8px",
                            height: "1px",
                            backgroundColor: "rgba(201, 212, 245, 0.3)"
                        }} />
                        <span style={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            width: "8px",
                            height: "1px",
                            backgroundColor: "rgba(201, 212, 245, 0.3)"
                        }} />
                    </span>
                </div>
                <p style={{
                    fontSize: "0.9rem",
                    color: "rgba(161, 184, 255, 0.7)",
                    textAlign: "center",
                    margin: "0.3rem 0 0 0",
                    fontWeight: "500",
                    letterSpacing: "1px"
                }}>
                    Ade7
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
