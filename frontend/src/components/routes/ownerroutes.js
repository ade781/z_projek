import React from "react";
import { Route } from "react-router-dom";
import MisiListOwner from "../owner/MisiListOwner";
import TambahMisi from "../owner/TambahMisi";
import DetailMisiOwner from "../owner/DetailMisiOwner";

const OwnerRoutes = () => (
  <>
    <Route path="/misi-owner" element={<MisiListOwner />} />
    <Route path="/misi-owner/tambah" element={<TambahMisi />} />
    <Route path="/detail-misi-owner/:id" element={<DetailMisiOwner />} />
  </>
);

export default OwnerRoutes;
