// server/routes/systemRoutes.js
import express from "express";
import { getSystemSnapshot } from "../controllers/systemController.js";

const router = express.Router();

router.get("/", getSystemSnapshot);

export default router;
