import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const RequestMisiOwner = () => {
  const [requests, setRequests] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [formMap, setFormMap] = useState({});

  const token = localStorage.getItem("accessToken");
  const id_owner = localStorage.getItem("id_owner");

  const fetchRequests = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.get(`${BASE_URL}/misi-request?status=pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.data || []);
    } catch (error) {
      setErrorMsg("Gagal memuat request misi warga.");
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
    fetchRequests();
  }, []);

  const handleFieldChange = (id, field, value) => {
    setFormMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleApprove = async (request) => {
    const form = formMap[request.id_misi_request] || {};
    try {
      await axios.post(
        `${BASE_URL}/misi-request/${request.id_misi_request}/approve`,
        {
          level_required: Number(form.level_required || 1),
          hadiah_xp: Number(form.hadiah_xp || 0),
          catatan_owner: form.catatan_owner || "",
          id_owner: Number(id_owner),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal menyetujui request.");
    }
  };

  const handleReject = async (request) => {
    const form = formMap[request.id_misi_request] || {};
    try {
      await axios.post(
        `${BASE_URL}/misi-request/${request.id_misi_request}/reject`,
        {
          catatan_owner: form.catatan_owner || "",
          id_owner: Number(id_owner),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal menolak request.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-950 flex items-center justify-center">
        <div className="text-yellow-200">
          <div className="w-14 h-14 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Memuat request warga...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-950 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-300">Request Misi Warga</h1>
          <p className="text-indigo-200 italic mt-2">
            Tentukan level dan XP untuk misi yang diajukan warga.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-100 p-4 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        <div className="space-y-5">
          {requests.map((request) => {
            const form = formMap[request.id_misi_request] || {};
            return (
              <div
                key={request.id_misi_request}
                className="bg-indigo-950/70 border border-yellow-500/40 rounded-2xl p-5"
              >
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-yellow-200">
                      {request.judul_misi}
                    </h3>
                    <p className="text-sm text-indigo-200/80 mt-1">
                      {request.deskripsi}
                    </p>
                    <p className="text-xs text-yellow-200 mt-2">
                      Warga: {request.warga_desa?.nama || "Warga"} | Koin: {request.hadiah_koin}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-200">
                    pending
                  </span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-xs text-indigo-200">Level Required</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={form.level_required || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          request.id_misi_request,
                          "level_required",
                          e.target.value
                        )
                      }
                      className="w-full mt-1 px-3 py-2 bg-indigo-900/70 border border-indigo-700 text-indigo-100 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-indigo-200">Hadiah XP</label>
                    <input
                      type="number"
                      min="0"
                      value={form.hadiah_xp || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          request.id_misi_request,
                          "hadiah_xp",
                          e.target.value
                        )
                      }
                      className="w-full mt-1 px-3 py-2 bg-indigo-900/70 border border-indigo-700 text-indigo-100 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-indigo-200">Catatan Owner</label>
                    <input
                      type="text"
                      value={form.catatan_owner || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          request.id_misi_request,
                          "catatan_owner",
                          e.target.value
                        )
                      }
                      className="w-full mt-1 px-3 py-2 bg-indigo-900/70 border border-indigo-700 text-indigo-100 rounded-lg"
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleApprove(request)}
                    className="px-4 py-2 bg-green-500 text-indigo-950 font-semibold rounded-lg hover:bg-green-400"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleReject(request)}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            );
          })}

          {requests.length === 0 && (
            <div className="text-center text-indigo-200">
              Tidak ada request misi warga.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestMisiOwner;
