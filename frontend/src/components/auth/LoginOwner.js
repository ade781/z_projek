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

            navigate("/misi-owner"); // ubah sesuai rute dashboard owner kamu
        } catch (err) {
            setErrorMsg("Username atau Password Owner salah");
        }
    };

    return (
        <div>
            <img
                src="/logo-guild.png"
                alt="Guild Logo"
                style={{ width: "50px", height: "auto" }}
            />
            <h2>Login Owner</h2>
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
                Kembali ke{" "}
                <button onClick={() => navigate("/")}>
                    Login Petualang
                </button>
            </p>
        </div>
    );
};

export default LoginOwner;