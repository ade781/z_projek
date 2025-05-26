import React from "react";
import NavbarPetualang from "./NavbarPetualang";
import SideBarPetualang from "./SideBarPetualang";

const LayoutPetualang = ({ children }) => {
  return (
    <>
      <NavbarPetualang />
      <div className="flex">
        {/* Sidebar dengan margin top */}
        <div className="w-[250px] min-h-screen bg-gray-100 mt-20">
          <SideBarPetualang />
        </div>

        {/* Children dengan margin top */}
        <div className="flex-1 p-0 mt-20" >
          {children}
        </div>
      </div>
    </>
  );
};

export default LayoutPetualang;
