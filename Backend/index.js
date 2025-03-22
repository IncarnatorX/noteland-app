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
    origin: "http://localhost:5173",
  })
);
await createTables();

app.use(express.json());
app.use("/api/notes", notesRouter);
app.listen(PORT, () =>
  console.log(`Server stated. Listening on PORT: ${PORT}`)
);
