import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION =
  "Kamu adalah Chronicler (Pencatat Sejarah) dari sebuah Guild Petualang yang legendaris. " +
  "Gayamu dingin, pragmatis, dan tidak memaafkan kesalahan. Kamu memandang petualangan bukan sebagai dongeng, " +
  "melainkan pertaruhan nyawa. Gunakan diksi yang berat, realistis, dan imersif. " +
  "Setiap pilihan petualang harus membawa konsekuensi logis: luka, kehilangan reputasi, atau keberhasilan yang berdarah.";

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-2.0-flash";
const STAGE_MAX = 5;

const modelCache = new Map();

const getModel = (modelName = MODEL_NAME) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY belum disetel");
  }
  if (!modelCache.has(modelName)) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION,
    });
    modelCache.set(modelName, model);
  }
  return modelCache.get(modelName);
};

const getErrorMessage = (error) => {
  if (!error) return "";
  if (typeof error === "string") return error;
  return error.message || String(error);
};

const isFallbackEligibleError = (error) => {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes("not found") ||
    message.includes("not supported") ||
    message.includes("404") ||
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("exceeded")
  );
};

const generateContentWithFallback = async (prompt) => {
  try {
    const model = getModel(MODEL_NAME);
    return await model.generateContent(prompt);
  } catch (error) {
    if (
      MODEL_NAME !== FALLBACK_MODEL &&
      isFallbackEligibleError(error)
    ) {
      console.warn(
        `[GeminiService] Fallback to ${FALLBACK_MODEL} after error: ${getErrorMessage(error)}`
      );
      const fallback = getModel(FALLBACK_MODEL);
      return await fallback.generateContent(prompt);
    }
    throw error;
  }
};

const buildStagePrompt = (mission, stage, history) => {
  const historyText = (history || [])
    .map((entry) => {
      const pilihan = entry.pilihan ? entry.pilihan : "-";
      const narasi = entry.narasi ? entry.narasi : "-";
      return `Stage ${entry.stage}: pilihan="${pilihan}" narasi="${narasi}"`;
    })
    .join("\n");

  return `
=== DOKUMEN MISI GUILD ===
JUDUL: ${mission.judul_misi}
DESKRIPSI: ${mission.deskripsi || "-"}
SYARAT MINIMAL: Level ${mission.level_required}

PROGRES EKSPEDISI:
Total Stage: ${STAGE_MAX}
Posisi Sekarang: Stage ${stage}/${STAGE_MAX}
Fase: ${stage <= 2 ? 'Infiltrasi/Awal' : stage <= 4 ? 'Konflik Utama' : 'Konfrontasi Akhir'}

ARSIP TINDAKAN SEBELUMNYA:
${historyText || "Halaman ini masih kosong."}

INSTRUKSI NARRATOR:
1. Narasi: Tuliskan kelanjutan cerita yang sinkron dengan pilihan terakhir. Fokus pada atmosfir tempat dan ketegangan situasi. Jangan memberikan solusi instan.
2. Opsi: Berikan 5 pilihan tindakan yang mencerminkan strategi RPG (misal: Serang langsung, Gunakan taktik sembunyi, Observasi lingkungan, Gunakan peralatan, atau Negosiasi/Diplomasi). dan jangan menulis terlalu panjang, beberapa 1 sampai 2 kalimat saja
3. Konsekuensi: Jika petualang mengambil langkah konyol di stage tinggi, berikan status "failed" dengan narasi kematian atau kegagalan total yang memalukan bagi Guild.
4. Konsistensi: Jangan keluar dari tema "${mission.judul_misi}". Jika misinya membunuh Slime, jangan tiba-tiba ada naga kecuali ada alasan naratif yang sangat kuat.

OUTPUT WAJIB JSON (MURNI TANPA MARKDOWN):
{
  "narasi": "tuliskan narasi dramatis di sini",
  "opsi": ["opsi 1", "opsi 2", "opsi 3", "opsi 4", "opsi 5"],
  "status": "ongoing|failed|completed"
}
`.trim();
};

const parseGeminiJson = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (parseError) {
      return null;
    }
  }
};

const normalizeStatus = (status, stage) => {
  const normalized =
    status === "failed" || status === "completed" || status === "ongoing"
      ? status
      : "ongoing";
  if (stage >= STAGE_MAX && normalized === "ongoing") {
    return "completed";
  }
  return normalized;
};

const normalizeOptions = (options, status) => {
  if (status !== "ongoing") {
    return Array.isArray(options) ? options.slice(0, 5) : [];
  }
  const cleaned = Array.isArray(options)
    ? options.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const normalized = cleaned.slice(0, 5);
  while (normalized.length < 5) {
    normalized.push(`Pertimbangkan aksi alternatif ${normalized.length + 1}`);
  }
  return normalized;
};

export const generateStage = async (mission, stage, history) => {
  const prompt = buildStagePrompt(mission, stage, history);
  const result = await generateContentWithFallback(prompt);
  const responseText = result.response.text();
  const parsed = parseGeminiJson(responseText);

  if (!parsed || !parsed.narasi) {
    return {
      narasi:
        "Suasana menegang, namun narasi gagal disusun dengan jelas. Sang petualang harus menimbang ulang langkah berikutnya.",
      opsi: normalizeOptions([], "ongoing"),
      status: normalizeStatus("ongoing", stage),
    };
  }

  const status = normalizeStatus(parsed.status, stage);
  const opsi = normalizeOptions(parsed.opsi, status);

  return {
    narasi: String(parsed.narasi).trim(),
    opsi,
    status,
  };
};

export const generateFinalSummary = async (mission, history) => {
  const historyText = (history || [])
    .map((entry) => {
      const pilihan = entry.pilihan ? entry.pilihan : "-";
      return `Stage ${entry.stage}: pilihan="${pilihan}"`;
    })
    .join("\n");

  const prompt = `
=== LAPORAN PASCA-EKSPEDISI ===
Kpd: Guild Master
Misi: ${mission.judul_misi}

DETAIL PERJALANAN:
${historyText}

TUGAS:
Tuliskan ringkasan eksekutif perjalanan petualang ini. 
- Gunakan bahasa yang formal namun tajam.
- Soroti apakah petualang bertindak cerdik atau hanya beruntung.
- Jelaskan kondisi akhir petualang saat kembali ke Guild.
- Batasi 1-2 paragraf. Jangan gunakan simbol markdown seperti bold atau bullet points.
`.trim();

  const result = await generateContentWithFallback(prompt);
  const responseText = result.response.text();
  return responseText ? responseText.trim() : "Laporan petualangan tidak tersedia.";
};
