import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudyPlanGenerator() {
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);

  // Função para simular a geração do plano de estudo pela IA
  const generateStudyPlan = async () => {
    if (!discipline.trim()) return;

    setIsGenerating(true);

    // Simulação de uma chamada à API de IA (substituir pela integração real)
    try {
      // Em uma implementação real, aqui você faria a chamada para sua API de IA
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simula delay de rede

      // Dados simulados - substituir pela resposta real da IA
      const simulatedPlan = {
        discipline: discipline,
        modules: [
          {
            title: 'Introdução e Fundamentos',
            topics: [
              'Visão geral da disciplina',
              'Conceitos básicos e terminologia',
              'Aplicações no mundo real',
            ],
            duration: '2 semanas',
          },
          {
            title: 'Tópicos Intermediários',
            topics: [
              'Aprofundamento teórico',
              'Estudos de caso',
              'Exercícios práticos',
            ],
            duration: '3 semanas',
          },
          {
            title: 'Aspectos Avançados',
            topics: [
              'Tópicos especializados',
              'Projetos aplicados',
              'Preparação para avaliações',
            ],
            duration: '3 semanas',
          },
          {
            title: 'Revisão e Consolidação',
            topics: [
              'Revisão geral dos conceitos',
              'Resolução de problemas complexos',
              'Preparação final',
            ],
            duration: '2 semanas',
          },
        ],
        totalDuration: '10 semanas',
        recommendations: [
          'Dedique pelo menos 5 horas por semana para estudo',
          'Participe de grupos de discussão',
          'Pratique com exercícios adicionais',
        ],
      };

      setStudyPlan(simulatedPlan);
    } catch (error) {
      console.error('Erro ao gerar plano de estudo:', error);
      alert('Ocorreu um erro ao gerar o plano de estudo. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gerador de Planos de Estudo com{' '}
            <span className="text-custom-purple">IA</span>
          </h1>
          <p className="text-lg text-gray-600">
            Digite o nome da disciplina e nossa inteligência artificial criará
            um plano de estudos personalizado para você.
          </p>
        </div>

        {/* Formulário de entrada */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              placeholder="Digite o nome da disciplina (ex: Cálculo I, Programação Web)"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
  onClick={generateStudyPlan}
  disabled={isGenerating || !discipline.trim()}
  className="px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isGenerating ? 'Gerando...' : 'Gerar Plano'}
</button>

          </div>
        </div>

        {/* Resultado do plano de estudo */}
        {studyPlan && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Plano de Estudo para:{' '}
              <span className="text-blue-600">{studyPlan.discipline}</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Duração total: {studyPlan.totalDuration}
            </p>

            <div className="space-y-6">
              {studyPlan.modules.map((module, index) => (
                <div
                  key={index}
                  className="border-l-4 border-purple-500 pl-4 py-2"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Módulo {index + 1}: {module.title}{' '}
                    <span className="text-sm font-normal text-gray-500">
                      ({module.duration})
                    </span>
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4">
                    {module.topics.map((topic, topicIndex) => (
                      <li key={topicIndex}>{topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {studyPlan.recommendations && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Recomendações de Estudo
                </h3>
                <ul className="list-disc list-inside text-blue-700 ml-4">
                  {studyPlan.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Botão de voltar */}
        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
