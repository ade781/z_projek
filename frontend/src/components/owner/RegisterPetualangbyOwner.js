import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

const RegisterPetualang = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        role: "swordsman",
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const roles = [
        { value: "swordsman", label: "Swordsman", emoji: "⚔️" },
        { value: "mage", label: "Mage", emoji: "🔮" },
        { value: "archer", label: "Archer", emoji: "🏹" },
        { value: "healer", label: "Healer", emoji: "💉" },
        { value: "thief", label: "Thief", emoji: "🗡️" },
        { value: "monk", label: "Monk", emoji: "🧘" },
        { value: "necromancer", label: "Necromancer", emoji: "☠️" },
        { value: "summoner", label: "Summoner", emoji: "👾" },
        { value: "berserker", label: "Berserker", emoji: "🤬" },
        { value: "paladin", label: "Paladin", emoji: "🛡️" },
        { value: "alchemist", label: "Alchemist", emoji: "🧪" },
        { value: "beast_tamer", label: "Beast Tamer", emoji: "🐾" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (form.username.length < 3) {
            setErrorMsg("Username minimal 3 karakter");
            return false;
        }
        if (form.username.length > 20) {
            setErrorMsg("Username maksimal 20 karakter");
            return false;
        }
        if (form.password.length < 6) {
            setErrorMsg("Password minimal 6 karakter");
            return false;
        }
        if (form.password.length > 30) {
            setErrorMsg("Password maksimal 30 karakter");
            return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const res = await axios.post(`${BASE_URL}/petualang/add-petualang`, {
                username: form.username,
                password: form.password,
                role: form.role,
                level: 1,
                koin: 0,
                jumlah_misi_selesai: 0,
                poin_pengalaman: 0,
            });

            if (res.data.status === "Success") {
                setSuccessMsg("Pahlawan baru berhasil didaftarkan!");
                setForm({
                    username: "",
                    password: "",
                    role: "swordsman",
                });
                setTimeout(() => {
                    navigate("/register-petualang");
                }, 2000);
            } else {
                setErrorMsg("Gagal register, coba lagi.");
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || "Gagal register, coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRoleDetails = (roleValue) => {
        return roles.find((r) => r.value === roleValue) || roles[0];
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-800 mb-2">Daftarkan Petualang Baru</h1>
                    <p className="text-blue-600">
                        Tambahkan pahlawan baru ke dalam guild Anda
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

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={handleRegister} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Masukkan username"
                                    minLength={3}
                                    maxLength={20}
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    {form.username.length}/20 karakter
                                </p>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                                        placeholder="Masukkan password"
                                        minLength={6}
                                        maxLength={30}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    {form.password.length}/30 karakter
                                </p>
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Class <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                                    {roles.map((r) => (
                                        <div
                                            key={r.value}
                                            onClick={() => setForm({ ...form, role: r.value })}
                                            className={`p-3 border rounded-md cursor-pointer transition-all ${form.role === r.value
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-300 hover:border-blue-300"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xl">{r.emoji}</span>
                                                <span className="text-sm">{r.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Role Preview */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h3 className="text-sm font-medium text-blue-800 mb-2">
                                    Class Terpilih
                                </h3>
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl">
                                        {getRoleDetails(form.role).emoji}
                                    </span>
                                    <div>
                                        <p className="font-bold text-blue-900">
                                            {getRoleDetails(form.role).label}
                                        </p>
                                        <p className="text-xs text-blue-700">
                                            Level 1 | 0 XP | 0 Koin
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors flex items-center justify-center"
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
                                Daftarkan Petualang Baru
                            </button>
                        </form>
                    </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate("/misi-owner")}
                    className="mt-6 px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 mx-auto"
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
                    <span>Kembali</span>
                </button>
            </div>
        </div>
    );
};

export default RegisterPetualang;