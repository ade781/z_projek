import React from "react";
import MarketPlace from "../market/MarketPlace";

const MarketWarga = () => {
  const id_warga_desa = localStorage.getItem("id_warga_desa");
  return <MarketPlace role="warga" userId={id_warga_desa} />;
};

export default MarketWarga;
