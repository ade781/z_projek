import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const TopupWarga = () => {
  const [amount, setAmount] = useState(0);
  const [requests, setRequests] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const id_warga_desa = localStorage.getItem("id_warga_desa");

  const fetchRequests = async () => {
    const res = await axios.get(`${BASE_URL}/topup/warga/${id_warga_desa}`);
    setRequests(res.data.data || []);
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (!id_warga_desa) {
          setErrorMsg("Silakan login warga terlebih dahulu.");
          setLoading(false);
          return;
        }
        await fetchRequests();
      } catch (error) {
        setErrorMsg("Gagal memuat permohonan koin.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await axios.post(`${BASE_URL}/topup`, {
        id_warga_desa,
        amount: Number(amount),
      });
      setSuccessMsg("Permohonan koin terkirim.");
      setAmount(0);
      fetchRequests();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal mengirim permohonan.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-950 flex items-center justify-center">
        <div className="text-emerald-200">
          <div className="w-14 h-14 border-4 border-emerald-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Memuat permohonan koin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-slate-900 to-emerald-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-200">Permohonan Koin</h1>
          <p className="text-emerald-100/70 italic mt-2">
            Ajukan koin ke Guild Owner untuk kebutuhan misi desa.
          </p>
        </div>

        <div className="bg-black/70 border border-emerald-500/40 rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-emerald-200 mb-2 text-sm uppercase tracking-wider">
                Jumlah Koin
              </label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-emerald-500 text-white outline-none"
              />
            </div>
            {errorMsg && (
              <div className="text-red-400 bg-red-900/40 p-2 rounded">{errorMsg}</div>
            )}
            {successMsg && (
              <div className="text-emerald-300 bg-emerald-900/40 p-2 rounded">
                {successMsg}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 text-white hover:from-emerald-400 hover:to-emerald-600"
            >
              Kirim Permohonan
            </button>
          </form>
        </div>

        <div className="bg-black/70 border border-emerald-500/40 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-emerald-200 mb-4">Riwayat</h2>
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id_topup_request}
                className="bg-slate-900/70 border border-emerald-700 rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100 font-semibold">
                    {req.amount} koin
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      req.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-200"
                        : req.status === "rejected"
                          ? "bg-red-500/20 text-red-200"
                          : "bg-yellow-500/20 text-yellow-200"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                {req.catatan_owner && (
                  <div className="text-xs text-emerald-100/70 mt-2">
                    Catatan owner: {req.catatan_owner}
                  </div>
                )}
              </div>
            ))}
            {requests.length === 0 && (
              <p className="text-emerald-100/70">Belum ada permohonan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopupWarga;
