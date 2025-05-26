import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate, useOutletContext } from "react-router-dom";

const MisiListOwner = () => {
  const [misi, setMisi] = useState([]);
  const [filteredMisi, setFilteredMisi] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { filterStatus } = useOutletContext(); // Dapat dari LayoutOwner

  useEffect(() => {
    const fetchMisiOwner = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setErrorMsg("Silakan login terlebih dahulu.");
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
      } catch (error) {
        setErrorMsg("Alangkah sebaiknya jika login dulu karena sesi nya udah habis");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisiOwner();
  }, []);

   useEffect(() => {
    // Filter berdasarkan status misi dulu
    let filtered = filterStatus === "semua"
      ? misi
      : misi.filter((item) => item.status_misi === filterStatus);

    // Lalu filter berdasarkan search term (case-insensitive)
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.judul_misi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMisi(filtered);
  }, [filterStatus, misi, searchTerm]);

  const handleDetailMisi = (id_misi) => {
    navigate(`/detail-misi-owner/${id_misi}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
      <p className="ml-4 text-yellow-600 text-xl">Memuat misi petualangan...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Guild Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-yellow-600 mb-2">Papan Misi Petualang</h1>
          <div className="w-32 h-1 bg-blue-800 mx-auto mb-6"></div>
          <p className="text-blue-800 italic">Temukan misi yang sesuai dengan kemampuanmu, petualang!</p>
        </div>

        {/* Search input */}
        <div className="mb-8 relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Cari judul misi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-6 pr-12 rounded-full border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-lg text-blue-900 placeholder-blue-400"
          />
          <svg
            className="absolute right-4 top-3.5 h-6 w-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {errorMsg && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{errorMsg}</p>
          </div>
        )}

        {filteredMisi.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block bg-yellow-100 p-6 rounded-lg border-2 border-yellow-300">
              <svg
                className="h-12 w-12 text-yellow-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xl text-yellow-800">Tidak ada misi yang tersedia saat ini.</p>
              <p className="text-yellow-600">Silakan coba lagi nanti atau buat misi baru!</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMisi.map((item) => (
            <div
              key={item.id_misi}
              onClick={() => handleDetailMisi(item.id_misi)}
              className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer border-2 border-blue-200"
            >
              {/* Mission Ribbon based on status */}
              <div className={`absolute top-0 right-0 px-4 py-1 text-white font-bold text-sm rounded-bl-lg 
                ${item.status_misi === 'aktif' ? 'bg-green-600' : 
                  item.status_misi === 'selesai' ? 'bg-blue-600' : 
                  item.status_misi === 'draft' ? 'bg-gray-500' : 'bg-yellow-600'}`}>
                {item.status_misi.toUpperCase()}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-3">{item.judul_misi}</h3>
                <p className="text-blue-700 mb-4 line-clamp-3">{item.deskripsi}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-yellow-700">{item.hadiah_koin} Koin</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="h-6 w-6 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="font-bold text-blue-700">{item.hadiah_xp} XP</span>
                  </div>
                </div>
                
                <div className="bg-blue-100 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-blue-800">Level Required:</span>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-bold">
                      Lv. {item.level_required}
                    </span>
                  </div>
                </div>
                
                <button 
                  className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDetailMisi(item.id_misi);
                  }}
                >
                  Lihat Detail Misi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MisiListOwner;