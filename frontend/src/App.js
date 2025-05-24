import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import LoginOwner from "./components/auth/LoginOwner";
import PetualangRoutes from "./components/routes/petualangroutes";
import OwnerRoutes from "./components/routes/ownerroutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login-owner" element={<LoginOwner />} />
        {PetualangRoutes()}
        {OwnerRoutes()}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
