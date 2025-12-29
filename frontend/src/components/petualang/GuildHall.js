import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const GuildHall = () => {
  const [guilds, setGuilds] = useState([]);
  const [myGuild, setMyGuild] = useState(null);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", motto: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");
  const id_petualang = localStorage.getItem("id_petualang");

  const fetchGuilds = async () => {
    const res = await axios.get(`${BASE_URL}/guild`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGuilds(res.data.data || []);
  };

  const fetchMyGuild = async () => {
    const res = await axios.get(`${BASE_URL}/guild/petualang/${id_petualang}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMyGuild(res.data.data || null);
  };

  const fetchMembers = async (id_guild) => {
    const res = await axios.get(`${BASE_URL}/guild/${id_guild}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMembers(res.data.data || []);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        if (!token || !id_petualang) {
          setErrorMsg("Silakan login terlebih dahulu.");
          return;
        }
        await Promise.all([fetchGuilds(), fetchMyGuild()]);
      } catch (error) {
        setErrorMsg("Gagal memuat guild.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (myGuild?.guild?.id_guild) {
      fetchMembers(myGuild.guild.id_guild);
    }
  }, [myGuild?.guild?.id_guild]);

  const handleCreateGuild = async () => {
    try {
      setErrorMsg("");
      await axios.post(
        `${BASE_URL}/guild`,
        { ...form, id_petualang },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ name: "", motto: "" });
      await Promise.all([fetchGuilds(), fetchMyGuild()]);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal membuat guild.");
    }
  };

  const handleJoin = async (id_guild) => {
    try {
      await axios.post(
        `${BASE_URL}/guild/${id_guild}/join`,
        { id_petualang },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Promise.all([fetchGuilds(), fetchMyGuild()]);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal bergabung guild.");
    }
  };

  const handleLeave = async () => {
    if (!myGuild?.guild?.id_guild) return;
    try {
      await axios.post(
        `${BASE_URL}/guild/${myGuild.guild.id_guild}/leave`,
        { id_petualang },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers([]);
      await Promise.all([fetchGuilds(), fetchMyGuild()]);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal keluar guild.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-amber-900 flex items-center justify-center">
        <div className="text-amber-200">
          <div className="w-14 h-14 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Menyiapkan Aula Guild...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-900 to-slate-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-amber-200">Aula Guild</h1>
          <p className="text-amber-100/80 italic mt-2">
            Bangun aliansi, berkumpul, dan taklukkan misi besar bersama.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-100 p-4 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/70 border border-amber-700 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-amber-200 mb-4">Daftar Guild</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {guilds.map((guild) => (
                  <div
                    key={guild.id_guild}
                    className="bg-slate-950/70 border border-amber-800 rounded-xl p-4"
                  >
                    <h3 className="text-lg font-semibold text-amber-100">{guild.name}</h3>
                    <p className="text-sm text-amber-100/70 mt-1">{guild.motto || "Tidak ada motto"}</p>
                    <div className="mt-3 flex justify-between items-center text-xs text-amber-200">
                      <span>Leader ID: {guild.leader_id}</span>
                      <button
                        onClick={() => handleJoin(guild.id_guild)}
                        disabled={Boolean(myGuild)}
                        className="px-3 py-1 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 disabled:opacity-50"
                      >
                        Gabung
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {guilds.length === 0 && (
                <p className="text-amber-100/70">Belum ada guild tersedia.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900/70 border border-amber-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-amber-200 mb-3">Guild Saya</h2>
              {myGuild?.guild ? (
                <>
                  <p className="text-lg text-amber-100 font-semibold">{myGuild.guild.name}</p>
                  <p className="text-sm text-amber-100/70 mt-1">{myGuild.guild.motto}</p>
                  <button
                    onClick={handleLeave}
                    className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500"
                  >
                    Keluar Guild
                  </button>
                  <div className="mt-4">
                    <h3 className="text-sm uppercase text-amber-300">Anggota</h3>
                    <ul className="mt-2 space-y-2">
                      {members.map((member) => (
                        <li
                          key={member.id_guild_member}
                          className="text-sm text-amber-100/80 flex justify-between"
                        >
                          <span>{member.petualang?.username || "Petualang"}</span>
                          <span className="text-amber-300">{member.role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-amber-100/70">Kamu belum bergabung dengan guild.</p>
              )}
            </div>

            <div className="bg-slate-900/70 border border-amber-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-amber-200 mb-3">Buat Guild Baru</h2>
              <input
                type="text"
                placeholder="Nama Guild"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-950/80 border border-amber-800 text-amber-100"
              />
              <input
                type="text"
                placeholder="Motto"
                value={form.motto}
                onChange={(e) => setForm({ ...form, motto: e.target.value })}
                className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-950/80 border border-amber-800 text-amber-100"
              />
              <button
                onClick={handleCreateGuild}
                className="w-full py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400"
              >
                Bentuk Guild
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuildHall;
