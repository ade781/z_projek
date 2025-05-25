import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate, useOutletContext } from "react-router-dom";

const MisiListOwner = () => {
  const [misi, setMisi] = useState([]);
  const [filteredMisi, setFilteredMisi] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { filterStatus } = useOutletContext(); // Dapat dari LayoutOwner

  useEffect(() => {
    const fetchMisiOwner = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setErrorMsg("Silakan login terlebih dahulu.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${BASE_URL}/misi`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
            ? res.data.data
            : [];

        setMisi(data);
      } catch (error) {
        setErrorMsg("Alangkah sebaiknya jika login dulu karena sesi nya udah habis");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisiOwner();
  }, []);

  useEffect(() => {
    // Filter berdasarkan status misi dulu
    let filtered = filterStatus === "semua"
      ? misi
      : misi.filter((item) => item.status_misi === filterStatus);

    // Lalu filter berdasarkan search term (case-insensitive)
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.judul_misi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMisi(filtered);
  }, [filterStatus, misi, searchTerm]);

  const handleDetailMisi = (id_misi) => {
    navigate(`/detail-misi-owner/${id_misi}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Daftar Misi Owner</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Cari judul misi..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {filteredMisi.length === 0 && <p>Tidak ada misi.</p>}

      {filteredMisi.map((item) => (
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
