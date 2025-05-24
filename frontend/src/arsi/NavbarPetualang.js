import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils";

const NavbarPetualang = () => {
  const navigate = useNavigate();
  const [petualang, setPetualang] = useState({
    username: "",
    role: "",
    level: 0,
    koin: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      const id_petualang = localStorage.getItem("id_petualang");
      if (!token || !id_petualang) return;

      try {
        const res = await axios.get(`${BASE_URL}/petualang/${id_petualang}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data.data || res.data;

        setPetualang({
          username: userData.username || "",
          role: userData.role || "",
          level: userData.level || 0,
          koin: userData.koin || 0,
        });
      } catch (error) {
        console.error("Error fetching petualang data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("id_petualang");
    navigate("/");
  };

  return (
    <>
      {/* Import Google Font 'Cinzel' via style */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');

          .glow-text {
            font-family: 'Cinzel', serif;
            color: #fff8dc;
            text-shadow:
              0 0 5px #ffd700,
              0 0 10px #ffd700,
              0 0 20px #ff8c00,
              0 0 30px #ff8c00,
              0 0 40px #ff4500;
            animation: pulseGlow 2.5s infinite alternate;
          }

          @keyframes pulseGlow {
            0% { text-shadow:
              0 0 5px #ffd700,
              0 0 10px #ffd700,
              0 0 20px #ff8c00,
              0 0 30px #ff8c00,
              0 0 40px #ff4500; }
            100% { text-shadow:
              0 0 15px #ffd700,
              0 0 30px #ffd700,
              0 0 40px #ff8c00,
              0 0 50px #ff8c00,
              0 0 60px #ff4500; }
          }

          .btn-epic {
            position: relative;
            font-family: 'Cinzel', serif;
            background: linear-gradient(45deg, #c97f00, #ffb800);
            color: #3b1700;
            font-weight: 700;
            padding: 0.5rem 1.25rem;
            border-radius: 12px;
            border: 3px solid #7a4b00;
            box-shadow:
              0 0 8px #ffd700,
              inset 0 0 10px #ffb800;
            cursor: pointer;
            transition: all 0.3s ease;
            overflow: hidden;
            user-select: none;
            margin-left: 1rem;
          }

          .btn-epic:hover {
            background: linear-gradient(45deg, #ffb800, #c97f00);
            box-shadow:
              0 0 15px #ffd700,
              inset 0 0 15px #ffdb4d,
              0 0 15px #ff7f00;
            transform: scale(1.1);
            color: #fff8dc;
          }

          .btn-epic:active {
            transform: scale(0.95);
            box-shadow: none;
          }

          .btn-icon {
            margin-right: 0.5rem;
            vertical-align: middle;
            filter: drop-shadow(0 0 1px #663300);
            transition: transform 0.2s ease;
          }

          .btn-epic:hover .btn-icon {
            transform: translateX(3px) rotate(10deg);
          }

          nav.epic-navbar {
            background: #3b1700;
            background-image:
              radial-gradient(circle at 20% 20%, #7a4b00 2px, transparent 10px),
              radial-gradient(circle at 80% 80%, #7a4b00 2px, transparent 10px);
            background-size: 60px 60px;
            background-repeat: repeat;
            padding: 1rem 2rem;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 8px #2f1100;
            border-radius: 10px;
            user-select: none;
          }

          .info-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: center;
            color: #ffdb4d;
            font-weight: 600;
            text-shadow: 0 0 3px #7a4b00;
          }

          .badge-glow {
            background: linear-gradient(135deg, #ffda56, #c97f00);
            padding: 0.3rem 0.8rem;
            border-radius: 9999px;
            color: #3b1700;
            font-weight: 700;
            box-shadow:
              0 0 5px #ffb800,
              inset 0 0 10px #c97f00;
            animation: pulseGlow 3s ease-in-out infinite alternate;
            user-select: none;
          }
        `}
      </style>

      <nav className="epic-navbar" role="navigation" aria-label="Navbar Petualang">
        <div className="info-group" aria-live="polite">
          <span className="glow-text" aria-label="Username petualang">
            🛡️ {petualang.username || "Tamu"}
          </span>
          <span className="badge-glow" aria-label="Role petualang">
            🎭 {petualang.role || "-"}
          </span>
          <span className="badge-glow" aria-label="Level petualang">
            ⚔️ Level {petualang.level}
          </span>
          <span className="badge-glow" aria-label="Koin petualang">
            🪙 {petualang.koin}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="btn-epic"
            onClick={() => navigate("/dashboard-petualang")}
            title="Dashboard Petualang"
            aria-label="Dashboard Petualang"
          >
            🏰 Dashboard
          </button>

          <button
            className="btn-epic"
            onClick={() => navigate("/dashboard-misi-petualang")}
            title="Dashboard Misi Petualang"
            aria-label="Dashboard Misi Petualang"
          >
            📜 Misi
          </button>

          <button
            className="btn-epic"
            onClick={() => navigate("/misi")}
            title="Kembali ke Misi"
            aria-label="Kembali ke halaman Misi"
          >
            <span className="btn-icon" aria-hidden="true">⬅️</span> Kembali ke Misi
          </button>

          <button
            className="btn-epic"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            style={{ background: "#a02f2f", borderColor: "#6b1c1c", boxShadow: "0 0 8px #a02f2f, inset 0 0 10px #6b1c1c" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#d14040")}
            onMouseLeave={e => (e.currentTarget.style.background = "#a02f2f")}
          >
            🚪 Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default NavbarPetualang;
