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

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const id_petualang = localStorage.getItem("id_petualang");

            console.log("Token:", token);
            console.log("ID Petualang:", id_petualang);

            if (!token || !id_petualang) {
                console.log("Token atau ID tidak ditemukan");
                return;
            }

            try {
                const res = await axios.get(`${BASE_URL}/petualang/${id_petualang}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Response dari API:", res.data);

                const userData = res.data.data || res.data;

                console.log("Data yang akan di-set:", userData);

                setPetualang({
                    username: userData.username || "",
                    role: userData.role || "",
                    level: userData.level || 0,
                    koin: userData.koin || 0,
                });
            } catch (error) {
                console.error("Error fetching petualang data:", error);
                console.error("Error response:", error.response);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("id_petualang");
        navigate("/");
    };

    return (
        <nav style={{ padding: "10px", background: "#f0f0f0", marginBottom: "20px" }}>
            <span>Username: {petualang.username}</span> |{" "}
            <span>Role: {petualang.role}</span> |{" "}
            <span>Level: {petualang.level}</span> |{" "}
            <span>Koin: {petualang.koin}</span> |{" "}
            <button onClick={() => navigate("/dashboard-petualang")}>Dashboard Petualang</button>{" "}

            <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
        </nav>
    );
};

export default NavbarPetualang;