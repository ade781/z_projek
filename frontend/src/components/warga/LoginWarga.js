import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const LoginWarga = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${BASE_URL}/warga-desa/login`, {
        username,
        password,
      });

      localStorage.setItem("id_warga_desa", res.data.data.id_warga_desa);
      localStorage.setItem("nama_warga", res.data.data.nama);
      navigate("/ajukan-misi");
    } catch (error) {
      setErrorMsg("Username atau password salah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 p-6">
      <div className="w-full max-w-md bg-black/70 p-8 rounded-xl border border-emerald-500/40 shadow-xl">
        <h2 className="text-3xl font-bold text-emerald-300 text-center mb-2">
          Gerbang Warga Desa
        </h2>
        <p className="text-center text-emerald-100/70 mb-6 italic">
          Masuk untuk mengajukan misi ke guild
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-emerald-200 mb-2 text-sm uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-emerald-500 text-white outline-none"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-emerald-200 mb-2 text-sm uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-emerald-500 text-white outline-none"
              placeholder="Masukkan password"
            />
          </div>

          {errorMsg && (
            <div className="text-red-400 text-center bg-red-900/40 p-2 rounded">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              isSubmitting
                ? "bg-emerald-900 text-emerald-200"
                : "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white hover:from-emerald-400 hover:to-emerald-600"
            }`}
          >
            {isSubmitting ? "Memeriksa..." : "Masuk Warga"}
          </button>
        </form>

        <div className="mt-6 text-center text-emerald-100/70">
          Belum punya akun?{" "}
          <button
            onClick={() => navigate("/register-warga")}
            className="text-emerald-300 font-semibold hover:underline"
          >
            Daftar di sini
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginWarga;
