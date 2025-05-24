import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";

const LoginOwner = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post(`${BASE_URL}/owner/login`, {
        username,
        password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("id_owner", res.data.owner.id_owner);
      localStorage.setItem("nama_owner", res.data.owner.nama_owner);

      navigate("/misi-owner");
    } catch (err) {
      setErrorMsg("Username atau Password Owner salah");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-black overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Background animated orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute w-72 h-72 bg-purple-700 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000 left-20 top-10"></div>
        <div className="absolute w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-blob animation-delay-4000 left-1/2 top-1/3"></div>
        <div className="absolute w-64 h-64 bg-pink-700 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-6000 right-20 bottom-20"></div>
      </div>

      {/* Container Box */}
      <div className="relative z-10 max-w-md w-full bg-gradient-to-tr from-gray-900/70 via-gray-800/40 to-gray-900/70 border border-purple-700 rounded-3xl shadow-2xl backdrop-blur-md p-12 overflow-hidden">
        {/* Rune circles decoration */}
        <svg
          className="absolute top-4 left-4 w-20 h-20 opacity-10 animate-spin-slow"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="url(#grad1)"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="url(#grad2)"
            strokeWidth="1.5"
            strokeDasharray="8 4"
          />
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9F7AEA" />
              <stop offset="100%" stopColor="#6B46C1" />
            </linearGradient>
            <linearGradient id="grad2" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#D53F8C" />
              <stop offset="100%" stopColor="#805AD5" />
            </linearGradient>
          </defs>
        </svg>

        <h2 className="text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 tracking-wide mb-12 drop-shadow-lg select-none">
          Guild Owner Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-purple-300 font-semibold tracking-wide"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Masukkan username..."
              className="w-full px-5 py-3 rounded-lg bg-gray-900 text-purple-200 placeholder-purple-600 border-2 border-purple-700 
                focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-600/30 
                transition duration-300 shadow-lg shadow-purple-900/40 
                animate-magic-scan"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-purple-300 font-semibold tracking-wide"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Masukkan password rahasia..."
              className="w-full px-5 py-3 rounded-lg bg-gray-900 text-purple-200 placeholder-purple-600 border-2 border-purple-700 
                focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-600/30 
                transition duration-300 shadow-lg shadow-purple-900/40 
                animate-magic-scan"
            />
          </div>

          {errorMsg && (
            <p className="text-red-500 font-semibold text-center animate-pulse select-none">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-700 rounded-xl text-white font-extrabold tracking-wide 
              shadow-[0_0_15px_4px_rgba(168,85,247,0.8)] 
              hover:shadow-[0_0_25px_10px_rgba(212,70,222,0.9)] 
              transition-shadow duration-700 ease-in-out
              active:scale-95 active:shadow-none
              select-none"
          >
            Masuk ke Guild 🔮
          </button>
        </form>

        <p className="mt-10 text-center text-purple-400 font-medium tracking-wide select-none">
          Kembali ke{" "}
          <button
            onClick={() => navigate("/")}
            className="text-indigo-400 underline hover:text-indigo-300 transition-colors duration-300"
          >
            Login Petualang
          </button>
        </p>

        {/* Aura rings */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute rounded-full border border-pink-500/40 w-72 h-72 top-10 left-1/2 -translate-x-1/2 animate-pulse-slow opacity-60 blur-sm"></div>
          <div className="absolute rounded-full border border-purple-400/30 w-96 h-96 bottom-10 right-10 animate-pulse-slower opacity-50 blur-lg"></div>
        </div>
      </div>

      {/* Tailwind Animations (injected here with <style> for demo) */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 30px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg);}
          to { transform: rotate(360deg);}
        }
        .animate-spin-slow {
          animation: spin-slow 40s linear infinite;
        }
        @keyframes magic-scan {
          0% { box-shadow: 0 0 0 0 rgba(255, 192, 203, 0.4); }
          50% { box-shadow: 0 0 20px 6px rgba(255, 105, 180, 0.7); }
          100% { box-shadow: 0 0 0 0 rgba(255, 192, 203, 0.4); }
        }
        .animate-magic-scan {
          animation: magic-scan 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% {opacity: 0.6;}
          50% {opacity: 1;}
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s infinite;
        }
        @keyframes pulse-slower {
          0%, 100% {opacity: 0.5;}
          50% {opacity: 0.9;}
        }
        .animate-pulse-slower {
          animation: pulse-slower 7s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginOwner;
