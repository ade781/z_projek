import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            const res = await axios.post(`${BASE_URL}/petualang/login`, {
                username,
                password,
            });

            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("id_petualang", res.data.petualang.id_petualang);
            localStorage.setItem("level_petualang", res.data.petualang.level);

            navigate("/misi");
        } catch (err) {
            setErrorMsg("Username atau Password salah");
        }
    };

    return (
        <div>
            <img
                src="/logo-guild.png"
                alt="Guild Logo"
                style={{ width: "50px", height: "auto" }}
            />
            <h2>Login Petualang</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                <button type="submit">Login</button>
            </form>

            <p>
                Anda adalah <b>Owner</b>?{" "}
                <button onClick={() => navigate("/login-owner")}>
                    Masuk sebagai Owner
                </button>
            </p>
        </div>
    );
};

export default Login;