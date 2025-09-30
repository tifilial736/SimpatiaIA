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

  const calculateDaysAvailable = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Cliente OpenAI - descomente e configure sua API key
  // const client = new OpenAI({
  //   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  //   dangerouslyAllowBrowser: true,
  // });

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

    setIsGenerating(true);

    try {
      const totalHoursAvailable = daysAvailable * parseInt(dailyHours);
      
      // SIMULAÇÃO INTELIGENTE - Para usar OpenAI real, veja instruções no final do código
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const parsedPlan = {
        discipline: discipline,
        knowledgeLevel: knowledgeLevel,
        dailyHours: parseInt(dailyHours),
        daysAvailable: daysAvailable,
        totalDuration: daysAvailable <= 3 
          ? `${totalHoursAvailable} horas` 
          : daysAvailable <= 7 
          ? `${daysAvailable} dias` 
          : `${Math.ceil(daysAvailable / 7)} semanas`,
        urgencyLevel: daysAvailable <= 1 
          ? "crítico" 
          : daysAvailable <= 3 
          ? "urgente" 
          : daysAvailable <= 21 
          ? "moderado" 
          : "confortável",
        realityCheck: daysAvailable <= 1
          ? `Com apenas ${totalHoursAvailable}h disponíveis, não será possível dominar toda a matéria. Foque em revisar os tópicos mais importantes e fazer exercícios típicos de prova.`
          : daysAvailable <= 3
          ? `Tempo muito limitado! Foque apenas no essencial: fórmulas principais, conceitos-chave e exercícios mais comuns. Priorize qualidade sobre quantidade.`
          : daysAvailable <= 7
          ? `Uma semana é suficiente para uma revisão sólida se você mantiver disciplina. Distribua bem o tempo entre teoria e prática.`
          : `Você tem tempo adequado para estudar com profundidade. Mantenha a consistência e alcançará ótimos resultados!`,
        studyGoal: studyGoal,
        modules: daysAvailable <= 3 ? [
          {
            title: "Revisão Intensiva - Tópicos Essenciais",
            duration: `${Math.floor(totalHoursAvailable * 0.6)}h`,
            topics: [
              "Conceitos fundamentais mais cobrados",
              "Fórmulas e teoremas principais",
              "Exemplos clássicos de prova"
            ],
            resources: [
              { type: "PDF", name: "Resumo esquemático da matéria", priority: "alta" },
              { type: "Vídeo", name: "Revisão rápida 30min - YouTube", priority: "alta" }
            ],
            dailySchedule: {
              "Hoje": "Revisar teoria essencial - 2h",
              "Amanhã": "Exercícios típicos de prova - 2h"
            }
          },
          {
            title: "Prática e Simulação",
            duration: `${Math.floor(totalHoursAvailable * 0.4)}h`,
            topics: [
              "Questões de provas anteriores",
              "Exercícios mais frequentes",
              "Macetes e atalhos importantes"
            ],
            resources: [
              { type: "Exercícios", name: "Lista de questões de provas anteriores", priority: "alta" },
              { type: "Simulado", name: "Mini-simulado cronometrado", priority: "média" }
            ],
            dailySchedule: {
              "Hoje": "Resolver exercícios - 1h30",
              "Amanhã": "Simulado rápido - 1h"
            }
          }
        ] : [
          {
            title: "Fundamentos e Base Teórica",
            duration: daysAvailable <= 7 ? "Dias 1-2" : "Semana 1",
            topics: [
              "Conceitos introdutórios",
              "Definições e terminologia",
              "Teoremas fundamentais",
              "Exemplos básicos"
            ],
            resources: [
              { type: "Vídeo", name: "Playlist introdutória - Khan Academy", priority: "alta" },
              { type: "PDF", name: "Apostila básica da disciplina", priority: "alta" },
              { type: "Exercícios", name: "Lista 1 - Exercícios básicos", priority: "média" }
            ],
            dailySchedule: {
              "Segunda": "Estudo teórico - 2h",
              "Terça": "Exercícios de fixação - 1h30",
              "Quarta": "Revisão e dúvidas - 1h"
            }
          },
          {
            title: "Aprofundamento e Prática",
            duration: daysAvailable <= 7 ? "Dias 3-5" : "Semanas 2-3",
            topics: [
              "Conceitos intermediários",
              "Resolução de problemas complexos",
              "Aplicações práticas",
              "Estudos de caso"
            ],
            resources: [
              { type: "Vídeo", name: "Aulas práticas - YouTube", priority: "alta" },
              { type: "Livro", name: "Capítulos 3-5 do livro-texto", priority: "média" },
              { type: "Exercícios", name: "Lista 2 - Exercícios intermediários", priority: "alta" }
            ],
            dailySchedule: {
              "Segunda": "Teoria avançada - 2h",
              "Quarta": "Exercícios práticos - 2h",
              "Sexta": "Projeto/Estudo de caso - 1h30"
            }
          },
          {
            title: "Consolidação e Preparação Final",
            duration: daysAvailable <= 7 ? "Dias 6-7" : "Última semana",
            topics: [
              "Revisão geral de todos os módulos",
              "Simulados completos",
              "Questões de provas anteriores",
              "Resolução de dúvidas finais"
            ],
            resources: [
              { type: "Simulado", name: "Prova modelo completa", priority: "alta" },
              { type: "PDF", name: "Resumo geral da disciplina", priority: "alta" },
              { type: "Exercícios", name: "Questões mais difíceis", priority: "média" }
            ],
            dailySchedule: {
              "Segunda": "Revisão módulo 1 - 2h",
              "Quarta": "Simulado completo - 3h",
              "Sexta": "Revisão final - 2h"
            }
          }
        ],
        weeklyGoals: daysAvailable <= 3 ? [
          `Revisar os ${totalHoursAvailable < 6 ? '3-5' : '5-8'} tópicos mais importantes`,
          "Resolver pelo menos 20 exercícios típicos de prova",
          "Identificar e focar nos pontos fracos"
        ] : [
          "Semana 1: Dominar fundamentos e completar 50% dos exercícios básicos",
          "Semana 2-3: Aprofundar conhecimento e resolver 80% dos exercícios intermediários",
          "Última semana: Revisão geral e simulados - estar 90% preparado"
        ],
        recommendations: [
          daysAvailable <= 3 
            ? "Elimine TODAS as distrações - este é o momento crucial"
            : "Estude sempre no mesmo horário para criar rotina",
          "Faça pausas de 5-10 minutos a cada hora",
          daysAvailable <= 3
            ? "Foque APENAS nos tópicos que têm mais chance de cair"
            : "Revise os conceitos no dia seguinte (revisão espaçada)",
          "Durma bem - seu cérebro precisa consolidar o aprendizado",
          `Total de ${totalHoursAvailable}h disponíveis até ${deadline}`
        ],
        studyTips: [
          "📝 Técnica Pomodoro: 25min foco + 5min pausa",
          "🎯 Faça resumos com suas próprias palavras",
          daysAvailable <= 3 
            ? "⚡ Priorize exercícios sobre teoria neste momento"
            : "💪 Pratique exercícios ANTES de achar que dominou a teoria",
          "🔄 Ensine alguém - melhor forma de fixar",
          "📱 Mantenha o celular longe durante o estudo"
        ],
        priorityTopics: daysAvailable <= 7 ? [
          "Conceitos mais cobrados em provas",
          "Fórmulas e teoremas principais",
          "Tipos de exercícios mais comuns",
          "Erros frequentes a evitar"
        ] : []
      };
      
      setStudyPlan(parsedPlan);
    } catch (error) {
      console.error("Erro ao gerar plano de estudo:", error);
      alert("Erro ao gerar plano de estudo. Tente novamente.");
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
Urgência: ${studyPlan.urgencyLevel}

${studyPlan.realityCheck ? `
AVALIAÇÃO REALISTA:
${studyPlan.realityCheck}
` : ''}

${studyPlan.priorityTopics ? `
TÓPICOS PRIORITÁRIOS:
${studyPlan.priorityTopics.map(t => `- ${t}`).join('\n')}
` : ''}

MÓDULOS:
${studyPlan.modules.map((module, i) => `
${i + 1}. ${module.title} (${module.duration})
   Tópicos:
   ${module.topics.map(t => `   - ${t}`).join('\n')}
   
   ${module.resources ? `Recursos (por prioridade):
   ${module.resources.map(r => `   [${r.priority.toUpperCase()}] ${r.type}: ${r.name}`).join('\n')}` : ''}
   
   Cronograma:
   ${Object.entries(module.dailySchedule || module.weeklySchedule || {}).map(([day, task]) => `   ${day}: ${task}`).join('\n')}
`).join('\n')}

METAS:
${studyPlan.weeklyGoals.map(g => `- ${g}`).join('\n')}

RECOMENDAÇÕES:
${studyPlan.recommendations.map(r => `- ${r}`).join('\n')}

DICAS DE ESTUDO:
${studyPlan.studyTips.map(t => `${t}`).join('\n')}
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
    
    const urgency = studyPlan.urgencyLevel?.toLowerCase() || '';
    if (urgency.includes('crítico')) return 'from-red-600 to-orange-600';
    if (urgency.includes('urgente')) return 'from-orange-500 to-yellow-500';
    if (urgency.includes('moderado')) return 'from-blue-500 to-cyan-500';
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
              Plano de Estudo <span className="text-purple-600">Inteligente</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Crie um plano personalizado com IA que se adapta ao seu tempo, conhecimento e objetivos.
            A IA ajusta o conteúdo de forma inteligente baseado no prazo disponível!
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
              {deadline && (
                <p className="text-sm text-gray-600 mt-2">
                  {calculateDaysAvailable() === 0 && "⚠️ Prova HOJE!"}
                  {calculateDaysAvailable() === 1 && "⚠️ Prova AMANHÃ!"}
                  {calculateDaysAvailable() > 1 && calculateDaysAvailable() <= 3 && `⚠️ ${calculateDaysAvailable()} dias - Urgente!`}
                  {calculateDaysAvailable() > 3 && `📅 ${calculateDaysAvailable()} dias disponíveis`}
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

          {/* Alerta informativo */}
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <strong>Inteligência Adaptativa:</strong> A IA vai analisar seu prazo e criar um plano realista. 
                Se a prova for em breve, você receberá um plano de revisão intensiva focado no essencial!
              </p>
            </div>
          </div>

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
                Gerar Plano de Estudo Inteligente
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
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/20 rounded-lg p-3">
                  <Clock className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Duração</div>
                  <div>{studyPlan.totalDuration}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Calendar className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Dias Disponíveis</div>
                  <div>{studyPlan.daysAvailable} dias</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Target className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Horas por Dia</div>
                  <div>{studyPlan.dailyHours}h diárias</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <TrendingUp className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Urgência</div>
                  <div className="capitalize">{studyPlan.urgencyLevel}</div>
                </div>
              </div>
            </div>

            {/* Avaliação Realista */}
            {studyPlan.realityCheck && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-yellow-900 mb-3 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  Avaliação Realista do Seu Tempo
                </h3>
                <p className="text-yellow-800 text-lg">{studyPlan.realityCheck}</p>
              </div>
            )}

            {/* Tópicos Prioritários */}
            {studyPlan.priorityTopics && studyPlan.priorityTopics.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-red-900 mb-3">🎯 FOQUE NESTES TÓPICOS PRIMEIRO</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {studyPlan.priorityTopics.map((topic, idx) => (
                    <div key={idx} className="flex items-center p-3 bg-white rounded-lg border-2 border-red-200">
                      <span className="font-bold text-red-600 mr-2">{idx + 1}.</span>
                      <span className="text-gray-800 font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

                    {/* Recursos por Prioridade */}
                    {module.resources && module.resources.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 mb-2">📚 Recursos (por prioridade):</h5>
                        <div className="space-y-2">
                          {module.resources
                            .sort((a, b) => {
                              const priority = { alta: 1, média: 2, media: 2, baixa: 3 };
                              return (priority[a.priority.toLowerCase()] || 3) - (priority[b.priority.toLowerCase()] || 3);
                            })
                            .map((resource, idx) => (
                              <div key={idx} className={`px-3 py-2 rounded-lg text-sm flex items-center ${
                                resource.priority.toLowerCase() === 'alta' 
                                  ? 'bg-red-100 border-l-4 border-red-500 text-red-800' 
                                  : resource.priority.toLowerCase() === 'média' || resource.priority.toLowerCase() === 'media'
                                  ? 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800'
                                  : 'bg-green-100 border-l-4 border-green-500 text-green-800'
                              }`}>
                                <span className="font-bold mr-2">[{resource.priority.toUpperCase()}]</span>
                                <span className="font-medium mr-2">{resource.type}:</span>
                                <span>{resource.name}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Cronograma */}
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">📅 Cronograma:</h5>
                      <div className="grid md:grid-cols-2 gap-2">
                        {Object.entries(module.dailySchedule || module.weeklySchedule || {}).map(([day, task], idx) => (
                          <div key={idx} className="flex items-center p-2 bg-white rounded-lg border border-gray-200">
                            <span className="font-semibold text-purple-600 mr-2">{day}:</span>
                            <span className="text-gray-700 text-sm">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metas */}
            {studyPlan.weeklyGoals && studyPlan.weeklyGoals.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Metas do Plano</h3>
                <div className="space-y-3">
                  {studyPlan.weeklyGoals.map((goal, idx) => (
                    <div key={idx} className="flex items-start p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <span className="font-bold text-green-600 mr-3">{idx + 1}.</span>
                      <span className="text-gray-700">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendações e Dicas */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recomendações */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Recomendações</h3>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">✨ Dicas de Estudo</h3>
                <div className="space-y-3">
                  {studyPlan.studyTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}