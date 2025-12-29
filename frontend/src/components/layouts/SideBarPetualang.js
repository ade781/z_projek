import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SideBarPetualang = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Daftar menu sidebar dengan ikon petualangan
  const menuItems = [
    { path: "/misi", name: "Ekspedisi", icon: "E" },
    { path: "/dashboard-misi-petualang", name: "Peta Perjalanan", icon: "P" },
    { path: "/leaderboard-petualang", name: "Papan Juara", icon: "L" },
    { path: "/achievements", name: "Lencana", icon: "A" },
    { path: "/daily-quests", name: "Quest Harian", icon: "Q" },
    { path: "/guild-hall", name: "Aula Guild", icon: "G" },
    { path: "/inventory", name: "Gudang", icon: "I" },
    { path: "/notifications", name: "Pesan Guild", icon: "N" },
    { path: "/marketplace", name: "Marketplace", icon: "M" },
  ];

  return (
    <div className="fixed left-0 top-15 h-[calc(100vh-4rem)] w-64 bg-[url('https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center text-white shadow-lg z-10 border-r-2 border-amber-800">
      {/* Overlay untuk gelap background */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-sm"></div>

      {/* Header Sidebar */}
      <div className="relative p-4 border-b border-amber-600 bg-gradient-to-r from-amber-900 to-transparent mt-0">

        <h2 className="text-xl font-bold flex items-center mt-5">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-200">
            Guild petualang Hoshigami
          </span>
        </h2>
        <p className="text-xs mt-1 text-amber-200">Persiapkan ekspedisimu!</p>
      </div>

      {/* Menu Items */}
      <nav className="relative p-4 h-[calc(100%-7rem)] overflow-y-auto">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${location.pathname === item.path
                  ? "bg-gradient-to-r from-amber-700 to-amber-900 shadow-lg transform scale-[1.02] border-l-4 border-amber-400"
                  : "hover:bg-amber-900 hover:bg-opacity-70 hover:border-l-4 hover:border-amber-500"
                  }`}
              >
                {/* Efek cahaya untuk item aktif */}
                {location.pathname === item.path && (
                  <div className="absolute inset-0 bg-amber-400 bg-opacity-10"></div>
                )}

                <span className={`text-2xl mr-3 transition-all duration-300 ${location.pathname === item.path ? "text-yellow-300 animate-bounce" : "text-amber-200 group-hover:text-yellow-200"}`}>
                  {item.icon}
                </span>
                <span className={`font-medium text-left ${location.pathname === item.path ? "text-yellow-100 font-bold" : "text-amber-100 group-hover:text-white"}`}>
                  {item.name}
                </span>

                {location.pathname === item.path ? (
                  <span className="ml-auto w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_2px_rgba(253,230,138,0.7)]"></span>
                ) : (
                  <span className="ml-auto text-xs text-amber-400 group-hover:scale-110 transition-transform">→</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Dekorasi tambahan */}
      <div className="absolute bottom-20 left-2 text-4xl opacity-20">⚔️</div>
      <div className="absolute top-1/3 right-2 text-3xl opacity-30 rotate-45">🏹</div>
    </div>
  );
};

export default SideBarPetualang;

