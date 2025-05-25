import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBarOwner from "./SideBarOwner";

const LayoutOwner = () => {
  const [filterStatus, setFilterStatus] = useState("semua");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "250px", background: "#f0f0f0", padding: "1rem" }}>
        <SideBarOwner setFilterStatus={setFilterStatus} />
      </div>
      <div style={{ flex: 1, padding: "1rem" }}>
        <Outlet context={{ filterStatus }} />
      </div>
    </div>
  );
};

export default LayoutOwner;
