import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import LoginOwner from "./components/auth/LoginOwner";
import LoginWarga from "./components/warga/LoginWarga";
import RegisterWarga from "./components/warga/RegisterWarga";
import AjukanMisiWarga from "./components/warga/AjukanMisiWarga";
import TopupWarga from "./components/warga/TopupWarga";
import QuestCanvas from "./components/petualang/QuestCanvas";
import PetualangRoutes from "./components/routes/petualangroutes";
import OwnerRoutes from "./components/routes/ownerroutes";
import LayoutPetualang from "./components/layouts/LayoutPetualang";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login-owner" element={<LoginOwner />} />
        <Route path="/login-warga" element={<LoginWarga />} />
        <Route path="/register-warga" element={<RegisterWarga />} />
        <Route path="/ajukan-misi" element={<AjukanMisiWarga />} />
        <Route path="/topup-warga" element={<TopupWarga />} />
        <Route
          path="/quest/:id"
          element={
            <LayoutPetualang>
              <QuestCanvas />
            </LayoutPetualang>
          }
        />
        {PetualangRoutes()}
        {OwnerRoutes()}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
