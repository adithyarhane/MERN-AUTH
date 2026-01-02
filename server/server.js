import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

const allowedOrigins = ["http://localhost:5173"];

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => {
  res.send("Server running just file!");
});

// Root Endpoints
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

//Start Listening Server
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} -------------->`)
);
