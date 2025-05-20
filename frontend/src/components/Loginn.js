import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [moonHover, setMoonHover] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            const res = await axios.post(`${BASE_URL}/login`, { email, password });
            localStorage.setItem("accessToken", res.data.accessToken);
            navigate("/note");
        } catch (err) {
            setErrorMsg("Email atau Password salah");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            await axios.post(`${BASE_URL}/add-user`, { name, email, password });
            alert("Registrasi berhasil");
            setIsLogin(true);
            setName(""); setEmail(""); setPassword("");
        } catch (err) {
            setErrorMsg("Registrasi gagal");
        }
    };

    // Create floating notes
    const renderNotes = () => {
        const notes = ['♪', '♫', '♩', '♬'];
        return notes.map((note, index) => (
            <div key={index} style={{
                position: 'absolute',
                fontSize: '24px',
                color: `rgba(255, 255, 255, ${0.4 + Math.random() * 0.6})`,
                top: `${10 + Math.random() * 80}%`,
                left: `${10 + Math.random() * 80}%`,
                transform: `rotate(${Math.random() * 60 - 30}deg)`,
                transition: 'all 0.3s ease',
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                zIndex: 1
            }}>
                {note}
            </div>
        ));
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            color: '#e0e0e0',
            fontFamily: "'Arial', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Moon */}
            <div
                style={{
                    position: 'absolute',
                    top: '15%',
                    right: '15%',
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle at 30% 30%, #f5f5f5, #d4d4d4)',
                    borderRadius: '50%',
                    boxShadow: `0 0 ${moonHover ? '60px' : '40px'} rgba(245, 245, 245, ${moonHover ? 0.8 : 0.5})`,
                    transition: 'all 0.3s ease',
                    animation: 'float 6s ease-in-out infinite',
                    cursor: 'pointer',
                    transform: moonHover ? 'scale(1.1)' : 'scale(1)',
                    zIndex: 2
                }}
                onMouseEnter={() => setMoonHover(true)}
                onMouseLeave={() => setMoonHover(false)}
            >
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    width: '20px',
                    height: '20px',
                    background: 'rgba(200, 200, 200, 0.8)',
                    borderRadius: '50%'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: '50px',
                    width: '15px',
                    height: '15px',
                    background: 'rgba(200, 200, 200, 0.6)',
                    borderRadius: '50%'
                }}></div>
            </div>

            {/* Stars */}
            {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: '3px',
                    height: '3px',
                    background: 'white',
                    borderRadius: '50%',
                    animation: `twinkle ${2 + Math.random() * 3}s infinite ease-in-out`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0.5 + Math.random() * 0.5
                }}></div>
            ))}

            {/* Musical notes */}
            {renderNotes()}

            {/* Auth Form */}
            <div style={{
                background: 'rgba(30, 30, 60, 0.8)',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                width: '350px',
                zIndex: 10,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    color: '#e0e0e0',
                    fontSize: '2rem',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                    position: 'relative'
                }}>
                    {isLogin ? "Moonlight Login" : "Moonlight Register"}
                    <div style={{
                        display: 'block',
                        width: '50px',
                        height: '3px',
                        background: 'linear-gradient(to right, #9c88ff, #8c7ae6)',
                        margin: '0.5rem auto',
                        borderRadius: '3px'
                    }}></div>
                </h2>

                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                    {!isLogin && (
                        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#b8b8b8',
                                fontSize: '0.9rem'
                            }}>Nama</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '5px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>
                    )}
                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#b8b8b8',
                            fontSize: '0.9rem'
                        }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '5px',
                                color: 'white',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#b8b8b8',
                            fontSize: '0.9rem'
                        }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '5px',
                                color: 'white',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    {errorMsg && <p style={{
                        color: '#ff6b6b',
                        textAlign: 'center',
                        margin: '1rem 0',
                        fontSize: '0.9rem'
                    }}>{errorMsg}</p>}
                    <button type="submit" style={{
                        width: '100%',
                        padding: '0.8rem',
                        background: 'linear-gradient(to right, #9c88ff, #8c7ae6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginTop: '0.5rem'
                    }}>{isLogin ? "Login" : "Register"}</button>
                </form>
                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: '#b8b8b8'
                }}>
                    {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
                    <button onClick={() => setIsLogin(!isLogin)} style={{
                        background: 'none',
                        border: 'none',
                        color: '#9c88ff',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        textDecoration: 'underline',
                        transition: 'all 0.3s ease'
                    }}>
                        {isLogin ? "Daftar" : "Login"}
                    </button>
                </p>
            </div>

            {/* Animation styles */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes twinkle {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default Auth;
