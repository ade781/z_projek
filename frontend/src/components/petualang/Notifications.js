import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("accessToken");
  const id_petualang = localStorage.getItem("id_petualang");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/notification/${id_petualang}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.data || []);
    } catch (error) {
      setErrorMsg("Gagal memuat notifikasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !id_petualang) {
      setErrorMsg("Silakan login terlebih dahulu.");
      setLoading(false);
      return;
    }
    fetchNotifications();
  }, []);

  const markRead = async (id_notification) => {
    await axios.put(
      `${BASE_URL}/notification/${id_notification}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchNotifications();
  };

  const markAllRead = async () => {
    await axios.put(
      `${BASE_URL}/notification/petualang/${id_petualang}/read-all`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchNotifications();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-amber-900 flex items-center justify-center">
        <div className="text-amber-200">
          <div className="w-14 h-14 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Mengirimkan pesan guild...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-900 to-slate-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-amber-200">Pesan Guild</h1>
          <p className="text-amber-100/80 italic mt-2">
            Semua kabar penting petualanganmu tersimpan di sini.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-100 p-4 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end mb-4">
          <button
            onClick={markAllRead}
            className="px-4 py-2 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400"
          >
            Tandai semua dibaca
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id_notification}
              className={`border rounded-xl p-4 ${
                notif.is_read
                  ? "bg-slate-950/70 border-slate-700"
                  : "bg-amber-500/10 border-amber-400"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-amber-100">{notif.title}</h3>
                  <p className="text-sm text-amber-100/70 mt-1">{notif.message}</p>
                  <p className="text-xs text-amber-300 mt-2">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                {!notif.is_read && (
                  <button
                    onClick={() => markRead(notif.id_notification)}
                    className="text-xs px-3 py-1 bg-amber-500 text-slate-900 rounded-full"
                  >
                    Baca
                  </button>
                )}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-amber-100/70 text-center">Belum ada notifikasi.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
