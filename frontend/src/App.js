import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import LoginOwner from "./components/auth/LoginOwner";
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
