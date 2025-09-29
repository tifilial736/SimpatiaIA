import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { discipline, dailyHours, knowledgeLevel, deadline, studyGoal, daysAvailable } = req.body;

  if (!discipline || !dailyHours || !knowledgeLevel || !deadline || !studyGoal) {
    return res.status(400).json({ 
      error: "Todos os campos são obrigatórios: discipline, dailyHours, knowledgeLevel, deadline, studyGoal" 
    });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const totalWeeks = Math.ceil(daysAvailable / 7);

    const prompt = `
Você é um especialista em criação de planos de estudo personalizados e eficientes.

CONTEXTO DO ESTUDANTE:
- Disciplina: ${discipline}
- Horas disponíveis por dia: ${dailyHours} horas
- Nível de conhecimento atual: ${knowledgeLevel}
- Objetivo: ${studyGoal}
- Prazo total: ${daysAvailable} dias (${totalWeeks} semanas)
- Data limite: ${deadline}

CRIE um plano de estudo completo e detalhado que inclua:

1. MÓDULOS DE ESTUDO:
   - Divida o conteúdo em módulos lógicos (do básico ao avançado)
   - Cada módulo deve ter:
     * Título descritivo
     * Duração estimada em semanas
     * Lista de tópicos específicos a serem estudados
     * Recursos recomendados (livros, vídeos, exercícios)
     * Cronograma semanal detalhado (distribuindo as ${dailyHours}h diárias)

2. METAS SEMANAIS:
   - Defina metas claras e alcançáveis para cada semana
   - Metas devem ser específicas e mensuráveis

3. RECOMENDAÇÕES:
   - Dicas específicas para otimizar o estudo nesta disciplina
   - Estratégias baseadas no nível ${knowledgeLevel}
   - Como manter a consistência ao longo das ${totalWeeks} semanas

IMPORTANTE: 
- Adapte a profundidade e complexidade baseado no nível ${knowledgeLevel}
- Considere que o estudante tem ${dailyHours}h DIÁRIAS disponíveis
- O prazo total é de ${daysAvailable} dias
- Seja prático e realista com o tempo disponível

Responda SOMENTE em JSON válido com a seguinte estrutura:

{
  "discipline": "Nome da disciplina",
  "totalDuration": "X semanas",
  "modules": [
    {
      "title": "Título do módulo",
      "duration": "X-Y semanas",
      "topics": ["tópico 1", "tópico 2", ...],
      "resources": [
        {"type": "Tipo", "name": "Nome do recurso", "url": "#"}
      ],
      "weeklySchedule": {
        "Segunda": "Atividade específica - Xh",
        "Terça": "Atividade específica - Xh",
        ...
      }
    }
  ],
  "weeklyGoals": [
    "Semana 1: meta específica",
    "Semana 2: meta específica",
    ...
  ],
  "recommendations": [
    "Recomendação 1",
    "Recomendação 2",
    ...
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    let content = response.choices[0].message.content;
    
    // Limpa o conteúdo removendo markdown code blocks
    content = content.replace(/```json|```/g, "").trim();
    
    const parsedPlan = JSON.parse(content);

    return res.status(200).json(parsedPlan);
  } catch (error) {
    console.error("Erro detalhado:", error);
    return res.status(500).json({ 
      error: "Erro ao gerar plano de estudo",
      details: error.message 
    });
  }
}