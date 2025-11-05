import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listarModelos() {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.GEMINI_API_KEY);
    const data = await response.json();
    console.log("📋 Modelos disponíveis:");
    data.models.forEach((m) => console.log("-", m.name));
  } catch (error) {
    console.error("❌ Erro ao listar modelos:", error);
  }
}

listarModelos();
