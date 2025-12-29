import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const RegisterWarga = () => {
  const [form, setForm] = useState({ nama: "", username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      await axios.post(`${BASE_URL}/warga-desa/register`, form);
      setSuccessMsg("Registrasi berhasil. Silakan login.");
      setTimeout(() => navigate("/login-warga"), 1200);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registrasi gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 p-6">
      <div className="w-full max-w-md bg-black/70 p-8 rounded-xl border border-emerald-500/40 shadow-xl">
        <h2 className="text-3xl font-bold text-emerald-300 text-center mb-2">
          Daftar Warga Desa
        </h2>
        <p className="text-center text-emerald-100/70 mb-6 italic">
          Buat akun untuk mengajukan misi ke guild
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-emerald-200 mb-2 text-sm uppercase tracking-wider">
              Nama
            </label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-emerald-500 text-white outline-none"
              placeholder="Nama lengkap"
            />
          </div>

          <div>
            <label className="block text-emerald-200 mb-2 text-sm uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-emerald-500 text-white outline-none"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="block text-emerald-200 mb-2 text-sm uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800/70 border-b-2 border-emerald-500 text-white outline-none"
              placeholder="Password"
            />
          </div>

          {errorMsg && (
            <div className="text-red-400 text-center bg-red-900/40 p-2 rounded">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="text-emerald-300 text-center bg-emerald-900/40 p-2 rounded">
              {successMsg}
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
            {isSubmitting ? "Mendaftarkan..." : "Daftar Warga"}
          </button>
        </form>

        <div className="mt-6 text-center text-emerald-100/70">
          Sudah punya akun?{" "}
          <button
            onClick={() => navigate("/login-warga")}
            className="text-emerald-300 font-semibold hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterWarga;
