import React from "react";
import { useNavigate } from "react-router-dom";

const SideBarPetualang = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Menu Petualang</h2>
      <button onClick={() => navigate("/misi")} style={{ marginTop: "10px", display: "block" }}>
        misi
      </button>
      <button onClick={() => navigate("/dashboard-misi-petualang")} style={{ marginTop: "10px" }}>
        Dashboard Misi
      </button>
      <button onClick={() => navigate("/leaderboard-petualang")} style={{ marginTop: "10px" }}>
        Leaderboard Petualang
      </button>
    </div>
  );
};

export default SideBarPetualang;
