import React from "react";
import { Route } from "react-router-dom";
import MisiListOwner from "../owner/MisiListOwner";
import TambahMisi from "../owner/TambahMisi";
import DetailMisiOwner from "../owner/DetailMisiOwner";
import RegisterPetualang from "../owner/RegisterPetualangbyOwner";
import LayoutOwner from "../layouts/LayoutOwner";
import DataPetualang from "../owner/DataPetualangByOwner";
import EditMisi from "../owner/EditMisiOwner";

const OwnerRoutes = () => (
  <Route path="/" element={<LayoutOwner />}>
    <Route path="misi-owner" element={<MisiListOwner />} />
    <Route path="misi-owner/tambah" element={<TambahMisi />} />
    <Route path="detail-misi-owner/:id" element={<DetailMisiOwner />} />
    <Route path="register-petualang" element={<RegisterPetualang />} />
    <Route path="data-petualang" element={<DataPetualang />} />
    <Route path="misi-owner/edit-misi/:id" element={<EditMisi />} />

  </Route>
);

export default OwnerRoutes;
