import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
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
        const [achRes, recRes] = await Promise.all([
          axios.get(`${BASE_URL}/achievement`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/achievement/${id_petualang}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setAchievements(achRes.data.data || []);
        setRecords(recRes.data.data || []);
      } catch (error) {
        setErrorMsg("Gagal memuat badge dan achievement.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recordMap = useMemo(() => {
    const map = new Map();
    records.forEach((record) => {
      const id = record.id_achievement || record.achievement?.id_achievement;
      if (id) {
        map.set(id, record);
      }
    });
    return map;
  }, [records]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-700 to-slate-950 flex items-center justify-center">
        <div className="text-center text-amber-200">
          <div className="w-14 h-14 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Mengukir lencana...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-700 to-slate-950 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-400/40 text-red-100 p-6 rounded-xl">
          {errorMsg}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-slate-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-100">
            Hall of Badges
          </h1>
          <p className="text-amber-200 mt-2 italic">
            Setiap lencana adalah kisah keberanian.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => {
            const record = recordMap.get(achievement.id_achievement);
            const progress = record?.progress || 0;
            const target = achievement.target || 1;
            const percent = Math.min(100, Math.round((progress / target) * 100));
            const completed = record?.is_completed;

            return (
              <div
                key={achievement.id_achievement}
                className={`relative p-5 rounded-2xl border shadow-lg transition-all ${
                  completed
                    ? "bg-gradient-to-br from-amber-600/60 to-yellow-900/70 border-amber-300"
                    : "bg-slate-900/70 border-amber-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-amber-100">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-amber-200/80 mt-2">
                      {achievement.description}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      completed
                        ? "bg-amber-400 text-amber-950"
                        : "bg-slate-800 text-amber-200"
                    }`}
                  >
                    {completed ? "★" : "✧"}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs text-amber-200">
                    <span>Progress</span>
                    <span>
                      {progress}/{target}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-200"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-5 flex justify-between text-sm text-amber-100">
                  <span>Hadiah</span>
                  <span>
                    {achievement.reward_koin} koin · {achievement.reward_xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {achievements.length === 0 && (
          <div className="text-center text-amber-200 mt-10">
            Belum ada achievement tersedia.
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
