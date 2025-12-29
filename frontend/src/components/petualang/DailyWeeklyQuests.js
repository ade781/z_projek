import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const DailyWeeklyQuests = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [claimingId, setClaimingId] = useState(null);

  const fetchQuests = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("accessToken");
      const id_petualang = localStorage.getItem("id_petualang");
      if (!token || !id_petualang) {
        setErrorMsg("Silakan login terlebih dahulu.");
        setLoading(false);
        return;
      }
      const res = await axios.get(`${BASE_URL}/quest/active/${id_petualang}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuests(res.data.data || []);
    } catch (error) {
      setErrorMsg("Gagal memuat quest harian/mingguan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const handleClaim = async (id_petualang_quest) => {
    try {
      setClaimingId(id_petualang_quest);
      const token = localStorage.getItem("accessToken");
      const id_petualang = localStorage.getItem("id_petualang");
      await axios.post(
        `${BASE_URL}/quest/claim`,
        { id_petualang, id_petualang_quest },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchQuests();
    } catch (error) {
      setErrorMsg("Gagal klaim quest.");
    } finally {
      setClaimingId(null);
    }
  };

  const dailyQuests = quests.filter((q) => q.quest_template?.type === "daily");
  const weeklyQuests = quests.filter((q) => q.quest_template?.type === "weekly");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-amber-900 flex items-center justify-center">
        <div className="text-center text-amber-200">
          <div className="w-14 h-14 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Memuat papan quest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-amber-900 to-slate-950 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-100">
            Quest Harian & Mingguan
          </h1>
          <p className="text-amber-200 mt-2 italic">
            Jejak kecil hari ini, legenda besar minggu ini.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-100 p-4 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {[{ title: "Harian", data: dailyQuests }, { title: "Mingguan", data: weeklyQuests }].map(
            (section) => (
              <div key={section.title} className="bg-slate-900/70 rounded-2xl border border-amber-700 p-6">
                <h2 className="text-2xl font-semibold text-amber-200 mb-4">
                  Quest {section.title}
                </h2>
                {section.data.length === 0 && (
                  <p className="text-amber-100/70">Belum ada quest tersedia.</p>
                )}
                <div className="space-y-4">
                  {section.data.map((quest) => {
                    const template = quest.quest_template || {};
                    const percent = Math.min(
                      100,
                      Math.round((quest.progress / (template.target_value || 1)) * 100)
                    );
                    return (
                      <div
                        key={quest.id_petualang_quest}
                        className="bg-slate-950/70 border border-amber-800 rounded-xl p-4"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-amber-100">
                              {template.title}
                            </h3>
                            <p className="text-sm text-amber-100/70 mt-1">
                              {template.description}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              quest.status === "claimed"
                                ? "bg-emerald-500/20 text-emerald-200"
                                : quest.status === "completed"
                                  ? "bg-amber-400/20 text-amber-100"
                                  : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {quest.status}
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-amber-200">
                            <span>Progress</span>
                            <span>
                              {quest.progress}/{template.target_value}
                            </span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-200"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm text-amber-100">
                          <span>
                            Hadiah: {template.reward_koin} koin · {template.reward_xp} XP
                          </span>
                          {quest.status === "completed" && (
                            <button
                              onClick={() => handleClaim(quest.id_petualang_quest)}
                              disabled={claimingId === quest.id_petualang_quest}
                              className="px-3 py-1 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition-colors"
                            >
                              {claimingId === quest.id_petualang_quest ? "..." : "Klaim"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyWeeklyQuests;
