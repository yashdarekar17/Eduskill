import express from "express";
import { generateCertificate } from "../controllers/certificateController";
import { jwtWebMiddleware } from "../middleware/jwt";

const router = express.Router();

router.post("/generate", jwtWebMiddleware, generateCertificate as any);

export default router;