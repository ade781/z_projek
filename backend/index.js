import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import NoteRoute from "./routes/NoteRoute.js"; // ⬅️ Tambahan: import NoteRoute
import cookieParser from "cookie-parser";
import configDotenv from "dotenv";

const app = express();
app.get("/", (req, res) => res.send("Server running..."));


configDotenv.config();

app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'https://f-04-450706.uc.r.appspot.com' }));
app.use(express.json());

// Routes
app.get("/", (req, res) => res.render("index"));
app.use(UserRoute);       // ⬅️ Routing untuk user
app.use(NoteRoute);       // ⬅️ Routing untuk note

app.listen(5000, () => console.log("Server connected"));
