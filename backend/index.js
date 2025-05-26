import express from "express";
import cors from "cors";

import UserRoute from "./routes/UserRoute.js";
import PetualangRoute from "./routes/PetualangRoutes.js";
import MisiRoute from "./routes/MisiRoutes.js";
import LogActivityRoute from "./routes/LogActivityRoutes.js";
import OwnerRoute from "./routes/OwnerRoutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'https://f-04-460503.uc.r.appspot.com' }));
app.use(express.json());

app.get("/", (req, res) => res.send("Server running..."));

// Pasang prefix route
app.use("/user", UserRoute);
app.use("/petualang", PetualangRoute);
app.use("/misi", MisiRoute);
app.use("/logactivity", LogActivityRoute);
app.use("/owner", OwnerRoute);

app.listen(5000, () => console.log("Server connected"));
