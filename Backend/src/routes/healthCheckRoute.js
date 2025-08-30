import { Router } from "express";

const healthCheckRoute = Router();

healthCheckRoute.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
    currentTime: new Date().toDateString(),
    message: "Service is healthy",
  });
});

export default healthCheckRoute;
