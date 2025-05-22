import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";

const MisiListOwner = () => {
  const [misi, setMisi] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMisiOwner = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const namaOwner = localStorage.getItem("nama_owner") || "";
        setOwnerName(namaOwner);

        if (!token) {
          setErrorMsg("Please login first.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${BASE_URL}/misi`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          setMisi(res.data);
        } else if (Array.isArray(res.data.data)) {
          setMisi(res.data.data);
        } else {
          setErrorMsg("Data misi tidak valid.");
        }
      } catch (error) {
        setErrorMsg("Gagal mengambil data misi owner.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisiOwner();
  }, []);

  const handleDetailMisi = (id_misi) => {
    navigate(`/detail-misi-owner/${id_misi}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("id_owner");
    localStorage.removeItem("nama_owner");
    navigate("/login-owner");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Daftar Misi Owner</h2>
        <div>
          <span style={{ marginRight: "10px" }}>Halo, {ownerName}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <button
        onClick={() => navigate("/misi-owner/tambah")}
        style={{ marginBottom: "20px" }}
      >
        Tambah Misi Baru
      </button>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {Array.isArray(misi) && misi.length === 0 && <p>Belum ada misi.</p>}
      {Array.isArray(misi) &&
        misi.map((item) => (
          <div
            key={item.id_misi}
            onClick={() => handleDetailMisi(item.id_misi)}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            <h3>{item.judul_misi}</h3>
            <p>{item.deskripsi}</p>
            <p>Hadiah Koin: {item.hadiah_koin}</p>
            <p>Hadiah XP: {item.hadiah_xp}</p>
            <p>Status: {item.status_misi}</p>
            <p>Level Required: {item.level_required}</p>
          </div>
        ))}
    </div>
  );
};

export default MisiListOwner;
