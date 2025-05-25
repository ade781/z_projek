import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../utils";

const DetailMisiOwner = () => {
  const { id } = useParams(); // id misi
  const [misi, setMisi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [petualangIdFromLog, setPetualangIdFromLog] = useState(null);

  useEffect(() => {
    const fetchMisiDanPetualang = async () => {
      setErrorMsg("");
      setSuccessMsg("");
      setLoading(true);

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setErrorMsg("Silakan login sebagai owner terlebih dahulu.");
          setLoading(false);
          return;
        }

        // 1. Ambil detail misi
        const resMisi = await axios.get(`${BASE_URL}/misi/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const misiData = resMisi.data.data || resMisi.data;
        setMisi(misiData);

        // 2. Ambil logactivity aktivitas "ambil misi" untuk misi ini
        const resLog = await axios.get(`${BASE_URL}/logactivity`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            id_misi: id,
            aktivitas: "ambil misi",
          },
        });

        const logs = resLog.data.data || resLog.data;
        if (Array.isArray(logs) && logs.length > 0) {
          setPetualangIdFromLog(logs[0]?.id_petualang || null);
        } else {
          setPetualangIdFromLog(null);
        }
      } catch (error) {
        setErrorMsg("Gagal memuat data misi atau log aktivitas.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisiDanPetualang();
  }, [id]);

  function getLevelFromXP(xp) {
    if (xp < 100) return 1;
    if (xp < 300) return 2;
    if (xp < 600) return 3;
    if (xp < 1000) return 4;
    if (xp < 1500) return 5;
    if (xp < 2100) return 6;
    if (xp < 2800) return 7;
    if (xp < 3600) return 8;
    if (xp < 4500) return 9;
    if (xp < 5500) return 10;
    if (xp < 6600) return 11;
    return 12;
  }

  const handleMisiSelesai = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!petualangIdFromLog) {
      setErrorMsg("Tidak ditemukan petualang yang mengerjakan misi ini.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      // Update status misi jadi "selesai"
      await axios.put(
        `${BASE_URL}/misi/${misi.id_misi}`,
        { status_misi: "selesai" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ambil data petualang untuk update
      const resGetPetualang = await axios.get(
        `${BASE_URL}/petualang/${petualangIdFromLog}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const petualang = resGetPetualang.data.data || resGetPetualang.data;

      // Hitung XP dan level baru
      const xpBaru = (petualang.poin_pengalaman || 0) + misi.hadiah_xp;
      const levelBaru = getLevelFromXP(xpBaru);
      const naikLevel = levelBaru > (petualang.level || 1);

      // Update data petualang
      const updateData = {
        koin: (petualang.koin || 0) + misi.hadiah_koin,
        poin_pengalaman: xpBaru,
        jumlah_misi_selesai: (petualang.jumlah_misi_selesai || 0) + 1,
        ...(naikLevel && { level: levelBaru }),
      };

      console.log("Update petualang:", updateData);

      const resUpdatePetualang = await axios.put(
        `${BASE_URL}/petualang/edit-petualang/${petualangIdFromLog}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Update petualang response:", resUpdatePetualang.data);

      // Simpan log selesai misi
      await axios.post(
        `${BASE_URL}/logactivity`,
        {
          id_petualang: petualangIdFromLog,
          id_misi: misi.id_misi,
          aktivitas: "selesai misi",
          keterangan: `Petualang dengan ID ${petualangIdFromLog} telah menyelesaikan misi "${misi.judul_misi}" dan mendapat hadiah.`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg(
        `Misi berhasil ditandai selesai, hadiah diberikan, dan jumlah misi selesai bertambah.${naikLevel ? " Selamat! Petualang naik level." : ""}`
      );

      // Refresh detail misi
      const resRefresh = await axios.get(`${BASE_URL}/misi/${misi.id_misi}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMisi(resRefresh.data.data || resRefresh.data);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal menyelesaikan misi.");
      console.error(error);
    }
  };

  const handleMisiGagal = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!petualangIdFromLog) {
      setErrorMsg("Tidak ditemukan petualang yang sedang mengerjakan misi ini.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      // Update status misi ke "belum diambil" dan id_petualang menjadi null
      await axios.put(
        `${BASE_URL}/misi/${misi.id_misi}`,
        { status_misi: "belum diambil", id_petualang: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Simpan log aktivitas gagal
      await axios.post(
        `${BASE_URL}/logactivity`,
        {
          id_petualang: petualangIdFromLog,
          id_misi: misi.id_misi,
          aktivitas: "gagal misi",
          keterangan: `Petualang ID ${petualangIdFromLog} gagal menyelesaikan misi "${misi.judul_misi}".`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg("Misi dibatalkan dan status dikembalikan ke 'belum diambil'.");

      // Refresh data misi
      const resRefresh = await axios.get(`${BASE_URL}/misi/${misi.id_misi}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMisi(resRefresh.data.data || resRefresh.data);

      // Reset ID petualang yang sebelumnya ambil misi
      setPetualangIdFromLog(null);
    } catch (error) {
      setErrorMsg("Gagal membatalkan misi.");
      console.error(error);
    }
  };

  const handleDeleteMisi = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!misi || misi.status_misi !== "belum diambil") {
      setErrorMsg("Misi hanya bisa dihapus jika statusnya 'belum diambil'.");
      return;
    }



    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(`${BASE_URL}/misi/${misi.id_misi}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMsg("Misi berhasil dihapus.");
      setMisi(null); 
    } catch (error) {
      setErrorMsg("Gagal menghapus misi.");
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {!misi ? (
        <p>Misi tidak ditemukan.</p>
      ) : (
        <>
          <h2>{misi.judul_misi}</h2>
          <p>{misi.deskripsi}</p>
          <p>Hadiah Koin: {misi.hadiah_koin}</p>
          <p>Hadiah XP: {misi.hadiah_xp}</p>
          <p>Status: {misi.status_misi}</p>
          <p>Level Required: {misi.level_required}</p>

          {misi.status_misi === "aktif" && (
            <div style={{ marginTop: "10px" }}>
              <button onClick={handleMisiSelesai}>Tandai Misi Selesai</button>
              <button onClick={handleMisiGagal}>Batalkan Misi</button>
            </div>
          )}

          {misi.status_misi === "belum diambil" && (
            <div style={{ marginTop: "10px" }}>
              <button onClick={handleDeleteMisi} style={{ backgroundColor: "red", color: "white" }}>
                Hapus Misi
              </button>
            </div>
          )}

          {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

        </>
      )}
    </div>
  );
};

export default DetailMisiOwner;
