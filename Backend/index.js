import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import createTables from "./src/DB/createTables.js";
import notesRouter from "./src/routes/notesRoutes.js";
import authRouter from "./src/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import healthCheckRoute from "./src/routes/healthCheckRoute.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: [process.env.FRONTEND_URL, process.env.LOCALHOST],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", healthCheckRoute);
app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);

await createTables()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server stated. Listening on PORT: ${PORT}`)
    );
  })
  .catch((err) => console.log("Error starting server", err));
