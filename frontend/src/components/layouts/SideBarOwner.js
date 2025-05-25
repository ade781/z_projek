import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const SideBarOwner = ({ setFilterStatus }) => {
    const navigate = useNavigate();
    const ownerName = localStorage.getItem("nama_owner") || "Owner";


    const [misiMenuOpen, setMisiMenuOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("id_owner");
        localStorage.removeItem("nama_owner");
        navigate("/login-owner");
    };

    return (
        <div>
            <img
                src="/logo-guild.png"
                alt="Guild Logo"
                style={{ width: "50px", height: "auto" }}
            />
            <div>Halo, {ownerName}</div>

            <nav>
                <NavLink to="/misi-owner">Misi </NavLink>
                <div>
                    <div onClick={() => setMisiMenuOpen(!misiMenuOpen)} style={{ cursor: "pointer" }}>
                        Daftar Misi {misiMenuOpen ? "▼" : "▶"}
                    </div>
                    {misiMenuOpen && (
                        <div style={{ marginLeft: "1rem" }}>
                            <button onClick={() => setFilterStatus("semua")}>Semua</button>
                            <button onClick={() => setFilterStatus("belum diambil")}>Belum Diambil</button>
                            <button onClick={() => setFilterStatus("aktif")}>Aktif</button>
                            <button onClick={() => setFilterStatus("selesai")}>Selesai</button>
                        </div>
                    )}
                </div>

                <NavLink to="/misi-owner/tambah">Tambah Misi</NavLink>
                <NavLink to="/register-petualang">Tambah Petualang</NavLink>
                <NavLink to="/data-petualang">Data Petualang</NavLink>
            </nav>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default SideBarOwner;
