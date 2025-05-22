// components/LayoutPetualang.js
import React from "react";
import NavbarPetualang from "./NavbarPetualang";

const LayoutPetualang = ({ children }) => {
    return (
        <>
            <NavbarPetualang />
            <main>{children}</main>
        </>
    );
};

export default LayoutPetualang;
