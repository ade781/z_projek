import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const AnalyticsOwner = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const id_owner = localStorage.getItem("id_owner");
        if (!token || !id_owner) {
          setErrorMsg("Silakan login sebagai owner.");
          setLoading(false);
          return;
        }
        const res = await axios.get(`${BASE_URL}/owner/analytics/${id_owner}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.data || null);
      } catch (error) {
        setErrorMsg("Gagal memuat analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-950 flex items-center justify-center">
        <div className="text-yellow-200">
          <div className="w-14 h-14 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Mengolah laporan guild...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-950 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-400/40 text-red-100 p-6 rounded-xl">
          {errorMsg}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-950 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-300">Analitik Guild</h1>
          <p className="text-indigo-200 italic mt-2">
            Pantau performa misi dan petualangmu.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-indigo-950/70 border border-yellow-500/40 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-yellow-200 mb-4">Ringkasan Misi</h2>
            <div className="space-y-2 text-indigo-100">
              <p>Total Misi: {stats.total_misi}</p>
              <p>Misi Selesai: {stats.selesai}</p>
              <p>Misi Aktif: {stats.aktif}</p>
              <p>Belum Diambil: {stats.belum_diambil}</p>
              <p>Completion Rate: {(stats.completion_rate * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-indigo-950/70 border border-yellow-500/40 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-yellow-200 mb-4">Reward & Aktivitas</h2>
            <div className="space-y-2 text-indigo-100">
              <p>Petualang Terlibat: {stats.petualang_terlibat}</p>
              <p>Rata-rata XP: {stats.avg_reward_xp}</p>
              <p>Rata-rata Koin: {stats.avg_reward_koin}</p>
              <p>Rata-rata Reputasi: {stats.avg_reputasi}</p>
              <p>Di bawah standar: {stats.reputasi_below_count}</p>
              <p>Approved: {stats.approval.approved}</p>
              <p>Rejected: {stats.approval.rejected}</p>
              <p>Pending: {stats.approval.pending}</p>
            </div>
          </div>
        </div>

        {stats.reputasi_warning && (
          <div className="mt-6 bg-red-500/20 border border-red-400/40 text-red-100 p-4 rounded-xl">
            {stats.reputasi_warning}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsOwner;
