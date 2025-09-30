import React, { useState } from "react";
import { BookOpen, Clock, Calendar, Download, Target, TrendingUp, AlertCircle } from "lucide-react";

export default function StudyPlanGenerator() {
  const [discipline, setDiscipline] = useState("");
  const [dailyHours, setDailyHours] = useState("");
  const [knowledgeLevel, setKnowledgeLevel] = useState("");
  const [deadline, setDeadline] = useState("");
  const [studyGoal, setStudyGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);
  const [error, setError] = useState("");

  const availableDisciplines = [
    "Cálculo I",
    "Álgebra Linear",
    "Programação Web",
    "Banco de Dados",
    "Engenharia de Software",
    "Estatística",
    "Estruturas de Dados",
    "Física I",
    "Química Geral",
    "Circuitos Elétricos"
  ];

  const knowledgeLevels = [
    { value: "iniciante", label: "Iniciante - Nunca estudei isso" },
    { value: "basico", label: "Básico - Já vi o conteúdo mas preciso revisar" },
    { value: "intermediario", label: "Intermediário - Conheço mas preciso aprofundar" },
    { value: "avancado", label: "Avançado - Só preciso de revisão" },
  ];

  const studyGoals = [
    "Preparação para prova",
    "Dominar a matéria completamente",
    "Revisão para exame final",
    "Aprender para projeto prático",
    "Preparação para concurso",
    "Desenvolvimento profissional"
  ];

  const calculateDaysAvailable = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Função para gerar plano com OpenAI
  const generateStudyPlanWithOpenAI = async () => {
    const daysAvailable = calculateDaysAvailable();
    const totalHoursAvailable = daysAvailable * parseInt(dailyHours);

    const prompt = `Como especialista em educação universitária, crie um plano de estudo DETALHADO e REALISTA em formato JSON válido.

CONTEXTO:
- Disciplina: ${discipline}
- Nível do aluno: ${knowledgeLevel}
- Horas diárias disponíveis: ${dailyHours}h
- Dias até o prazo: ${daysAvailable} dias
- Total de horas disponíveis: ${totalHoursAvailable}h
- Objetivo: ${studyGoal}

CRIE um plano ESPECÍFICO com:

1. MÓDULOS DE ESTUDO (2-3 módulos):
   - Títulos específicos da disciplina
   - Duração realista em semanas
   - 5-7 tópicos teóricos CONCRETOS (não genéricos)
   - 3-4 aplicações práticas REAIS
   - Cronograma semanal detalhado

2. ESTRUTURA EXATA DO JSON:
{
  "discipline": "${discipline}",
  "totalDuration": "X semanas",
  "realityCheck": "Análise realista sobre o tempo disponível",
  "modules": [
    {
      "title": "Título específico do módulo 1",
      "duration": "X semanas",
      "topics": [
        "tópico específico 1",
        "tópico específico 2",
        "tópico específico 3"
      ],
      "practicalApplications": [
        "aplicação prática 1",
        "aplicação prática 2"
      ],
      "weeklySchedule": {
        "Segunda": "atividade específica - Xh",
        "Quarta": "atividade específica - Yh",
        "Sexta": "atividade específica - Zh"
      }
    }
  ],
  "weeklyGoals": [
    "Meta específica para semana 1",
    "Meta específica para semana 2"
  ],
  "recommendations": [
    "Recomendação específica 1",
    "Recomendação específica 2"
  ],
  "studyTips": [
    "Dica de estudo específica 1",
    "Dica de estudo específica 2"
  ]
}

IMPORTANTE:
- Seja ESPECÍFICO na disciplina ${discipline}
- Inclua tópicos REAIS de universidades
- Aplicações PRÁTICAS do mundo real
- Cronograma EXECUTÁVEL
- Responda SOMENTE com o JSON válido`;

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Chave da OpenAI não encontrada. Configure VITE_OPENAI_API_KEY no arquivo .env');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro OpenAI: ${errorData.error?.message || response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Limpa e parse o JSON
      const cleanedContent = content.replace(/```json|```/g, '').trim();
      const aiPlan = JSON.parse(cleanedContent);
      
      return aiPlan;

    } catch (error) {
      console.error('Erro na chamada da OpenAI:', error);
      throw new Error(`Falha na geração: ${error.message}`);
    }
  };

  const generateStudyPlan = async () => {
    if (!discipline.trim() || !dailyHours.trim() || !knowledgeLevel || !deadline || !studyGoal) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
    
    const daysAvailable = calculateDaysAvailable();
    
    if (daysAvailable < 0) {
      alert("A data limite não pode ser no passado!");
      return;
    }

    if (daysAvailable < 1) {
      alert("Você precisa de pelo menos 1 dia para gerar um plano de estudo!");
      return;
    }

    setIsGenerating(true);
    setError("");
    setStudyPlan(null);

    try {
      const aiPlan = await generateStudyPlanWithOpenAI();
      
      // Adiciona dados do formulário ao plano da IA
      const completePlan = {
        ...aiPlan,
        knowledgeLevel,
        dailyHours: parseInt(dailyHours),
        daysAvailable,
        studyGoal
      };

      setStudyPlan(completePlan);
    } catch (error) {
      console.error("Erro ao gerar plano de estudo:", error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportPlan = () => {
    if (!studyPlan) return;
    
    const planText = `
PLANO DE ESTUDO - ${studyPlan.discipline}
=====================================

Nível: ${studyPlan.knowledgeLevel}
Horas diárias: ${studyPlan.dailyHours}h
Dias disponíveis: ${studyPlan.daysAvailable}
Duração: ${studyPlan.totalDuration}
Objetivo: ${studyPlan.studyGoal}

${studyPlan.realityCheck ? `
ANÁLISE DA IA:
${studyPlan.realityCheck}
` : ''}

MÓDULOS DE ESTUDO:
${studyPlan.modules.map((module, i) => `
${i + 1}. ${module.title} (${module.duration})
   CONTEÚDO TEÓRICO:
   ${module.topics.map(t => `   • ${t}`).join('\n')}
   
   ${module.practicalApplications ? `APLICAÇÕES PRÁTICAS:
   ${module.practicalApplications.map(app => `   ◦ ${app}`).join('\n')}` : ''}
   
   ${module.weeklySchedule ? `CRONOGRAMA SEMANAL:
   ${Object.entries(module.weeklySchedule).map(([day, task]) => `   ${day}: ${task}`).join('\n')}` : ''}
`).join('\n')}

${studyPlan.weeklyGoals ? `
METAS:
${studyPlan.weeklyGoals.map(g => `- ${g}`).join('\n')}
` : ''}

${studyPlan.recommendations ? `
RECOMENDAÇÕES:
${studyPlan.recommendations.map(r => `- ${r}`).join('\n')}
` : ''}

${studyPlan.studyTips ? `
DICAS DE ESTUDO:
${studyPlan.studyTips.map(t => `- ${t}`).join('\n')}
` : ''}
    `;
    
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano-estudo-${discipline.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
  };

  const getUrgencyColor = () => {
    if (!studyPlan) return 'from-purple-600 to-blue-600';
    
    const days = studyPlan.daysAvailable;
    if (days <= 1) return 'from-red-600 to-orange-600';
    if (days <= 3) return 'from-orange-500 to-yellow-500';
    if (days <= 7) return 'from-blue-500 to-cyan-500';
    return 'from-green-500 to-emerald-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900">
              Plano de Estudo <span className="text-purple-600">com IA</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Planos 100% gerados por OpenAI com conteúdo específico e aplicações práticas.
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-600" />
            Configure seu Plano
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Disciplina */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                📚 Disciplina
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                <option value="">-- Escolha uma disciplina --</option>
                {availableDisciplines.map((d, idx) => (
                  <option key={idx} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Horas diárias */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                ⏰ Horas por dia
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                placeholder="Ex: 2"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            {/* Nível de conhecimento */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                📊 Seu nível
              </label>
              <select
                value={knowledgeLevel}
                onChange={(e) => setKnowledgeLevel(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                <option value="">-- Selecione seu nível --</option>
                {knowledgeLevels.map((level, idx) => (
                  <option key={idx} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            {/* Data limite */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                📅 Data limite
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              {deadline && (
                <p className={`text-sm mt-2 font-medium ${
                  calculateDaysAvailable() <= 3 ? 'text-red-600' : 
                  calculateDaysAvailable() <= 7 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {calculateDaysAvailable()} dias disponíveis
                </p>
              )}
            </div>

            {/* Objetivo do estudo */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                🎯 Objetivo principal
              </label>
              <select
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                <option value="">-- Qual seu objetivo? --</option>
                {studyGoals.map((goal, idx) => (
                  <option key={idx} value={goal}>{goal}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 font-semibold">Erro na geração:</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  {error.includes('Chave da OpenAI') && (
                    <p className="text-xs text-red-600 mt-2">
                      Configure VITE_OPENAI_API_KEY no arquivo .env com sua chave da OpenAI
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Botão de gerar */}
          <button
            onClick={generateStudyPlan}
            disabled={isGenerating || !discipline || !dailyHours || !knowledgeLevel || !deadline || !studyGoal}
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                OpenAI gerando seu plano...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2" />
                Gerar Plano com OpenAI
              </>
            )}
          </button>
        </div>

        {/* Resultado do Plano */}
        {studyPlan && (
          <div className="space-y-6">
            {/* Cabeçalho do Plano */}
            <div className={`bg-gradient-to-r ${getUrgencyColor()} rounded-2xl shadow-xl p-8 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold">
                  Plano: {studyPlan.discipline}
                </h2>
                <button
                  onClick={exportPlan}
                  className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </button>
              </div>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/20 rounded-lg p-3">
                  <Clock className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Duração</div>
                  <div>{studyPlan.totalDuration}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Calendar className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Dias</div>
                  <div>{studyPlan.daysAvailable} dias</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Target className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Horas/Dia</div>
                  <div>{studyPlan.dailyHours}h</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <TrendingUp className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Status</div>
                  <div className="capitalize">
                    {studyPlan.daysAvailable <= 3 ? 'Urgente' : 
                     studyPlan.daysAvailable <= 7 ? 'Moderado' : 'Confortável'}
                  </div>
                </div>
              </div>
            </div>

            {/* Avaliação Realista */}
            {studyPlan.realityCheck && (
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  Análise da OpenAI
                </h3>
                <p className="text-blue-800 text-lg">{studyPlan.realityCheck}</p>
              </div>
            )}

            {/* Módulos de Estudo */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📖 Módulos de Estudo</h3>
              <div className="space-y-8">
                {studyPlan.modules.map((module, index) => (
                  <div key={index} className="border-l-4 border-purple-500 bg-gray-50 rounded-r-xl p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          Módulo {index + 1}: {module.title}
                        </h4>
                        <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          {module.duration}
                        </span>
                      </div>
                    </div>

                    {/* Tópicos Teóricos */}
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Conteúdo Teórico
                      </h5>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {module.topics.map((topic, idx) => (
                          <li key={idx} className="flex items-start p-3 bg-white rounded-lg border border-gray-200">
                            <span className="text-purple-500 mr-2 text-lg">•</span>
                            <span className="text-gray-700">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Aplicações Práticas */}
                    {module.practicalApplications && (
                      <div className="mb-6">
                        <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <Target className="w-5 h-5 mr-2" />
                          Aplicações Práticas
                        </h5>
                        <div className="grid md:grid-cols-2 gap-3">
                          {module.practicalApplications.map((app, idx) => (
                            <div key={idx} className="flex items-start p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                              <span className="text-green-600 font-bold mr-2">{idx + 1}.</span>
                              <span className="text-gray-800">{app}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cronograma Semanal */}
                    {module.weeklySchedule && (
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <Calendar className="w-5 h-5 mr-2" />
                          Cronograma Semanal
                        </h5>
                        <div className="grid md:grid-cols-2 gap-3">
                          {Object.entries(module.weeklySchedule).map(([day, task], idx) => (
                            <div key={idx} className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                              <span className="font-semibold text-purple-600 mr-3 min-w-20">{day}:</span>
                              <span className="text-gray-700">{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Metas e Recomendações */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Metas Semanais */}
              {studyPlan.weeklyGoals && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Metas do Plano</h3>
                  <div className="space-y-3">
                    {studyPlan.weeklyGoals.map((goal, idx) => (
                      <div key={idx} className="flex items-start p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <span className="font-bold text-blue-600 mr-3">{idx + 1}.</span>
                        <span className="text-gray-700">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recomendações */}
              {studyPlan.recommendations && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Recomendações</h3>
                  <ul className="space-y-3">
                    {studyPlan.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start p-3 bg-yellow-50 rounded-lg transition">
                        <span className="text-yellow-500 mr-3 text-xl">→</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Dicas de Estudo */}
            {studyPlan.studyTips && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">✨ Dicas de Estudo</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {studyPlan.studyTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-purple-100">
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}