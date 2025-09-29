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
  ];

  // Função para gerar plano de estudo com fallback
  const generateStudyPlan = async () => {
    if (!discipline.trim() || !dailyHours.trim() || !knowledgeLevel || !deadline || !studyGoal) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
    
    setIsGenerating(true);
    setError("");

    try {
      // Calcula dias disponíveis até o deadline
      const today = new Date();
      const deadlineDate = new Date(deadline);
      const daysAvailable = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysAvailable <= 0) {
        throw new Error("A data limite deve ser futura!");
      }

      // Tenta chamar a API externa
      let apiPlan;
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://seu-backend.onrender.com';
        
        const response = await fetch(`${API_URL}/api/generate-study-plan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            discipline,
            dailyHours: parseInt(dailyHours),
            knowledgeLevel,
            deadline,
            studyGoal,
            daysAvailable
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }

        apiPlan = await response.json();
      } catch (apiError) {
        console.warn('API externa não disponível, usando plano local:', apiError);
        // Fallback para plano local
        apiPlan = await generateLocalPlan(discipline, dailyHours, knowledgeLevel, studyGoal, daysAvailable);
      }

      // Combina os dados da API com a estrutura esperada pelo frontend
      const completePlan = {
        discipline: apiPlan.discipline || discipline,
        knowledgeLevel: knowledgeLevel,
        dailyHours: parseInt(dailyHours),
        daysAvailable: daysAvailable,
        totalDuration: apiPlan.totalDuration || `${Math.ceil(daysAvailable / 7)} semanas`,
        studyGoal: studyGoal,
        modules: apiPlan.modules || [],
        recommendations: apiPlan.recommendations || [
          `Estude sempre no mesmo horário para criar uma rotina`,
          `Faça pausas de 10 minutos a cada 50 minutos de estudo`,
          `Revise os conceitos aprendidos no dia seguinte`,
          `Com ${dailyHours}h por dia, você tem ${parseInt(dailyHours) * daysAvailable}h totais até a data limite`
        ],
        studyTips: [
          "📝 Use técnicas de estudo ativo: faça resumos e mapas mentais",
          "🎯 Estabeleça metas diárias específicas e alcançáveis",
          "👥 Estude em grupo para trocar conhecimentos",
          "🔄 Pratique a revisão espaçada para melhor retenção",
          "💪 Não deixe dúvidas acumularem - busque ajuda rapidamente"
        ],
        weeklyGoals: apiPlan.weeklyGoals || generateWeeklyGoals(daysAvailable, discipline)
      };

      setStudyPlan(completePlan);
    } catch (error) {
      console.error("Erro ao gerar plano de estudo:", error);
      setError(error.message);
      alert(`Erro ao gerar plano de estudo: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Gera plano local como fallback
  const generateLocalPlan = async (discipline, dailyHours, knowledgeLevel, studyGoal, daysAvailable) => {
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const weeks = Math.ceil(daysAvailable / 7);
    
    return {
      discipline,
      totalDuration: `${weeks} semanas`,
      modules: generateModules(discipline, knowledgeLevel, weeks, parseInt(dailyHours)),
      weeklyGoals: generateWeeklyGoals(daysAvailable, discipline),
      recommendations: [
        "Estude sempre no mesmo horário para criar uma rotina",
        "Faça pausas de 10 minutos a cada 50 minutos de estudo",
        "Revise os conceitos aprendidos no dia seguinte",
        `Com ${dailyHours}h por dia, você tem ${parseInt(dailyHours) * daysAvailable}h totais até a data limite`
      ]
    };
  };

  // Gera módulos baseados na disciplina e nível
  const generateModules = (discipline, level, totalWeeks, dailyHours) => {
    const moduleTemplates = {
      "Cálculo I": [
        {
          title: "Fundamentos e Limites",
          duration: "1-2 semanas",
          topics: [
            "Funções e gráficos básicos",
            "Limites e continuidade",
            "Derivadas básicas",
            "Regras de derivação"
          ]
        },
        {
          title: "Aplicações de Derivadas",
          duration: "2-3 semanas", 
          topics: [
            "Taxas de variação",
            "Máximos e mínimos",
            "Esboço de gráficos",
            "Problemas de otimização"
          ]
        },
        {
          title: "Integrais e Aplicações",
          duration: "2-3 semanas",
          topics: [
            "Integrais indefinidas",
            "Integrais definidas",
            "Teorema Fundamental do Cálculo",
            "Áreas e volumes"
          ]
        }
      ],
      "Programação Web": [
        {
          title: "Fundamentos Web e HTML/CSS",
          duration: "1-2 semanas",
          topics: [
            "Estrutura HTML5",
            "CSS3 e Flexbox/Grid",
            "Design responsivo",
            "Semântica web"
          ]
        },
        {
          title: "JavaScript e DOM",
          duration: "2-3 semanas",
          topics: [
            "Sintaxe JavaScript ES6+",
            "Manipulação do DOM",
            "Eventos e listeners",
            "APIs do navegador"
          ]
        },
        {
          title: "Frameworks e Projeto Final",
          duration: "2-3 semanas", 
          topics: [
            "Introdução React/Vue",
            "Componentes e estado",
            "Consumo de APIs",
            "Projeto prático"
          ]
        }
      ]
    };

    const defaultModules = [
      {
        title: "Fundamentos e Conceitos Básicos",
        duration: "1-2 semanas",
        topics: [
          "Introdução aos conceitos principais",
          "Terminologia e definições essenciais", 
          "Exemplos práticos iniciais",
          "Exercícios de fixação básicos"
        ]
      },
      {
        title: "Desenvolvimento Intermediário", 
        duration: "2-3 semanas",
        topics: [
          "Aprofundamento nos conceitos",
          "Resolução de problemas complexos",
          "Aplicações práticas",
          "Estudos de caso"
        ]
      },
      {
        title: "Consolidação e Preparação Final",
        duration: "1-2 semanas",
        topics: [
          "Revisão geral de todos os módulos",
          "Simulados e exercícios avançados",
          "Resolução de questões difíceis", 
          "Identificação de pontos fracos"
        ]
      }
    ];

    const modules = moduleTemplates[discipline] || defaultModules;
    
    // Ajusta duração baseado no tempo total
    return modules.map((module, index) => ({
      ...module,
      weeklySchedule: generateWeeklySchedule(dailyHours, index, modules.length)
    }));
  };

  // Gera cronograma semanal
  const generateWeeklySchedule = (dailyHours, moduleIndex, totalModules) => {
    const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const activities = [
      "Estudo teórico",
      "Exercícios práticos", 
      "Revisão e dúvidas",
      "Prática dirigida",
      "Exercícios complexos",
      "Revisão semanal"
    ];
    
    const schedule = {};
    const daysPerWeek = Math.min(5, Math.ceil(dailyHours / 2));
    
    for (let i = 0; i < daysPerWeek; i++) {
      const day = days[i];
      const activity = activities[(moduleIndex + i) % activities.length];
      const hours = i === daysPerWeek - 1 ? dailyHours - (daysPerWeek - 1) * 1.5 : 1.5;
      schedule[day] = `${activity} - ${hours}h`;
    }
    
    return schedule;
  };

  // Gera metas semanais
  const generateWeeklyGoals = (daysAvailable, discipline) => {
    const weeks = Math.ceil(daysAvailable / 7);
    const goals = [];
    
    for (let i = 0; i < weeks; i++) {
      if (i === 0) {
        goals.push(`Semana ${i + 1}: Dominar fundamentos e completar 50% dos exercícios básicos de ${discipline}`);
      } else if (i === weeks - 1) {
        goals.push(`Semana ${i + 1}: Revisão geral e simulados - estar 90% preparado para ${discipline}`);
      } else {
        goals.push(`Semana ${i + 1}: Concluir módulo ${i} e resolver 80% dos exercícios de ${discipline}`);
      }
    }
    
    return goals;
  };

  const exportPlan = () => {
    if (!studyPlan) return;
    
    const planText = `
PLANO DE ESTUDO - ${studyPlan.discipline}
=====================================

Nível: ${studyPlan.knowledgeLevel}
Horas diárias: ${studyPlan.dailyHours}h
Duração: ${studyPlan.totalDuration}
Objetivo: ${studyPlan.studyGoal}

MÓDULOS:
${studyPlan.modules.map((module, i) => `
${i + 1}. ${module.title} (${module.duration})
   Tópicos:
   ${module.topics.map(t => `   - ${t}`).join('\n')}
   
   ${module.weeklySchedule ? `Cronograma Semanal:
   ${Object.entries(module.weeklySchedule).map(([day, task]) => `   ${day}: ${task}`).join('\n')}` : ''}
`).join('\n')}

RECOMENDAÇÕES:
${studyPlan.recommendations.map(r => `- ${r}`).join('\n')}

DICAS DE ESTUDO:
${studyPlan.studyTips.map(t => `${t}`).join('\n')}

METAS SEMANAIS:
${studyPlan.weeklyGoals.map((goal, i) => `Semana ${i + 1}: ${goal}`).join('\n')}
    `;
    
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano-estudo-${discipline.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900">
              Plano de Estudo <span className="text-purple-600">Inteligente</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Crie um plano personalizado com IA que se adapta ao seu tempo, conhecimento e objetivos.
            Complete, estruturado e pronto para usar!
          </p>
        </div>

        {/* Formulário Aprimorado */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-600" />
            Configure seu Plano de Estudo
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
                ⏰ Horas disponíveis por dia
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
                📊 Seu nível atual
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
                📅 Data limite (prova/projeto)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
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

          {/* Alerta informativo */}
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <strong>Dica:</strong> Quanto mais específico você for, melhor será seu plano! 
                O plano incluirá cronograma semanal, recursos de estudo e metas claras.
              </p>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">
                  <strong>Atenção:</strong> {error}
                </p>
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
                Gerando seu plano personalizado...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2" />
                Gerar Plano de Estudo Completo
              </>
            )}
          </button>
        </div>

        {/* Resultado do Plano */}
        {studyPlan && (
          <div className="space-y-6">
            {/* Cabeçalho do Plano */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold">
                  Seu Plano: {studyPlan.discipline}
                </h2>
                <button
                  onClick={exportPlan}
                  className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/20 rounded-lg p-3">
                  <Clock className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Duração Total</div>
                  <div>{studyPlan.totalDuration}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Calendar className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Horas por Dia</div>
                  <div>{studyPlan.dailyHours}h diárias</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Target className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Objetivo</div>
                  <div>{studyPlan.studyGoal}</div>
                </div>
              </div>
            </div>

            {/* Módulos de Estudo */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📖 Módulos de Estudo</h3>
              <div className="space-y-6">
                {studyPlan.modules.map((module, index) => (
                  <div key={index} className="border-l-4 border-purple-500 bg-gray-50 rounded-r-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          Módulo {index + 1}: {module.title}
                        </h4>
                        <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          {module.duration}
                        </span>
                      </div>
                    </div>

                    {/* Tópicos */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 mb-2">📝 Tópicos:</h5>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {module.topics.map((topic, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-purple-500 mr-2">•</span>
                            <span className="text-gray-700">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cronograma Semanal */}
                    {module.weeklySchedule && (
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">📅 Cronograma Semanal:</h5>
                        <div className="grid md:grid-cols-2 gap-2">
                          {Object.entries(module.weeklySchedule).map(([day, task], idx) => (
                            <div key={idx} className="flex items-center p-2 bg-white rounded-lg border border-gray-200">
                              <span className="font-semibold text-purple-600 mr-2">{day}:</span>
                              <span className="text-gray-700 text-sm">{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Metas Semanais */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Metas Semanais</h3>
              <div className="space-y-3">
                {studyPlan.weeklyGoals.map((goal, idx) => (
                  <div key={idx} className="flex items-start p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <span className="font-bold text-green-600 mr-3">{idx + 1}.</span>
                    <span className="text-gray-700">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendações */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Recomendações Importantes</h3>
              <ul className="space-y-2">
                {studyPlan.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start p-3 hover:bg-blue-50 rounded-lg transition">
                    <span className="text-blue-500 mr-3 text-xl">→</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dicas de Estudo */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-8 border-2 border-yellow-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">✨ Dicas Para Maximizar Seu Aprendizado</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {studyPlan.studyTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}