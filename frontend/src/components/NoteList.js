import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate, useOutletContext } from "react-router-dom";

const NoteList = () => {
    const [notes, setNotes] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const { searchTerm, selectedCategory } = useOutletContext();

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setErrorMsg("You need to login first");
            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}/note`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes(response.data);
            setErrorMsg("");
        } catch (error) {
            setErrorMsg("token habis, alangkah baiknya jika login dulu");
            console.error(error);
        }
    };

    const deleteNote = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            setErrorMsg("You need to login first");
            return;
        }

        try {
            await axios.delete(`${BASE_URL}/note/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            getNotes();
        } catch (error) {
            setErrorMsg("Failed to delete note.");
            console.error(error);
        }
    };

    const filteredNotes = notes.filter((note) => {
        const matchesSearch = note.judul.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "" || note.kategori === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{
            maxWidth: "1700px",
            margin: "-2rem",
            fontFamily: "'Crimson Text', serif",
            padding: "2rem",
            background: `
                radial-gradient(ellipse at bottom, #0a0e17 0%,rgb(7, 29, 44) 100%),
                repeating-linear-gradient(
                    180deg,
                    rgba(138, 164, 212, 0.05) 0px,
                    rgba(138, 164, 212, 0.05) 1px,
                    transparent 1px,
                    transparent 40px
                ),
                repeating-linear-gradient(
                    90deg,
                    rgba(138, 164, 212, 0.05) 0px,
                    rgba(138, 164, 212, 0.05) 1px,
                    transparent 1px,
                    transparent 40px
                )`,
            minHeight: "100vh"
        }}>
            {/* Moon and Stars Background Elements */}
            <div style={{
                position: "fixed",
                top: "50px",
                right: "100px",
                width: "150px",
                height: "150px",
                background: "radial-gradient(circle, #f5f3ce 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(1px)",
                opacity: "0.3",
                zIndex: "0"
            }}></div>

            {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} style={{
                    position: "fixed",
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    background: "#f5f3ce",
                    borderRadius: "50%",
                    opacity: "0.8",
                    zIndex: "0"
                }}></div>
            ))}

            <div style={{ position: "relative", zIndex: "1" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "3rem",
                    borderBottom: "1px solid rgba(200, 212, 236, 0.2)",
                    paddingBottom: "1.5rem"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                        <div style={{
                            width: "60px",
                            height: "60px",
                            background: "radial-gradient(circle, rgba(245,243,206,0.2) 0%, transparent 70%)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(200, 212, 236, 0.3)",
                            boxShadow: "0 0 20px rgba(245, 243, 206, 0.2)"
                        }}>
                            <span style={{
                                fontSize: "1.8rem",
                                color: "rgba(200, 212, 236, 0.7)",
                                transform: "rotate(-15deg)",
                                display: "inline-block"
                            }}>♫</span>
                        </div>
                        <h1 style={{
                            margin: 0,
                            fontSize: "2.5rem",
                            fontWeight: 400,
                            color: "#e8eef7",
                            letterSpacing: "1px",
                            fontFamily: "'Playfair Display', serif",
                            textShadow: "0 0 10px rgba(200, 212, 236, 0.3)"
                        }}>
                            Moonlight <span style={{ fontStyle: "italic", color: "rgba(245,243,206,0.8)" }}>Note</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => navigate("/add")}
                        style={{
                            cursor: "pointer",
                            padding: "0.8rem 2rem",
                            background: "rgba(138, 164, 212, 0.1)",
                            color: "#e8eef7",
                            border: "1px solid rgba(200, 212, 236, 0.4)",
                            borderRadius: "30px",
                            fontSize: "1.1rem",
                            letterSpacing: "1px",
                            transition: "all 0.3s ease",
                            fontFamily: "'Crimson Text', serif",
                            position: "relative",
                            overflow: "hidden",
                            backdropFilter: "blur(5px)"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "rgba(138, 164, 212, 0.2)";
                            e.currentTarget.style.border = "1px solid rgba(200, 212, 236, 0.6)";
                            e.currentTarget.style.boxShadow = "0 0 15px rgba(138, 164, 212, 0.3)";
                            e.currentTarget.style.color = "#f5f3ce";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "rgba(138, 164, 212, 0.1)";
                            e.currentTarget.style.border = "1px solid rgba(200, 212, 236, 0.4)";
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.color = "#e8eef7";
                        }}
                    >
                        <span style={{ position: "relative", zIndex: "1" }}>＋ Compose New</span>
                        <span style={{
                            position: "absolute",
                            top: "-50%",
                            left: "-50%",
                            width: "200%",
                            height: "200%",
                            background: "linear-gradient(45deg, transparent 30%, rgba(200, 212, 236, 0.1) 50%, transparent 70%)",
                            opacity: "0",
                            transition: "opacity 0.3s ease",
                            transform: "rotate(30deg)"
                        }}></span>
                    </button>
                </div>

                {errorMsg && (
                    <div style={{
                        padding: "1rem 1.5rem",
                        background: "rgba(214, 69, 65, 0.15)",
                        borderLeft: "3px solid rgba(214, 69, 65, 0.7)",
                        color: "#ffb8b8",
                        marginBottom: "2rem",
                        borderRadius: "0 4px 4px 0",
                        fontFamily: "'Crimson Text', serif",
                        fontSize: "1.1rem",
                        backdropFilter: "blur(5px)"
                    }}>
                        {errorMsg}
                    </div>
                )}

                {filteredNotes.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "4rem 2rem",
                        background: "rgba(10, 14, 23, 0.4)",
                        borderRadius: "8px",
                        border: "1px dashed rgba(200, 212, 236, 0.2)",
                        color: "#8aa4d4",
                        marginTop: "2rem",
                        backdropFilter: "blur(5px)",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            right: "0",
                            height: "2px",
                            background: "linear-gradient(90deg, transparent, rgba(200, 212, 236, 0.4), transparent)",
                            animation: "shimmer 3s infinite"
                        }}></div>
                        <div style={{
                            fontSize: "3rem",
                            marginBottom: "1.5rem",
                            opacity: "0.5",
                            textShadow: "0 0 10px rgba(200, 212, 236, 0.3)"
                        }}>♫ ♪ ♬</div>
                        <h3 style={{
                            fontSize: "1.8rem",
                            marginBottom: "1rem",
                            color: "rgba(245,243,206,0.8)",
                            fontFamily: "'Playfair Display', serif"
                        }}>
                            Empty Score
                        </h3>
                        <p style={{
                            fontSize: "1.2rem",
                            margin: "0 auto",
                            maxWidth: "500px",
                            lineHeight: "1.6"
                        }}>
                            Your musical notes appear here. Begin composing your moonlight sonata by creating your first note.
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "2rem"
                    }}>
                        {filteredNotes.map((note) => (
                            <div key={note.id} style={{
                                background: "rgba(15, 23, 42, 0.5)",
                                borderRadius: "8px",
                                padding: "1.8rem",
                                border: "1px solid rgba(200, 212, 236, 0.15)",
                                boxShadow: "0 8px 25px rgba(10, 25, 47, 0.5)",
                                transition: "all 0.4s ease",
                                position: "relative",
                                overflow: "hidden",
                                minHeight: "220px",
                                backdropFilter: "blur(5px)"
                            }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.border = "1px solid rgba(200, 212, 236, 0.3)";
                                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(138, 164, 212, 0.3)";
                                    e.currentTarget.style.transform = "translateY(-8px)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.border = "1px solid rgba(200, 212, 236, 0.15)";
                                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(10, 25, 47, 0.5)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                {/* Musical staff lines effect */}
                                <div style={{
                                    position: "absolute",
                                    top: "0",
                                    left: "0",
                                    right: "0",
                                    height: "100%",
                                    background: `
                                        linear-gradient(to bottom, 
                                            transparent 0%, 
                                            transparent 19%, 
                                            rgba(200, 212, 236, 0.03) 20%, 
                                            rgba(200, 212, 236, 0.03) 21%,
                                            transparent 22%,
                                            transparent 39%,
                                            rgba(200, 212, 236, 0.03) 40%,
                                            rgba(200, 212, 236, 0.03) 41%,
                                            transparent 42%,
                                            transparent 59%,
                                            rgba(200, 212, 236, 0.03) 60%,
                                            rgba(200, 212, 236, 0.03) 61%,
                                            transparent 62%,
                                            transparent 79%,
                                            rgba(200, 212, 236, 0.03) 80%,
                                            rgba(200, 212, 236, 0.03) 81%,
                                            transparent 82%)`,
                                    pointerEvents: "none"
                                }}></div>

                                <div style={{
                                    position: "absolute",
                                    top: "0",
                                    right: "0",
                                    padding: "0.6rem 1.2rem",
                                    background: "rgba(138, 164, 212, 0.15)",
                                    color: "rgba(245,243,206,0.9)",
                                    fontSize: "0.85rem",
                                    borderBottomLeftRadius: "8px",
                                    textTransform: "capitalize",
                                    fontFamily: "'Playfair Display', serif",
                                    letterSpacing: "1px",
                                    borderLeft: "1px solid rgba(200, 212, 236, 0.2)",
                                    borderBottom: "1px solid rgba(200, 212, 236, 0.2)"
                                }}>
                                    {note.kategori}
                                </div>

                                <h3 style={{
                                    margin: "0 0 1.2rem 0",
                                    color: "#f5f3ce",
                                    fontSize: "1.5rem",
                                    fontWeight: "500",
                                    paddingRight: "4rem",
                                    borderBottom: "1px solid rgba(200, 212, 236, 0.1)",
                                    paddingBottom: "0.8rem",
                                    fontFamily: "'Playfair Display', serif",
                                    letterSpacing: "0.5px"
                                }}>
                                    {note.judul}
                                </h3>

                                <p style={{
                                    color: "rgba(232, 238, 247, 0.9)",
                                    lineHeight: "1.7",
                                    marginBottom: "3rem",
                                    fontSize: "1rem",
                                    fontStyle: "italic"
                                }}>
                                    {note.isi.length > 120 ? `${note.isi.substring(0, 120)}...` : note.isi}
                                </p>

                                <div style={{
                                    position: "absolute",
                                    bottom: "0",
                                    left: "0",
                                    right: "0",
                                    padding: "0.8rem 1.5rem",
                                    background: "rgba(10, 14, 23, 0.5)",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "1.5rem",
                                    borderTop: "1px solid rgba(200, 212, 236, 0.1)"
                                }}>
                                    <button
                                        onClick={() => navigate(`/edit/${note.id}`)}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "rgba(200, 212, 236, 0.7)",
                                            cursor: "pointer",
                                            fontSize: "1.3rem",
                                            padding: "0.3rem 0.5rem",
                                            borderRadius: "4px",
                                            transition: "all 0.3s ease",
                                            position: "relative"
                                        }}
                                        title="Edit note"
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = "#f5f3ce";
                                            e.currentTarget.style.transform = "scale(1.2)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = "rgba(200, 212, 236, 0.7)";
                                            e.currentTarget.style.transform = "scale(1)";
                                        }}
                                    >
                                        ✎
                                        <span style={{
                                            position: "absolute",
                                            bottom: "-5px",
                                            left: "0",
                                            width: "100%",
                                            height: "1px",
                                            background: "rgba(200, 212, 236, 0.5)",
                                            transform: "scaleX(0)",
                                            transition: "transform 0.3s ease",
                                            transformOrigin: "center"
                                        }}></span>
                                    </button>

                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "rgba(214, 125, 125, 0.7)",
                                            cursor: "pointer",
                                            fontSize: "1.3rem",
                                            padding: "0.3rem 0.5rem",
                                            borderRadius: "4px",
                                            transition: "all 0.3s ease",
                                            position: "relative"
                                        }}
                                        title="Delete note"
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = "#ff9e9e";
                                            e.currentTarget.style.transform = "scale(1.2)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = "rgba(214, 125, 125, 0.7)";
                                            e.currentTarget.style.transform = "scale(1)";
                                        }}
                                    >
                                        🗑
                                        <span style={{
                                            position: "absolute",
                                            bottom: "-5px",
                                            left: "0",
                                            width: "100%",
                                            height: "1px",
                                            background: "rgba(214, 125, 125, 0.5)",
                                            transform: "scaleX(0)",
                                            transition: "transform 0.3s ease",
                                            transformOrigin: "center"
                                        }}></span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add some global styles for animations */}
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default NoteList;
