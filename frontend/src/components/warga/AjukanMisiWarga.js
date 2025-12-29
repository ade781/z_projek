import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const AjukanMisiWarga = () => {
  const [form, setForm] = useState({
    judul_misi: "",
    deskripsi: "",
    hadiah_koin: 0,
    min_reputasi: 0,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requests, setRequests] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const navigate = useNavigate();

  const id_warga_desa = localStorage.getItem("id_warga_desa");

  const fetchRequests = async () => {
    if (!id_warga_desa) return;
    const saldoRes = await axios.get(`${BASE_URL}/warga-desa/${id_warga_desa}`);
    setSaldo(saldoRes.data.data?.koin || 0);
    const res = await axios.get(`${BASE_URL}/misi-request/warga/${id_warga_desa}`);
    setRequests(res.data.data || []);
  };

  useEffect(() => {
    if (!id_warga_desa) {
      navigate("/login-warga");
      return;
    }
    fetchRequests();
  }, [id_warga_desa]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "hadiah_koin" || name === "min_reputasi"
        ? parseInt(value, 10) || 0
        : value;
    setForm((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      if (form.hadiah_koin > saldo) {
        setErrorMsg("Koin tidak cukup. Ajukan topup terlebih dulu.");
        setIsSubmitting(false);
        return;
      }
      await axios.post(`${BASE_URL}/misi-request`, {
        id_warga_desa,
        ...form,
      });
      setSuccessMsg("Pengajuan misi berhasil dikirim.");
      setForm({ judul_misi: "", deskripsi: "", hadiah_koin: 0, min_reputasi: 0 });
      fetchRequests();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal mengajukan misi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("id_warga_desa");
    localStorage.removeItem("nama_warga");
    navigate("/login-warga");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-slate-900 to-emerald-950 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-emerald-200">Papan Pengajuan Misi</h1>
            <p className="text-emerald-100/70 italic mt-2">
              Sampaikan kebutuhan desa kepada guild petualang.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4 md:mt-0">
            <div className="px-4 py-2 bg-emerald-700/40 text-emerald-100 rounded-lg">
              Saldo: {saldo} koin
            </div>
            <button
              onClick={() => navigate("/topup-warga")}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400"
            >
              Ajukan Koin
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-700"
            >
              Keluar
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-black/70 border border-emerald-500/40 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-emerald-200 mb-4">Ajukan Misi</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-emerald-200 mb-1 text-sm uppercase tracking-wider">
                  Judul Misi
                </label>
                <input
                  type="text"
                  name="judul_misi"
                  value={form.judul_misi}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-emerald-500 text-white outline-none"
                  placeholder="Judul misi"
                />
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 text-sm uppercase tracking-wider">
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-emerald-500 text-white outline-none"
                  placeholder="Ceritakan kebutuhan misi"
                />
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 text-sm uppercase tracking-wider">
                  Hadiah Koin (diinput warga)
                </label>
                <input
                  type="number"
                  name="hadiah_koin"
                  value={form.hadiah_koin}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-emerald-500 text-white outline-none"
                />
                {form.hadiah_koin > saldo && (
                  <p className="text-xs text-red-300 mt-1">
                    Koin tidak cukup. Ajukan topup terlebih dulu.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-emerald-200 mb-1 text-sm uppercase tracking-wider">
                  Minimum Reputasi
                </label>
                <input
                  type="number"
                  name="min_reputasi"
                  value={form.min_reputasi}
                  onChange={handleChange}
                  min="0"
                  max="100"
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
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  isSubmitting
                    ? "bg-emerald-900 text-emerald-200"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white hover:from-emerald-400 hover:to-emerald-600"
                }`}
              >
                {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
              </button>
            </form>
          </div>

          <div className="bg-black/70 border border-emerald-500/40 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-emerald-200 mb-4">Riwayat Pengajuan</h2>
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id_misi_request}
                  className="bg-slate-900/70 border border-emerald-700 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-100">
                        {req.judul_misi}
                      </h3>
                      <p className="text-sm text-emerald-100/70 mt-1">
                        {req.deskripsi}
                      </p>
                    </div>
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
                  <div className="mt-3 text-xs text-emerald-200/70">
                    Koin: {req.hadiah_koin} | Min Rep: {req.min_reputasi || 0} | Level: {req.level_required || "-"} | XP: {req.hadiah_xp || "-"}
                  </div>
                  {req.catatan_owner && (
                    <div className="mt-2 text-xs text-emerald-100/70">
                      Catatan owner: {req.catatan_owner}
                    </div>
                  )}
                </div>
              ))}
              {requests.length === 0 && (
                <p className="text-emerald-100/70">Belum ada pengajuan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjukanMisiWarga;
