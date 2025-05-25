import React from "react";
import { Route } from "react-router-dom";
import MisiListOwner from "../owner/MisiListOwner";
import TambahMisi from "../owner/TambahMisi";
import DetailMisiOwner from "../owner/DetailMisiOwner";
import RegisterPetualang from "../RegisterPetualangbyOwner";
import LayoutOwner from "../layouts/LayoutOwner";
import LeaderboardPetualang from "../petualang/LeaderboardPetualang";

const OwnerRoutes = () => (
  <Route path="/" element={<LayoutOwner />}>
    <Route path="misi-owner" element={<MisiListOwner />} />
    <Route path="misi-owner/tambah" element={<TambahMisi />} />
    <Route path="detail-misi-owner/:id" element={<DetailMisiOwner />} />
    <Route path="register-petualang" element={<RegisterPetualang />} />
    <Route path="leaderboard-petualang" element={<LeaderboardPetualang />} />
  </Route>
);

export default OwnerRoutes;
