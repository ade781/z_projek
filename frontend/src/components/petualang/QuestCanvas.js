import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../utils";

const ROLE_ACCENTS = {
  healer: { accent: "#22c55e", soft: "rgba(34, 197, 94, 0.2)" },
  warrior: { accent: "#ef4444", soft: "rgba(239, 68, 68, 0.2)" },
  mage: { accent: "#3b82f6", soft: "rgba(59, 130, 246, 0.2)" },
  rogue: { accent: "#f59e0b", soft: "rgba(245, 158, 11, 0.2)" },
  default: { accent: "#14b8a6", soft: "rgba(20, 184, 166, 0.2)" },
};

const STAGE_MAX = 5;

const QuestCanvas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [petualang, setPetualang] = useState(null);
  const [stageData, setStageData] = useState(null);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStageLoading, setIsStageLoading] = useState(false);
  const [hasChosen, setHasChosen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const initialStageLoadedRef = useRef(false);
  const stageRequestInFlightRef = useRef(false);

  const accent = useMemo(() => {
    const roleKey = petualang?.role || "default";
    return ROLE_ACCENTS[roleKey] || ROLE_ACCENTS.default;
  }, [petualang]);

  const idPetualang = localStorage.getItem("id_petualang");

  const loadMission = async (token) => {
    const res = await axios.get(`${BASE_URL}/misi/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMission(res.data.data || res.data);
  };

  const loadPetualang = async (token) => {
    if (!idPetualang) return;
    const res = await axios.get(`${BASE_URL}/petualang/${idPetualang}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPetualang(res.data.data || res.data);
  };

  const loadStage = async (choice) => {
    if (stageRequestInFlightRef.current) {
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token || !idPetualang) {
      setErrorMsg("Silakan login terlebih dahulu.");
      return;
    }
    const missionId = Number(id);
    const petualangIdNum = Number(idPetualang);
    if (
      !Number.isFinite(missionId) ||
      missionId <= 0 ||
      !Number.isFinite(petualangIdNum) ||
      petualangIdNum <= 0
    ) {
      setErrorMsg("Data petualang atau misi tidak valid. Silakan login ulang.");
      return;
    }

    stageRequestInFlightRef.current = true;
    setIsStageLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        id_misi: missionId,
        id_petualang: petualangIdNum,
      };
      if (choice) {
        payload.pilihan = choice;
      }

      const res = await axios.post(
        `${BASE_URL}/logactivity/play-mission/next`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      setStageData(data);
      setHasChosen(Boolean(data.status && data.status !== "ongoing"));
      setSelectedOption(null);
    } catch (error) {
      const statusCode = error.response?.status;
      const data = error.response?.data;
      if (statusCode === 409 && data?.summary_ai) {
        setStageData({
          stage: STAGE_MAX,
          narasi: "Petualangan sudah selesai.",
          opsi: [],
          status: "completed",
          summary_ai: data.summary_ai,
          status_approval: data.status_approval || "pending",
        });
        setHasChosen(true);
        setSelectedOption(null);
        setErrorMsg("");
      } else if (statusCode === 401 || statusCode === 403) {
        setErrorMsg("Sesi login berakhir. Silakan login ulang.");
      } else {
        let fallbackMessage = null;
        if (typeof data === "string") {
          fallbackMessage = data;
        } else if (data?.message) {
          fallbackMessage = data.message;
        } else {
          try {
            fallbackMessage = data ? JSON.stringify(data) : null;
          } catch (stringifyError) {
            fallbackMessage = null;
          }
        }
        setErrorMsg(fallbackMessage || "Gagal memuat stage berikutnya.");
      }
    } finally {
      setIsStageLoading(false);
      stageRequestInFlightRef.current = false;
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      setErrorMsg("");
      setStageData(null);
      setDisplayText("");
      setHasChosen(false);
      setSelectedOption(null);
      initialStageLoadedRef.current = false;
      stageRequestInFlightRef.current = false;
      const token = localStorage.getItem("accessToken");
      if (!token || !idPetualang) {
        setErrorMsg("Silakan login terlebih dahulu.");
        setIsLoading(false);
        return;
      }
      try {
        await Promise.all([loadMission(token), loadPetualang(token)]);
      } catch (error) {
        setErrorMsg("Gagal memuat data misi.");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [id]);

  useEffect(() => {
    if (mission && petualang && !initialStageLoadedRef.current) {
      initialStageLoadedRef.current = true;
      loadStage();
    }
  }, [mission, petualang]);

  useEffect(() => {
    if (!stageData?.narasi) return;
    const words = stageData.narasi.split(" ");
    let index = 0;
    setDisplayText("");
    setIsTyping(true);
    const interval = setInterval(() => {
      index += 1;
      setDisplayText(words.slice(0, index).join(" "));
      if (index >= words.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [stageData?.narasi]);

  const handleOptionClick = async (option) => {
    if (
      hasChosen ||
      isStageLoading ||
      isTyping ||
      stageData?.status !== "ongoing" ||
      stageNumber >= STAGE_MAX
    ) {
      return;
    }
    setSelectedOption(option);
    setHasChosen(true);
    await loadStage(option);
  };

  const stageNumber = stageData?.stage || 1;
  const progress = Math.min(
    Math.round((stageNumber / STAGE_MAX) * 100),
    100
  );
  const options = stageData?.opsi || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-slate-600 border-t-transparent animate-spin"></div>
          <p className="text-sm text-slate-300">Memuat Quest Canvas...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-lg bg-slate-900 border border-slate-700 p-6 rounded-xl text-center">
          <p className="text-lg font-semibold mb-2">Quest terhenti</p>
          <p className="text-sm text-slate-300">{errorMsg}</p>
          <button
            onClick={() => navigate("/misi")}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            Kembali ke daftar misi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 text-white relative overflow-hidden"
      style={{ "--accent": accent.accent, "--accent-soft": accent.soft }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.7),_rgba(2,6,23,0.95))]" />
      <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full blur-3xl opacity-50 bg-[var(--accent-soft)]" />
      <div className="relative max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate("/misi")}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <span className="text-lg">&lt;-</span>
            Kembali ke misi
          </button>
          <div className="text-sm text-slate-300">
            Stage {stageNumber}/{STAGE_MAX}
          </div>
        </div>

        <div className="mt-4 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: accent.accent }}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold" style={{ color: "var(--accent)" }}>
                  {mission?.judul_misi}
                </h1>
                <p className="mt-2 text-sm text-slate-400 whitespace-pre-line">
                  {mission?.deskripsi}
                </p>
              </div>
              <div className="text-xs uppercase tracking-widest text-slate-300">
                Level {mission?.level_required}+
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-slate-400">
                <span>Narasi</span>
                <span className="text-[var(--accent)]">{stageData?.status || "ongoing"}</span>
              </div>
              <div className="mt-4 text-lg leading-relaxed text-slate-100 min-h-[140px]">
                {displayText}
                {isTyping && <span className="ml-1 animate-pulse">|</span>}
              </div>
            </div>

            {stageData?.summary_ai && stageData?.status !== "ongoing" && (
              <div className="mt-8 bg-slate-950 border border-slate-700 rounded-xl p-4">
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Ringkasan Akhir
                </p>
                <p className="mt-3 text-sm text-slate-200 whitespace-pre-line">
                  {stageData.summary_ai}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  Menunggu review Guild Master.
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Pilihan Tindakan
              </p>
              <span className="text-xs text-slate-500">
                {hasChosen ? "Terkunci" : "Pilih satu"}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const disabled =
                  hasChosen ||
                  isStageLoading ||
                  isTyping ||
                  stageData?.status !== "ongoing" ||
                  stageNumber >= STAGE_MAX;
                return (
                  <button
                    key={`${option}-${idx}`}
                    onClick={() => handleOptionClick(option)}
                    disabled={disabled}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                      disabled
                        ? "border-slate-700 bg-slate-800/80 text-slate-500 cursor-not-allowed"
                        : "border-slate-600 bg-slate-900 hover:border-[var(--accent)] hover:text-white"
                    } ${isSelected ? "border-[var(--accent)] text-white" : ""}`}
                  >
                    <div className="text-sm">
                      <span className="mr-2 text-slate-500">{idx + 1}.</span>
                      {option}
                    </div>
                  </button>
                );
              })}
            </div>

            {stageData?.status !== "ongoing" && (
              <div className="mt-6 text-sm text-slate-300">
                Petualangan berakhir. Laporkan hasilnya ke Guild Master.
              </div>
            )}

            <div className="mt-6 text-xs text-slate-400">
              Status approval: {stageData?.status_approval || "pending"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCanvas;
