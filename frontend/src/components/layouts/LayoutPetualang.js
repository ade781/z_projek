import React from "react";
import NavbarPetualang from "./NavbarPetualang";
import SideBarPetualang from "./SideBarPetualang";

const LayoutPetualang = ({ children }) => {
  return (
    <>
      <NavbarPetualang />
      <div style={{ display: "flex" }}>
        <div style={{ width: "250px", minHeight: "100vh", background: "#f4f4f4" }}>
          <SideBarPetualang />
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default LayoutPetualang;
