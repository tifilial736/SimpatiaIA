import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { discipline, dailyHours } = req.body;

  if (!discipline || !dailyHours) {
    return res.status(400).json({ error: "Discipline e dailyHours são obrigatórios" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Pegando a chave da Vercel
    });

    const prompt = `
      Você é um gerador de planos de estudo acadêmicos.
      O aluno escolheu a disciplina: "${discipline}".
      O aluno informou que possui apenas ${dailyHours} horas por dia para estudar.

      Gere um plano de estudo personalizado considerando:
      - Divisão em módulos (do básico ao avançado).
      - Tópicos dentro de cada módulo.
      - Duração estimada de cada módulo em semanas (ajustando com base no tempo diário informado).
      - Recomendações finais para manter consistência.

      Responda SOMENTE em JSON válido, sem explicações extras.
      Modelo:
      {
        "discipline": "Nome",
        "modules": [
          { "title": "", "topics": [""], "duration": "" }
        ],
        "totalDuration": "",
        "recommendations": [""]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content;
    content = content.replace(/```json|```/g, "").trim();
    const parsedPlan = JSON.parse(content);

    return res.status(200).json(parsedPlan);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao gerar plano de estudo" });
  }
}
