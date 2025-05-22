import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import LoginOwner from "./components/LoginOwner";
import LayoutPetualang from "./components/LayoutPetualang";
import MisiList from "./components/MisiList";
import MisiListOwner from "./components/MisiListOwner";
import TambahMisi from "./components/TambahMisi";
import DashboardPetualang from "./components/DashboardPetualang";
import EditPetualang from "./components/EditPetualang";
import DetailMisi from "./components/DetailMisi";
import DetailMisiOwner from "./components/DetailMisiOwner";
import DashboardMisiPetualang from "./components/DashboardMisiPetualang";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Petualang */}
        <Route path="/" element={<Login />} />

        {/* Login Owner */}
        <Route path="/login-owner" element={<LoginOwner />} />

        {/* Petualang Routes */}
        <Route
          path="/misi"
          element={
            <LayoutPetualang>
              <MisiList />
            </LayoutPetualang>
          }
        />
        <Route
          path="/detail-misi/:id"
          element={
            <LayoutPetualang>
              <DetailMisi />
            </LayoutPetualang>
          }
        />
        <Route
          path="/dashboard-petualang"
          element={
            <LayoutPetualang>
              <DashboardPetualang />
            </LayoutPetualang>
          }
        />
        <Route
          path="/edit-petualang/:id"
          element={
            <LayoutPetualang>
              <EditPetualang />
            </LayoutPetualang>
          }
        />
        <Route
          path="/dashboard-misi-petualang"
          element={
            <LayoutPetualang>
              <DashboardMisiPetualang />
            </LayoutPetualang>
          }
        />

        {/* Owner Routes tanpa layout */}
        <Route path="/misi-owner" element={<MisiListOwner />} />
        <Route path="/misi-owner/tambah" element={<TambahMisi />} />
        <Route path="/detail-misi-owner/:id" element={<DetailMisiOwner />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
