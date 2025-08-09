import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import createTables from "./src/DB/createTables.js";
import notesRouter from "./src/routes/notesRoutes.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: [process.env.FRONTEND_URL, process.env.LOCALHOST],
  })
);
await createTables();

app.use(express.json());
app.use("/api/notes", notesRouter);
app.listen(PORT, () =>
  console.log(`Server stated. Listening on PORT: ${PORT}`)
);
