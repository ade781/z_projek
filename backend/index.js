import express from "express";
import cors from "cors";

import UserRoute from "./routes/UserRoute.js";
import PetualangRoute from "./routes/PetualangRoutes.js";
import MisiRoute from "./routes/MisiRoutes.js";
import LogActivityRoute from "./routes/LogActivityRoutes.js";
import OwnerRoute from "./routes/OwnerRoutes.js";
import AchievementRoute from "./routes/AchievementRoutes.js";
import QuestRoute from "./routes/QuestRoutes.js";
import GuildRoute from "./routes/GuildRoutes.js";
import InventoryRoute from "./routes/InventoryRoutes.js";
import NotificationRoute from "./routes/NotificationRoutes.js";
import WargaDesaRoute from "./routes/WargaDesaRoutes.js";
import MisiRequestRoute from "./routes/MisiRequestRoutes.js";
import TopupRoute from "./routes/TopupRoutes.js";
import MarketRoute from "./routes/MarketRoutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cookieParser());
const allowedOrigins = [
  "https://f-04-460503.uc.r.appspot.com",
  "http://localhost:3000",
];

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Allow non-browser requests without Origin header (e.g., curl/Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => res.send("Server running..."));

// Pasang prefix route
app.use("/user", UserRoute);
app.use("/petualang", PetualangRoute);
app.use("/misi", MisiRoute);
app.use("/logactivity", LogActivityRoute);
app.use("/owner", OwnerRoute);
app.use("/achievement", AchievementRoute);
app.use("/quest", QuestRoute);
app.use("/guild", GuildRoute);
app.use("/inventory", InventoryRoute);
app.use("/notification", NotificationRoute);
app.use("/warga-desa", WargaDesaRoute);
app.use("/misi-request", MisiRequestRoute);
app.use("/topup", TopupRoute);
app.use("/market", MarketRoute);

app.listen(5000, () => console.log("Server connected"));
