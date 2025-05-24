import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils";

const EditPetualang = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const roles = [
        "Warrior", "Mage", "Archer", "Healer",
        "Rogue", "Paladin", "Summoner", "Berserker"
    ];

    useEffect(() => {
        const fetchPetualang = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(`${BASE_URL}/petualang/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = res.data.data || res.data;
                setUsername(data.username);
                setRole(data.role);
                setLoading(false);
            } catch (err) {
                setError("Gagal memuat data petualang.");
                setLoading(false);
            }
        };

        fetchPetualang();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");
            await axios.put(`${BASE_URL}/petualang/edit-petualang/${id}`, {
                username,
                role
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate("/dashboard-petualang");
        } catch (err) {
            setError("Gagal mengupdate data.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Edit Petualang</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Username: </label><br />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Role: </label><br />
                    <select value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="" disabled>Pilih Role</option>
                        {roles.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                <button type="submit">Simpan Perubahan</button>
            </form>
        </div>
    );
};

export default EditPetualang;
