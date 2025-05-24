import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const MisiList = () => {
  const [misi, setMisi] = useState([]);
  const [filteredMisi, setFilteredMisi] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [expandedMisi, setExpandedMisi] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMisi = async () => {
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
        setFilteredMisi(data);
      } catch (error) {
        setErrorMsg("Gagal mengambil data misi.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisi();
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let result = [...misi];
    
    // Filter by status
    if (filterStatus !== "semua") {
      result = result.filter((item) => item.status_misi === filterStatus);
    }
    
    // Search filter
    if (searchQuery) {
      result = result.filter(item => 
        item.judul_misi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sorting
    switch(sortBy) {
      case "koin-tinggi":
        result.sort((a, b) => b.hadiah_koin - a.hadiah_koin);
        break;
      case "koin-rendah":
        result.sort((a, b) => a.hadiah_koin - b.hadiah_koin);
        break;
      case "xp-tinggi":
        result.sort((a, b) => b.hadiah_xp - a.hadiah_xp);
        break;
      case "xp-rendah":
        result.sort((a, b) => a.hadiah_xp - b.hadiah_xp);
        break;
      case "level-tinggi":
        result.sort((a, b) => b.level_required - a.level_required);
        break;
      case "level-rendah":
        result.sort((a, b) => a.level_required - b.level_required);
        break;
      default:
        // Default sorting (maybe by id or as returned from API)
        break;
    }
    
    setFilteredMisi(result);
  }, [filterStatus, misi, searchQuery, sortBy]);

  const handleDetailMisi = (id_misi) => {
    navigate(`/detail-misi/${id_misi}`);
  };

  const toggleExpandMisi = (id_misi) => {
    setExpandedMisi(expandedMisi === id_misi ? null : id_misi);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'belum diambil':
        return 'bg-gray-400';
      case 'aktif':
        return 'bg-yellow-500 animate-pulse';
      case 'selesai':
        return 'bg-green-500';
      default:
        return 'bg-blue-400';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 bg-amber-800 rounded-full animate-ping"></div>
        <div className="absolute inset-4 bg-amber-700 rounded-full flex items-center justify-center">
          <svg className="w-16 h-16 text-amber-200 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-amber-900 mb-6 font-pirata tracking-wide">
          Papan Misi Petualangan
        </h1>
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-amber-700 rounded-lg blur opacity-75 animate-pulse"></div>
          <div className="relative px-8 py-4 bg-amber-800 rounded-lg border-2 border-amber-900 shadow-xl">
            <p className="text-xl text-amber-100 font-medium">
              Temukan misi menarik dan kumpulkan hadiah!
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto mb-12 p-6 bg-amber-800 bg-opacity-10 rounded-xl border-2 border-amber-900 shadow-lg">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-amber-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari misi..."
              className="block w-full pl-10 pr-3 py-3 border border-amber-700 rounded-lg bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-amber-900 placeholder-amber-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("semua")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${filterStatus === "semua" ? 'bg-amber-700 text-amber-100 shadow-lg' : 'bg-amber-200 text-amber-900 hover:bg-amber-300'}`}
            >
              Semua Misi
            </button>
            <button
              onClick={() => setFilterStatus("belum diambil")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${filterStatus === "belum diambil" ? 'bg-amber-700 text-amber-100 shadow-lg' : 'bg-amber-200 text-amber-900 hover:bg-amber-300'}`}
            >
              Belum Diambil
            </button>
            <button
              onClick={() => setFilterStatus("aktif")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${filterStatus === "aktif" ? 'bg-amber-700 text-amber-100 shadow-lg' : 'bg-amber-200 text-amber-900 hover:bg-amber-300'}`}
            >
              Sedang Berlangsung
            </button>
            <button
              onClick={() => setFilterStatus("selesai")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${filterStatus === "selesai" ? 'bg-amber-700 text-amber-100 shadow-lg' : 'bg-amber-200 text-amber-900 hover:bg-amber-300'}`}
            >
              Selesai
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-amber-100 border border-amber-700 text-amber-900 py-2 pl-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            >
              <option value="default">Urutkan</option>
              <option value="koin-tinggi">Hadiah Koin (Tertinggi)</option>
              <option value="koin-rendah">Hadiah Koin (Terendah)</option>
              <option value="xp-tinggi">Hadiah XP (Tertinggi)</option>
              <option value="xp-rendah">Hadiah XP (Terendah)</option>
              <option value="level-tinggi">Level Required (Tertinggi)</option>
              <option value="level-rendah">Level Required (Terendah)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Mission List */}
      <div className="max-w-7xl mx-auto">
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md animate-bounce">
            <p>{errorMsg}</p>
          </div>
        )}

        {filteredMisi.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-amber-100 rounded-lg border-2 border-amber-700 shadow-lg">
              <svg className="mx-auto h-12 w-12 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-amber-900">Tidak ada misi yang ditemukan</h3>
              <p className="mt-1 text-amber-700">Coba ubah filter pencarian Anda</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMisi.map((item) => (
              <div
                key={item.id_misi}
                className={`relative rounded-xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${expandedMisi === item.id_misi ? 'ring-4 ring-amber-500' : ''}`}
                onClick={() => toggleExpandMisi(item.id_misi)}
              >
                {/* Wooden Board Background */}
                <div className="absolute inset-0 bg-wood-pattern opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-amber-700/20"></div>
                
                {/* Mission Card Content */}
                <div className="relative bg-amber-100 bg-opacity-90 h-full flex flex-col border-2 border-amber-800 rounded-xl overflow-hidden">
                  {/* Status Ribbon */}
                  <div className={`absolute top-0 right-0 px-4 py-1 ${getStatusColor(item.status_misi)} text-white font-bold rounded-bl-lg shadow-md`}>
                    {item.status_misi.toUpperCase()}
                  </div>
                  
                  {/* Mission Header */}
                  <div className="p-6 pb-4 border-b-2 border-amber-800">
                    <h3 className="text-2xl font-bold text-amber-900 mb-2 font-pirata tracking-wide">{item.judul_misi}</h3>
                    <div className="flex items-center text-sm text-amber-700">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Level {item.level_required}+
                    </div>
                  </div>
                  
                  {/* Mission Body */}
                  <div className={`p-6 transition-all duration-300 ${expandedMisi === item.id_misi ? 'max-h-full' : 'max-h-24'} overflow-hidden`}>
                    <p className="text-amber-900 mb-4">{item.deskripsi}</p>
                    
                    {expandedMisi === item.id_misi && (
                      <div className="mt-4 pt-4 border-t border-amber-800 border-dashed">
                        <h4 className="text-lg font-semibold text-amber-800 mb-2">Detail Hadiah:</h4>
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold text-amber-800">{item.hadiah_koin} Koin</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold text-amber-800">{item.hadiah_xp} XP</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Mission Footer */}
                  <div className="mt-auto p-4 bg-amber-200 bg-opacity-50 border-t-2 border-amber-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetailMisi(item.id_misi);
                      }}
                      className={`w-full py-2 px-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 ${
                        item.status_misi === "belum diambil" 
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg' 
                          : 'bg-amber-300 hover:bg-amber-400 text-amber-900'
                      }`}
                    >
                      {item.status_misi === "belum diambil" ? 'AMBIL MISI' : 'LIHAT DETAIL'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button 
          className="p-4 bg-amber-700 text-white rounded-full shadow-xl hover:bg-amber-800 transition-all duration-300 transform hover:scale-110 hover:rotate-12 animate-bounce"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-wood-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23b45309' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        .font-pirata {
          font-family: 'Pirata One', cursive, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MisiList;