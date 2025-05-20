import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Kategori sesuai pilihan kamu
        const kategoriList = [
            "Pribadi",
            "Pekerjaan",
            "Keuangan",
            "Pendidikan",
            "Kesehatan",
            "Hiburan",
            "Lainnya"
        ];
        setCategories(kategoriList);
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Navbar onSearch={setSearchTerm} />
            <div style={{ display: "flex", flex: 1 }}>
                <Sidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
                <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
                    <Outlet context={{ searchTerm, selectedCategory }} />
                </div>
            </div>
        </div>
    );
};

export default Layout;
