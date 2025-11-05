// backend/controllers/respostasController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Inicializa a API do Gemini com a chave do .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function gerarRelatorio(req, res) {
  try {
    const { nome, idade, rotina, sono, alimentacao } = req.body;

    if (!nome || !idade || !rotina || !sono || !alimentacao) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    // ⚠️ MODELO CORRETO — versões 1.5 foram descontinuadas
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // ou "gemini-2.5-pro"
    });

    const prompt = `
      Gere um relatório de bem-estar personalizado com base nas informações abaixo:
      - Nome: ${nome}
      - Idade: ${idade}
      - Rotina: ${rotina}
      - Sono: ${sono}
      - Alimentação: ${alimentacao}

      O relatório deve:
      - Ser em tom positivo e motivador.
      - Incluir recomendações práticas de bem-estar, sono e produtividade.
      - Ter no máximo 3 parágrafos.
    `;

    // 🚀 Gera o conteúdo com o modelo Gemini 2.5
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Monta o relatório final
    const relatorio = {
      id: Date.now(),
      nome,
      idade,
      rotina,
      sono,
      alimentacao,
      data: new Date(),
      relatorio: text,
    };

    res.json(relatorio);
  } catch (error) {
    console.error("❌ Erro ao gerar relatório:", error);
    res.status(500).json({
      error: "Erro ao gerar relatório",
      detalhe: error.message || error.toString(),
    });
  }
}
