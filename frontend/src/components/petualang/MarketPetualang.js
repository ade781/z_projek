import React from "react";
import MarketPlace from "../market/MarketPlace";

const MarketPetualang = () => {
  const id_petualang = localStorage.getItem("id_petualang");
  return <MarketPlace role="petualang" userId={id_petualang} />;
};

export default MarketPetualang;
