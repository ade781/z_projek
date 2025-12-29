import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils";

const DetailMisiOwner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [misi, setMisi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [petualangIdFromLog, setPetualangIdFromLog] = useState(null);
  const [logEntry, setLogEntry] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [petualangData, setPetualangData] = useState(null);

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
          navigate("/login");
          return;
        }

        // 1. Ambil detail misi
        const resMisi = await axios.get(`${BASE_URL}/misi/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const misiData = resMisi.data.data || resMisi.data;
        setMisi(misiData);

        // 2. Ambil logactivity terbaru untuk misi ini
        const resLog = await axios.get(`${BASE_URL}/logactivity`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            id_misi: id,
          },
        });

        const logs = resLog.data.data || resLog.data;
        if (Array.isArray(logs) && logs.length > 0) {
          const sortedLogs = [...logs].sort(
            (a, b) => new Date(a.tanggal_waktu) - new Date(b.tanggal_waktu)
          );
          const pendingLog = sortedLogs.find(
            (item) => item.status_approval === "pending"
          );
          const selectedLog = pendingLog || sortedLogs[sortedLogs.length - 1];
          setLogEntry(selectedLog);

          const petualangId = selectedLog?.id_petualang || null;
          setPetualangIdFromLog(petualangId);

          // Fetch petualang data if available
          if (petualangId) {
            const resPetualang = await axios.get(
              `${BASE_URL}/petualang/${petualangId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setPetualangData(resPetualang.data.data || resPetualang.data);
          }
        } else {
          setPetualangIdFromLog(null);
          setLogEntry(null);
        }
      } catch (error) {
        setErrorMsg("Gagal memuat data misi atau log aktivitas.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisiDanPetualang();
  }, [id, navigate]);

  const handleConfirmation = (action) => {
    setConfirmationAction(action);
    setShowConfirmation(true);
  };

  const handleConfirmAction = async () => {
    setShowConfirmation(false);
    if (confirmationAction === "approve") {
      await handleApproveMission();
    } else if (confirmationAction === "reject") {
      await handleRejectMission();
    } else if (confirmationAction === "hapus") {
      await handleDeleteMisi();
    }
  };

  const handleApproveMission = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!petualangIdFromLog) {
      setErrorMsg("Tidak ditemukan petualang yang mengerjakan misi ini.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        `${BASE_URL}/logactivity/approve-mission`,
        {
          id_petualang: petualangIdFromLog,
          id_misi: misi.id_misi,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg("Misi disetujui. Hadiah diberikan kepada petualang.");

      // Refresh data
      const resRefresh = await axios.get(`${BASE_URL}/misi/${misi.id_misi}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMisi(resRefresh.data.data || resRefresh.data);

      // Refresh petualang data
      const resPetualang = await axios.get(
        `${BASE_URL}/petualang/${petualangIdFromLog}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPetualangData(resPetualang.data.data || resPetualang.data);

      const resLogRefresh = await axios.get(`${BASE_URL}/logactivity`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id_misi: misi.id_misi },
      });
      const logs = resLogRefresh.data.data || resLogRefresh.data;
      if (Array.isArray(logs) && logs.length > 0) {
        const sortedLogs = [...logs].sort(
          (a, b) => new Date(a.tanggal_waktu) - new Date(b.tanggal_waktu)
        );
        const pendingLog = sortedLogs.find(
          (item) => item.status_approval === "pending"
        );
        setLogEntry(pendingLog || sortedLogs[sortedLogs.length - 1]);
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal menyetujui misi.");
      console.error(error);
    }
  };

  const handleRejectMission = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!petualangIdFromLog) {
      setErrorMsg("Tidak ditemukan petualang yang sedang mengerjakan misi ini.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        `${BASE_URL}/logactivity/reject-mission`,
        {
          id_petualang: petualangIdFromLog,
          id_misi: misi.id_misi,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg("Misi ditolak. Status dikembalikan agar bisa diulang.");

      // Refresh data misi
      const resRefresh = await axios.get(`${BASE_URL}/misi/${misi.id_misi}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMisi(resRefresh.data.data || resRefresh.data);

      const resLogRefresh = await axios.get(`${BASE_URL}/logactivity`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id_misi: misi.id_misi },
      });
      const logs = resLogRefresh.data.data || resLogRefresh.data;
      if (Array.isArray(logs) && logs.length > 0) {
        const sortedLogs = [...logs].sort(
          (a, b) => new Date(a.tanggal_waktu) - new Date(b.tanggal_waktu)
        );
        setLogEntry(sortedLogs[sortedLogs.length - 1]);
      }
    } catch (error) {
      setErrorMsg("Gagal menolak misi.");
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
      setTimeout(() => {
        navigate("/misi-owner");
      }, 1500);
    } catch (error) {
      setErrorMsg("Gagal menghapus misi.");
      console.error(error);
    }
  };

  const historyCount = Array.isArray(logEntry?.history_pilihan)
    ? logEntry.history_pilihan.length
    : 0;
  const canReview = Boolean(
    misi &&
      misi.status_misi === "aktif" &&
      logEntry &&
      logEntry.status_approval === "pending" &&
      logEntry.summary_ai &&
      petualangIdFromLog
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl transform transition-all duration-300 scale-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Konfirmasi Aksi
              </h3>
              <p className="mb-6 text-gray-600">
                {confirmationAction === "approve"
                  ? "Apakah Anda yakin ingin menyetujui keberhasilan misi ini?"
                  : confirmationAction === "reject"
                    ? "Apakah Anda yakin ingin menolak dan mengulang misi ini?"
                    : "Apakah Anda yakin ingin menghapus misi ini?"}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors ${confirmationAction === "hapus"
                    ? "bg-red-500"
                    : "bg-blue-600"
                    }`}
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error and Success Messages */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 animate-fade-in">
            <p>{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 animate-fade-in">
            <p>{successMsg}</p>
          </div>
        )}

        {!misi ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">Misi tidak ditemukan</h2>
            <button
              onClick={() => navigate("/misi-owner")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Kembali ke Daftar Misi
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            {/* Mission Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{misi.judul_misi}</h2>
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
                      {misi.status_misi.toUpperCase()}
                    </span>
                    <span className="text-sm opacity-90">
                      Level Required: {misi.level_required}
                    </span>
                  </div>
                </div>
                {misi.status_misi === "aktif" && petualangData && (
                  <div className="bg-blue-500 bg-opacity-30 p-3 rounded-lg">
                    <p className="text-sm font-semibold">Petualang:</p>
                    <p className="font-medium">
                      {petualangData.nama || petualangData.username}
                    </p>
                    <p className="text-xs">Level {petualangData.level}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mission Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Deskripsi Misi</h3>
                <p className="text-gray-600 whitespace-pre-line">{misi.deskripsi}</p>
              </div>

              <div className="mb-6 bg-gray-900 text-gray-100 p-5 rounded-lg border border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <h3 className="text-lg font-semibold">Adventure Log</h3>
                  {logEntry?.status_approval && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        logEntry.status_approval === "approved"
                          ? "bg-green-600 text-white"
                          : logEntry.status_approval === "rejected"
                            ? "bg-red-600 text-white"
                            : "bg-yellow-500 text-gray-900"
                      }`}
                    >
                      {logEntry.status_approval.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Stage tercatat: {historyCount}/5
                </p>
                <div className="mt-3 whitespace-pre-line text-gray-200 text-sm leading-relaxed">
                  {logEntry?.summary_ai
                    ? logEntry.summary_ai
                    : "Belum ada ringkasan petualangan. Petualang masih menjalani stage atau belum mencapai klimaks."}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Rewards Section */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Hadiah</h3>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-yellow-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hadiah Koin</p>
                      <p className="font-bold text-gray-800">{misi.hadiah_koin} Koin</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hadiah XP</p>
                      <p className="font-bold text-gray-800">{misi.hadiah_xp} XP</p>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Status Misi</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Status Saat Ini</p>
                      <p className="font-medium capitalize">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${misi.status_misi === "selesai"
                            ? "bg-green-500"
                            : misi.status_misi === "aktif"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                            }`}
                        ></span>
                        {misi.status_misi}
                      </p>
                    </div>
                    {misi.status_misi === "aktif" && petualangIdFromLog && (
                      <div>
                        <p className="text-sm text-gray-500">Diambil Oleh</p>
                        <p className="font-medium">Petualang ID: {petualangIdFromLog}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Dibuat</p>
                      <p className="font-medium">
                        {new Date(misi.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6">
                {misi.status_misi === "aktif" && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleConfirmation("approve")}
                      disabled={!canReview}
                      className={`flex-1 min-w-[200px] px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                        canReview
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Confirm Success</span>
                    </button>
                    <button
                      onClick={() => handleConfirmation("reject")}
                      disabled={!logEntry || logEntry.status_approval !== "pending"}
                      className={`flex-1 min-w-[200px] px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                        logEntry && logEntry.status_approval === "pending"
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Reject & Retake</span>
                    </button>
                  </div>
                )}

                {misi.status_misi === "belum diambil" && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/misi-owner/edit-misi/${misi.id_misi}`)}
                      className="flex-1 min-w-[200px] px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                        />
                      </svg>
                      <span>Edit Misi</span>
                    </button>
                    <button
                      onClick={() => handleConfirmation("hapus")}
                      className="flex-1 min-w-[200px] px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Hapus Misi</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/misi-owner")}
          className="mt-6 px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Kembali ke Daftar Misi</span>
        </button>
      </div>
    </div>
  );
};

export default DetailMisiOwner;
