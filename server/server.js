import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import { app,server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
connect();
app.use(
  cors({
    origin: 'https://speed-service-tan.vercel.app/',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/message", messageRouter);

app.options("*", cors());
server.listen(PORT, () => {
  console.log("Server connected to port " + PORT);
});
