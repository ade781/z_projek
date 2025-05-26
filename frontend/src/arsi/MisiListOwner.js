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
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
  const { filterStatus } = useOutletContext();

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
        setErrorMsg("Sesi telah habis, silakan login kembali");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisiOwner();
  }, []);

  useEffect(() => {
    let filtered = filterStatus === "semua"
      ? misi
      : misi.filter((item) => item.status_misi === filterStatus);

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
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-20 h-20 border-4 border-blue-400 border-t-yellow-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
        </div>
        <p className="mt-4 text-blue-200 font-bold text-lg animate-pulse">Memuat Papan Misi Guild...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-6">
      {/* Animated Guild Banner */}
      <div className="max-w-6xl mx-auto mb-12 text-center transform transition-all duration-500 hover:scale-105">
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 font-guild mb-2 drop-shadow-lg">
            Papan Misi Petualangan
          </h1>
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-75"></div>
        </div>
        <p className="text-blue-200 italic text-lg mt-3 animate-float">"Temukan takdirmu dalam petualangan epik!"</p>
        
        {/* Animated Search Input */}
        <div className="mt-8 relative max-w-md mx-auto transform transition-all duration-300 hover:scale-102">
          <div className="absolute inset-0 bg-blue-700 rounded-lg blur-md opacity-30"></div>
          <input
            type="text"
            placeholder="Cari misi petualangan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative w-full px-5 py-3 rounded-lg bg-blue-900/70 border-2 border-yellow-400/50 text-yellow-100 placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
          />
          <div className="absolute right-4 top-3 text-yellow-300 animate-pulse-slow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-4xl mx-auto bg-blue-800/80 border-l-4 border-yellow-400 text-yellow-100 p-4 mb-8 rounded-r-lg animate-shake">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      {filteredMisi.length === 0 && !loading && (
        <div className="max-w-4xl mx-auto bg-blue-900/50 border-2 border-yellow-400/30 p-8 text-center rounded-lg backdrop-blur-sm transform transition-all duration-500 hover:scale-102">
          <div className="inline-block mb-4 animate-bounce">
            <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-yellow-200 text-xl font-bold">Tidak ada misi tersedia!</p>
          <p className="text-blue-200 mt-2">Guild Master sedang menyiapkan misi baru...</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredMisi.map((item, index) => (
          <div
            key={item.id_misi}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleDetailMisi(item.id_misi)}
            className={`relative p-5 rounded-xl cursor-pointer transition-all duration-500 ${hoveredCard === index ? 'scale-105 shadow-2xl' : 'scale-100 shadow-lg'} overflow-hidden
              ${item.status_misi === 'aktif' ? 'bg-gradient-to-br from-blue-800 to-blue-900 border-2 border-yellow-400' : 
                item.status_misi === 'selesai' ? 'bg-gradient-to-br from-blue-900 to-blue-800 border-2 border-green-400' :
                'bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-2 border-blue-400'}
              before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] before:opacity-10 before:pointer-events-none
            `}
            style={{
              transform: hoveredCard === index ? 'perspective(1000px) rotateY(5deg) rotateX(5deg)' : 'perspective(1000px) rotateY(0) rotateX(0)',
              transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {/* Animated Card Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute -top-10 -right-10 w-20 h-20 rounded-full blur-xl opacity-20 ${item.status_misi === 'aktif' ? 'bg-yellow-400' : 'bg-blue-400'} transition-all duration-1000 ${hoveredCard === index ? 'scale-150 opacity-30' : ''}`}></div>
              <div className={`absolute -bottom-5 -left-5 w-16 h-16 rounded-full blur-lg opacity-15 ${item.status_misi === 'aktif' ? 'bg-blue-400' : 'bg-yellow-400'} transition-all duration-1000 ${hoveredCard === index ? 'scale-125 opacity-25' : ''}`}></div>
            </div>

            {/* Mission Ribbon */}
            <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-tr-lg rounded-bl-lg text-xs font-bold z-10 shadow-md transition-all duration-300 ${hoveredCard === index ? 'scale-110' : ''}
              ${item.status_misi === 'aktif' ? 'bg-yellow-500 text-blue-900' : 
                item.status_misi === 'selesai' ? 'bg-green-500 text-white' :
                'bg-blue-500 text-white'}
            `}>
              {item.status_misi.toUpperCase()}
            </div>
            
            {/* Mission Level Badge */}
            <div className="absolute -top-3 -left-3 w-12 h-12 flex items-center justify-center bg-blue-900 border-2 border-yellow-400 rounded-full shadow-lg z-10">
              <span className="text-yellow-400 font-bold text-sm">Lv. {item.level_required}</span>
            </div>

            {/* Mission Content */}
            <div className="relative z-0">
              {/* Mission Title */}
              <h3 className="text-xl font-bold mb-3 text-yellow-300 font-guild flex items-center border-b border-yellow-400/30 pb-2 min-h-[3rem]">
                <svg className={`w-5 h-5 mr-2 ${item.status_misi === 'aktif' ? 'text-yellow-400 animate-pulse-slow' : 'text-blue-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {item.judul_misi}
              </h3>
              
              {/* Mission Description */}
              <p className="text-blue-100 mb-4 italic text-sm min-h-[4rem]">{item.deskripsi}</p>
              
              {/* Mission Rewards */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className={`bg-blue-900/50 p-2 rounded-lg border ${item.status_misi === 'aktif' ? 'border-yellow-400/50' : 'border-blue-400/50'} backdrop-blur-sm transition-all duration-300 ${hoveredCard === index ? 'bg-blue-800/70' : ''}`}>
                  <p className="text-xs text-yellow-300/80">Hadiah Koin</p>
                  <p className="text-lg font-bold text-yellow-300 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {item.hadiah_koin}
                  </p>
                </div>
                
                <div className={`bg-blue-900/50 p-2 rounded-lg border ${item.status_misi === 'aktif' ? 'border-yellow-400/50' : 'border-blue-400/50'} backdrop-blur-sm transition-all duration-300 ${hoveredCard === index ? 'bg-blue-800/70' : ''}`}>
                  <p className="text-xs text-yellow-300/80">Hadiah XP</p>
                  <p className="text-lg font-bold text-yellow-300 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    {item.hadiah_xp}
                  </p>
                </div>
              </div>
              
              {/* Difficulty Indicator */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-blue-200">Kesulitan:</span>
                  <span className="text-xs font-bold text-yellow-300">
                    {item.level_required > 10 ? "LEGENDA" : item.level_required > 5 ? "SULIT" : "MUDAH"}
                  </span>
                </div>
                <div className="w-full bg-blue-900/50 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.level_required > 10 ? 'bg-gradient-to-r from-red-500 to-yellow-500' : item.level_required > 5 ? 'bg-gradient-to-r from-yellow-500 to-yellow-300' : 'bg-gradient-to-r from-green-400 to-blue-400'}`}
                    style={{ width: `${Math.min(100, item.level_required * 8)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Accept Button */}
              <div className="mt-5 flex justify-center">
                <button className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 flex items-center shadow-md ${hoveredCard === index ? 'shadow-yellow-400/30' : 'shadow-blue-400/20'}
                  ${item.status_misi === 'aktif' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900 hover:from-yellow-400 hover:to-yellow-500' : 
                    'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500'}
                `}>
                  {item.status_misi === 'aktif' ? 'AMBIL MISI' : 'LIHAT DETAIL'}
                  <svg className={`w-5 h-5 ml-2 transition-transform duration-300 ${hoveredCard === index ? 'translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Guild Footer */}
      <div className="max-w-6xl mx-auto mt-16 text-center text-blue-300/50 text-sm pb-8">
        <div className="inline-flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <p>© {new Date().getFullYear()} Guild of Azure Dawn. Semua hak dilindungi.</p>
        </div>
      </div>
    </div>
  );
};

export default MisiListOwner;