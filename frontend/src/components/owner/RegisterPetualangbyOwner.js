import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";


const RegisterPetualang = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("")
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
                setSuccessMsg("pahlawan baru telah didaftarkan");
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
                        <option value="swordsman">Swordsman</option>
                        <option value="mage">Mage</option>
                        <option value="archer">Archer</option>
                        <option value="healer">Healer</option>
                        <option value="thief">Thief</option>
                        <option value="monk">Monk</option>
                        <option value="necromancer">Necromancer</option>
                        <option value="summoner">Summoner</option>
                        <option value="berserker">Berserker</option>
                        <option value="paladin">Paladin</option>
                        <option value="alchemist">Alchemist</option>
                        <option value="beast_tamer">Beast Tamer</option>
                    </select>
                </div>
                {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
                <button type="submit">Daftarkan petualang baru</button>
            </form>

        </div>
    );
};

export default RegisterPetualang;
