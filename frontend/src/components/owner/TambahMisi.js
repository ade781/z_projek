import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const TambahMisi = () => {
  const [form, setForm] = useState({
    judul_misi: "",
    deskripsi: "",
    hadiah_koin: 0,
    hadiah_xp: 0,
    level_required: 1,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      ["hadiah_koin", "hadiah_xp", "level_required"].includes(name)
        ? parseInt(value) || 0
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const validateForm = () => {
    if (!form.judul_misi.trim()) {
      setErrorMsg("Judul misi tidak boleh kosong");
      return false;
    }
    if (form.judul_misi.length > 100) {
      setErrorMsg("Judul misi maksimal 100 karakter");
      return false;
    }
    if (form.deskripsi.length > 500) {
      setErrorMsg("Deskripsi maksimal 500 karakter");
      return false;
    }
    if (form.hadiah_koin < 0 || form.hadiah_koin > 10000) {
      setErrorMsg("Hadiah koin harus antara 0-10.000");
      return false;
    }
    if (form.hadiah_xp < 0 || form.hadiah_xp > 1000) {
      setErrorMsg("Hadiah XP harus antara 0-1.000");
      return false;
    }
    if (form.level_required < 1 || form.level_required > 12) {
      setErrorMsg("Level required harus antara 1-12");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!validateForm()) return;

    const token = localStorage.getItem("accessToken");
    const id_owner = localStorage.getItem("id_owner");

    if (!token || !id_owner) {
      setErrorMsg("Anda harus login sebagai owner terlebih dahulu");
      return;
    }

    setIsSubmitting(true);

    try {
      const misiData = {
        ...form,
        id_pembuat: parseInt(id_owner),
        status_misi: "belum diambil",
      };

      await axios.post(`${BASE_URL}/misi`, misiData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMsg("Misi berhasil ditambahkan!");
      setTimeout(() => {
        navigate("/misi-owner");
      }, 1500);
    } catch (error) {
      console.error("Gagal menambahkan misi:", error.response?.data || error.message);
      setErrorMsg(error.response?.data?.message || "Gagal menambahkan misi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      judul_misi: "",
      deskripsi: "",
      hadiah_koin: 0,
      hadiah_xp: 0,
      level_required: 1,
    });
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Tambah Misi Baru</h1>
          <p className="text-blue-600">
            Buat misi menarik untuk petualang dengan mengisi form berikut
          </p>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 animate-fade-in">
            <p>{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 animate-fade-in">
            <p>{successMsg}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setShowPreview(false)}
              className={`px-6 py-3 font-medium ${!showPreview ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            >
              Form Misi
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className={`px-6 py-3 font-medium ${showPreview ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
            >
              Preview
            </button>
          </div>

          {!showPreview ? (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Judul Misi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Misi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="judul_misi"
                    value={form.judul_misi}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan judul misi"
                    maxLength={100}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {form.judul_misi.length}/100 karakter
                  </p>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Misi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deskripsikan misi secara detail"
                    maxLength={500}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {form.deskripsi.length}/500 karakter
                  </p>
                </div>

                {/* Reward Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hadiah Koin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hadiah Koin
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">🪙</span>
                      </div>
                      <input
                        type="number"
                        name="hadiah_koin"
                        value={form.hadiah_koin}
                        onChange={handleChange}
                        min="0"
                        max="10000"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Hadiah XP */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hadiah XP
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">⭐</span>
                      </div>
                      <input
                        type="number"
                        name="hadiah_xp"
                        value={form.hadiah_xp}
                        onChange={handleChange}
                        min="0"
                        max="1000"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Level Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level Required
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      name="level_required"
                      value={form.level_required}
                      onChange={handleChange}
                      min="1"
                      max="12"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="w-10 text-center font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded">
                      {form.level_required}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Level 1</span>
                    <span>Level 12</span>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex flex-wrap gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="px-6 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  Simpan Misi
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              {/* Preview Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">
                  {form.judul_misi || "Preview Judul Misi"}
                </h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Deskripsi Misi</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {form.deskripsi || "Deskripsi misi akan muncul di sini"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Hadiah Koin</p>
                    <p className="text-xl font-bold text-blue-600">
                      {form.hadiah_koin} 🪙
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Hadiah XP</p>
                    <p className="text-xl font-bold text-blue-600">
                      {form.hadiah_xp} ⭐
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Level Required</p>
                    <p className="text-xl font-bold text-blue-600">
                      Level {form.level_required}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Kembali ke Form
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/misi-owner")}
          className="mt-6 px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Kembali ke Daftar Misi</span>
        </button>
      </div>
    </div>
  );
};

export default TambahMisi;