import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const MisiList = () => {
  const [misi, setMisi] = useState([]);
  const [filteredMisi, setFilteredMisi] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("semua"); // default semua
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMisi = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setErrorMsg("Please login first.");
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
        setFilteredMisi(data); // awalnya tampil semua
      } catch (error) {
        setErrorMsg("Gagal mengambil data misi.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisi();
  }, []);

  // Filter berdasarkan status
  useEffect(() => {
    if (filterStatus === "semua") {
      setFilteredMisi(misi);
    } else {
      setFilteredMisi(misi.filter((item) => item.status_misi === filterStatus));
    }
  }, [filterStatus, misi]);

  const handleDetailMisi = (id_misi) => {
    navigate(`/detail-misi/${id_misi}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Daftar Misi</h2>

      {/* Tombol filter status */}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => setFilterStatus("semua")}
          disabled={filterStatus === "semua"}
          style={{ marginRight: 8 }}
        >
          Semua
        </button>
        <button
          onClick={() => setFilterStatus("belum diambil")}
          disabled={filterStatus === "belum diambil"}
          style={{ marginRight: 8 }}
        >
          Belum Selesai
        </button>
        <button
          onClick={() => setFilterStatus("aktif")}
          disabled={filterStatus === "aktif"}
          style={{ marginRight: 8 }}
        >
          Aktif
        </button>
        <button
          onClick={() => setFilterStatus("selesai")}
          disabled={filterStatus === "selesai"}
        >
          Selesai
        </button>
      </div>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {filteredMisi.length === 0 && <p>Belum ada misi.</p>}

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

          {item.status_misi === "belum diambil" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDetailMisi(item.id_misi);
              }}
            >
              Ambil Misi
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MisiList;
