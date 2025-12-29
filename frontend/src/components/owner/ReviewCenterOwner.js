import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const ReviewCenterOwner = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [reasons, setReasons] = useState({});

  const token = localStorage.getItem("accessToken");
  const id_owner = Number(localStorage.getItem("id_owner") || 0);

  const fetchLogs = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.get(`${BASE_URL}/logactivity`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { status_approval: "pending" },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      const filtered = data.filter((log) => log.misi?.id_pembuat === id_owner);
      setLogs(filtered);
    } catch (error) {
      setErrorMsg("Gagal memuat review misi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !id_owner) {
      setErrorMsg("Silakan login sebagai owner.");
      setLoading(false);
      return;
    }
    fetchLogs();
  }, []);

  const handleApprove = async (log) => {
    await axios.post(
      `${BASE_URL}/logactivity/approve-mission`,
      { id_petualang: log.id_petualang, id_misi: log.id_misi },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchLogs();
  };

  const handleReject = async (log) => {
    await axios.post(
      `${BASE_URL}/logactivity/reject-mission`,
      {
        id_petualang: log.id_petualang,
        id_misi: log.id_misi,
        alasan: reasons[log.id_log] || "",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchLogs();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-700 flex items-center justify-center">
        <div className="text-yellow-200">
          <div className="w-14 h-14 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Menyusun laporan petualangan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-950 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-300">Ruang Review Misi</h1>
          <p className="text-indigo-200 italic mt-2">
            Tinjau laporan petualang dan putuskan hadiahnya.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-100 p-4 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        <div className="space-y-5">
          {logs.map((log) => (
            <div
              key={log.id_log}
              className="bg-indigo-950/70 border border-yellow-500/40 rounded-2xl p-5"
            >
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-yellow-200">
                    {log.misi?.judul_misi || "Misi"}
                  </h3>
                  <p className="text-sm text-indigo-200/80 mt-1">
                    Petualang ID: {log.id_petualang}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-200">
                  Menunggu Review
                </span>
              </div>

              <div className="mt-4 bg-indigo-900/80 border border-indigo-700 rounded-xl p-4 text-sm text-indigo-100">
                {log.summary_ai || "Belum ada ringkasan petualangan."}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <textarea
                  placeholder="Alasan penolakan (opsional)"
                  value={reasons[log.id_log] || ""}
                  onChange={(e) =>
                    setReasons((prev) => ({ ...prev, [log.id_log]: e.target.value }))
                  }
                  className="w-full bg-indigo-900/70 border border-indigo-700 text-indigo-100 rounded-lg p-3 text-sm"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(log)}
                    className="flex-1 px-4 py-3 bg-green-500 text-indigo-950 font-semibold rounded-lg hover:bg-green-400"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleReject(log)}
                    className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center text-indigo-200">
              Tidak ada misi yang menunggu review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCenterOwner;
