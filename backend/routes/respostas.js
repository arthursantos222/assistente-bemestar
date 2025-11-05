import express from "express";
import { gerarRelatorio } from "../controllers/respostasController.js";

const router = express.Router();

router.post("/", gerarRelatorio);

export default router;
