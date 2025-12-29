import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const WargaDashboard = () => {
  const [warga, setWarga] = useState(null);
  const [requests, setRequests] = useState([]);
  const [topups, setTopups] = useState([]);
  const [marketListings, setMarketListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const id_warga_desa = localStorage.getItem("id_warga_desa");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id_warga_desa) {
          navigate("/login-warga");
          return;
        }
        const [wargaRes, reqRes, topupRes, marketRes] = await Promise.all([
          axios.get(`${BASE_URL}/warga-desa/${id_warga_desa}`),
          axios.get(`${BASE_URL}/misi-request/warga/${id_warga_desa}`),
          axios.get(`${BASE_URL}/topup/warga/${id_warga_desa}`),
          axios.get(`${BASE_URL}/market/listings?status=active`),
        ]);
        setWarga(wargaRes.data.data || null);
        setRequests(reqRes.data.data || []);
        setTopups(topupRes.data.data || []);
        setMarketListings(marketRes.data.data || []);
      } catch (error) {
        setErrorMsg("Gagal memuat dashboard warga.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id_warga_desa, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-950 flex items-center justify-center">
        <div className="text-emerald-200">
          <div className="w-14 h-14 border-4 border-emerald-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Menyiapkan balai desa...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-slate-950 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-400/40 text-red-100 p-6 rounded-xl">
          {errorMsg}
        </div>
      </div>
    );
  }

  if (!warga) return null;

  const pendingRequests = requests.filter((req) => req.status === "pending").length;
  const pendingTopups = topups.filter((req) => req.status === "pending").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-slate-900 to-emerald-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-emerald-200">Balai Warga</h1>
            <p className="text-emerald-100/70 italic mt-2">
              Selamat datang, {warga.nama}. Pantau kebutuhan desa dan perdagangan.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/ajukan-misi")}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
            >
              Ajukan Misi
            </button>
            <button
              onClick={() => navigate("/topup-warga")}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400"
            >
              Permohonan Koin
            </button>
            <button
              onClick={() => navigate("/market-warga")}
              className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400"
            >
              Marketplace
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-black/70 border border-emerald-500/40 rounded-2xl p-5">
            <p className="text-emerald-100/70 text-sm">Saldo Koin</p>
            <p className="text-3xl font-bold text-emerald-200 mt-2">{warga.koin}</p>
          </div>
          <div className="bg-black/70 border border-emerald-500/40 rounded-2xl p-5">
            <p className="text-emerald-100/70 text-sm">Pengajuan Misi</p>
            <p className="text-3xl font-bold text-emerald-200 mt-2">{requests.length}</p>
            <p className="text-xs text-emerald-100/70 mt-1">Pending: {pendingRequests}</p>
          </div>
          <div className="bg-black/70 border border-emerald-500/40 rounded-2xl p-5">
            <p className="text-emerald-100/70 text-sm">Permohonan Koin</p>
            <p className="text-3xl font-bold text-emerald-200 mt-2">{topups.length}</p>
            <p className="text-xs text-emerald-100/70 mt-1">Pending: {pendingTopups}</p>
          </div>
          <div className="bg-black/70 border border-emerald-500/40 rounded-2xl p-5">
            <p className="text-emerald-100/70 text-sm">Listing Aktif</p>
            <p className="text-3xl font-bold text-emerald-200 mt-2">{marketListings.length}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="bg-black/70 border border-emerald-500/40 rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-2xl font-semibold text-emerald-200 mb-4">Pengajuan Misi Terbaru</h2>
            <div className="space-y-4">
              {requests.slice(0, 4).map((req) => (
                <div
                  key={req.id_misi_request}
                  className="bg-slate-900/70 border border-emerald-700 rounded-xl p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg text-emerald-100 font-semibold">{req.judul_misi}</h3>
                      <p className="text-xs text-emerald-100/70 mt-1">
                        Min Rep: {req.min_reputasi || 0} | Koin: {req.hadiah_koin}
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
                </div>
              ))}
              {requests.length === 0 && (
                <p className="text-emerald-100/70">Belum ada pengajuan.</p>
              )}
            </div>
          </div>

          <div className="bg-black/70 border border-emerald-500/40 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-emerald-200 mb-4">Marketplace Aktif</h2>
            <div className="space-y-3">
              {marketListings.slice(0, 4).map((listing) => (
                <div
                  key={listing.id_listing}
                  className="bg-slate-900/70 border border-emerald-700 rounded-xl p-3"
                >
                  <p className="text-emerald-100 font-semibold">{listing.title}</p>
                  <p className="text-xs text-emerald-100/70 mt-1">{listing.price} koin</p>
                </div>
              ))}
              {marketListings.length === 0 && (
                <p className="text-emerald-100/70">Belum ada listing.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WargaDashboard;
