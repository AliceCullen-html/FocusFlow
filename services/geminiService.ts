
import { GoogleGenAI } from "@google/genai";
import { Task, TaskStatus } from "../types";

export const getMotivationalQuote = async (tasks: Task[], excludeVerses: string[] = []): Promise<string> => {
  try {
    // Always use the process.env.API_KEY directly as per the guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const doneCount = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const pendingCount = tasks.filter(t => t.status !== TaskStatus.DONE).length;
    
    const now = new Date();
    const hour = now.getHours();
    const period = hour < 12 ? "manhã" : hour < 18 ? "tarde" : "noite";

    const prompt = `
      Atue como um sábio conhecedor das Escrituras Sagradas, focado exclusivamente no livro de Provérbios.
      Seu objetivo é selecionar um versículo que traga sabedoria para o momento do usuário.
      
      Contexto do Usuário:
      - Período: ${period}
      - Tarefas concluídas hoje: ${doneCount}
      - Tarefas pendentes: ${pendingCount}

      EVITE REPETIÇÃO: 
      Não utilize nenhum destes versículos recentes: ${excludeVerses.join(", ")}.
      Tente buscar sabedoria em capítulos variados (Existem 31 capítulos em Provérbios).

      Instruções:
      1. Escolha UMA passagem real e específica do livro de Provérbios.
      2. Se houver pendências, foque em diligência e planejamento. Se houver progresso, foque em gratidão ou continuidade.
      3. Formato de resposta: "Provérbios X:Y - [Texto do versículo]"
      4. IMPORTANTE: Responda APENAS com o versículo.
      5. Use uma semente de aleatoriedade interna para ser criativo: ${Math.random()}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim().replace(/^"|"$/g, '') || "Provérbios 16:3 - Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Provérbios 3:5 - Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento.";
  }
};
