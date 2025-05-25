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
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMisi = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setErrorMsg("Please login first.");
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
        
        // Show welcome confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } catch (error) {
        setErrorMsg("Gagal mengambil data misi.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisi();
  }, []);

  // Filter and sort effects
  useEffect(() => {
    let result = [...misi];
    
    // Filter by status
    if (filterStatus !== "semua") {
      result = result.filter((item) => item.status_misi === filterStatus);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(item => 
        item.judul_misi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort missions
    switch(sortBy) {
      case "koin-asc":
        result.sort((a, b) => a.hadiah_koin - b.hadiah_koin);
        break;
      case "koin-desc":
        result.sort((a, b) => b.hadiah_koin - a.hadiah_koin);
        break;
      case "xp-asc":
        result.sort((a, b) => a.hadiah_xp - b.hadiah_xp);
        break;
      case "xp-desc":
        result.sort((a, b) => b.hadiah_xp - a.hadiah_xp);
        break;
      case "level-asc":
        result.sort((a, b) => a.level_required - b.level_required);
        break;
      case "level-desc":
        result.sort((a, b) => b.level_required - a.level_required);
        break;
      default:
        // Default sorting (perhaps by mission ID or no sorting)
        break;
    }
    
    setFilteredMisi(result);
  }, [filterStatus, misi, searchTerm, sortBy]);

  const handleDetailMisi = (id_misi) => {
    navigate(`/detail-misi/${id_misi}`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "belum diambil":
        return "bg-gray-500";
      case "aktif":
        return "bg-yellow-500";
      case "selesai":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  const getDifficultyColor = (level) => {
    if (level < 5) return "text-green-400";
    if (level < 10) return "text-yellow-400";
    if (level < 15) return "text-orange-500";
    return "text-red-600";
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-amber-300 text-xl font-medieval tracking-wider">
          Memuat Papan Misi Guild...
        </p>
        <p className="text-gray-400 mt-2">Sedang menghubungi Dewan Petualang</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Guild Banner */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-600 rounded-lg p-6 mb-8 border-2 border-amber-400 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-opacity-20 bg-black"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-100 font-medieval tracking-wide mb-2">
              Papan Misi Guild
            </h1>
            <p className="text-amber-200 text-lg">
              Temukan misi dan dapatkan hadiah untuk meningkatkan reputasimu!
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-900 opacity-30"></div>
          <div className="absolute top-2 left-2 right-2 h-1 bg-amber-300 opacity-20 rounded-full"></div>
        </div>

        {/* Controls Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-amber-700 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-amber-300 mb-2 font-medium">Cari Misi</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ketik judul atau deskripsi..."
                  className="w-full bg-gray-700 text-amber-100 rounded-lg px-4 py-2 border border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-3 top-2 text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter */}
            <div>
              <label className="block text-amber-300 mb-2 font-medium">Filter Status</label>
              <div className="flex flex-wrap gap-2">
                {["semua", "belum diambil", "aktif", "selesai"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      filterStatus === status
                        ? "bg-amber-600 text-amber-100 shadow-md"
                        : "bg-gray-700 text-amber-200 hover:bg-gray-600"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-amber-300 mb-2 font-medium">Urutkan</label>
              <select
                className="w-full bg-gray-700 text-amber-100 rounded-lg px-4 py-2 border border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="koin-asc">Hadiah Koin (Rendah-Tinggi)</option>
                <option value="koin-desc">Hadiah Koin (Tinggi-Rendah)</option>
                <option value="xp-asc">Hadiah XP (Rendah-Tinggi)</option>
                <option value="xp-desc">Hadiah XP (Tinggi-Rendah)</option>
                <option value="level-asc">Level (Rendah-Tinggi)</option>
                <option value="level-desc">Level (Tinggi-Rendah)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-amber-700 shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-900 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Misi</p>
                <p className="text-2xl font-bold text-amber-300">{misi.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-amber-700 shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-900 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Misi Aktif</p>
                <p className="text-2xl font-bold text-amber-300">{misi.filter(m => m.status_misi === "aktif").length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-amber-700 shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-900 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Misi Selesai</p>
                <p className="text-2xl font-bold text-amber-300">{misi.filter(m => m.status_misi === "selesai").length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-900 text-red-100 p-4 rounded-lg mb-8 border border-red-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errorMsg}
          </div>
        )}

        {/* Missions List */}
        {filteredMisi.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-amber-700 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-amber-300 mb-2">Tidak Ada Misi Ditemukan</h3>
            <p className="text-gray-400">Coba ubah filter atau kata kunci pencarianmu</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMisi.map((item) => (
              <div
                key={item.id_misi}
                onClick={() => handleDetailMisi(item.id_misi)}
                onMouseEnter={() => setHoveredCard(item.id_misi)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-gray-800 rounded-lg overflow-hidden border-2 transition-all duration-300 transform ${
                  hoveredCard === item.id_misi 
                    ? "border-amber-400 scale-105 shadow-xl" 
                    : "border-amber-700 shadow-lg"
                } cursor-pointer relative`}
              >
                {/* Status Ribbon */}
                <div className={`absolute top-0 right-0 px-4 py-1 ${getStatusColor(item.status_misi)} text-white font-bold text-sm transform translate-x-2 translate-y-2 rotate-45 origin-bottom-left`}>
                  {item.status_misi.toUpperCase()}
                </div>
                
                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-amber-300 mb-2 truncate">{item.judul_misi}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">{item.deskripsi}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-700 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-xs">Hadiah Koin</p>
                      <p className="text-amber-300 font-bold text-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.hadiah_koin}
                      </p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-xs">Hadiah XP</p>
                      <p className="text-green-400 font-bold text-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {item.hadiah_xp}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-xs">Level Dibutuhkan</p>
                      <p className={`font-bold ${getDifficultyColor(item.level_required)}`}>
                        Lv. {item.level_required}
                      </p>
                    </div>
                    
                    {item.status_misi === "belum diambil" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDetailMisi(item.id_misi);
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Ambil
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Card Footer */}
                <div className="bg-gray-900 bg-opacity-50 px-6 py-3 border-t border-amber-800">
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>ID: #{item.id_misi}</span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Guild Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2023 Guild Petualang Fantasi. Semua hak dilindungi.</p>
          <p className="mt-1">Dibuat dengan ♥ untuk para petualang sejati</p>
        </div>
      </div>
      
      {/* Custom styles for confetti animation */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MisiList;