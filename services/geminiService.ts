
import { GoogleGenAI } from "@google/genai";
import { Task, TaskStatus } from "../types";

export const getMotivationalQuote = async (tasks: Task[], excludeVerses: string[] = []): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const doneCount = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const pendingCount = tasks.filter(t => t.status !== TaskStatus.DONE).length;
    
    const now = new Date();
    const timestamp = now.getTime();
    const hour = now.getHours();
    const period = hour < 12 ? "manhã" : hour < 18 ? "tarde" : "noite";

    const prompt = `
      Atue como um sábio mestre bíblico especializado no livro de Provérbios.
      Seu objetivo é extrair uma lição de sabedoria ÚNICA e RELEVANTE para o momento do usuário.
      
      CONTEXTO DO USUÁRIO:
      - Período do dia: ${period}
      - Progresso: ${doneCount} concluídas, ${pendingCount} pendentes.
      - Semente de variação temporal: ${timestamp}

      REGRAS CRÍTICAS DE EXCLUSÃO:
      - NÃO utilize nenhum destes versículos (já exibidos recentemente): ${excludeVerses.join(", ")}.
      - EVITE os versículos mais comuns (ex: Prov 3:5, 16:3, 16:9) a menos que sejam fundamentais.
      - BUSQUE sabedoria nos 31 capítulos de Provérbios, priorizando passagens que falem sobre diligência, sono, fala, honestidade e sabedoria prática.

      FORMATO OBRIGATÓRIO:
      - Responda APENAS com o versículo no formato: "Provérbios X:Y - [Texto do versículo]"
      - Não adicione introduções ou conclusões.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text?.trim().replace(/^"|"$/g, '');
    
    // Fallback caso a IA falhe ou repita algo bloqueado (raro com o prompt acima)
    if (!text || excludeVerses.includes(text)) {
      return "Provérbios 21:5 - Os planos bem elaborados levam à fartura; mas o apressado sempre acaba na miséria.";
    }

    return text;
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return "Provérbios 4:23 - Acima de tudo, guarde o seu coração, pois dele procede as fontes da vida.";
  }
};
