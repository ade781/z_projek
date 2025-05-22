import React from "react";
import { useNavigate } from "react-router-dom";

const SideBarPetualang = () => {
  const navigate = useNavigate();

  return (
    <div className="w-48 h-screen bg-gray-800 text-white p-4 space-y-4">
      <h2 className="text-lg font-bold">Menu Petualang</h2>
      <button
        onClick={() => navigate("/dashboard-misi")}
        className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
      >
        Dashboard Misi
      </button>
    </div>
  );
};

export default SideBarPetualang;
