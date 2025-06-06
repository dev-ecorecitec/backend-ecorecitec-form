import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router } from "./routes";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://frontend-form-ecorecitec-z75z.vercel.app",
  process.env.API_URL,
].filter((url): url is string => Boolean(url));

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Origin bloqueada pelo CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
