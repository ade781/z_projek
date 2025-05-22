import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";

const RegisterPetualang = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        try {
            const res = await axios.post(`${BASE_URL}/petualang/add-petualang`, {
                username,
                password,
                role,
                level: 1,
                koin: 0,
                jumlah_misi_selesai: 0,
                poin_pengalaman: 0,
            });
            if (res.data.status === "Success") {
                alert(res.data.message);
                navigate("/");
            } else {
                setErrorMsg("Gagal register, coba lagi.");
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || "Gagal register, coba lagi.");
        }
    };

    return (
        <div>
            <h2>Register Petualang</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <div>
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                <button type="submit">Register</button>
            </form>
            <p>
                Sudah punya akun?{" "}
                <button onClick={() => navigate("/")}>
                    Login di sini
                </button>
            </p>
        </div>
    );
};

export default RegisterPetualang;
