import React, { useState } from "react";

export default function StudyPlanGenerator() {
  const [discipline, setDiscipline] = useState("");
  const [dailyHours, setDailyHours] = useState("");
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

  const generateStudyPlan = async () => {
    if (!discipline || !dailyHours) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discipline, dailyHours }),
      });

      const data = await response.json();
      setStudyPlan(data);
    } catch (error) {
      console.error("Erro ao gerar plano de estudo:", error);
      alert("Ocorreu um erro. Veja o console.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Gerador de Planos de Estudo com IA
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Selecione a disciplina
            </label>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- Escolha uma disciplina --</option>
              {availableDisciplines.map((d, idx) => (
                <option key={idx} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Quantas horas por dia você pode estudar?
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
              placeholder="Ex: 2"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={generateStudyPlan}
            disabled={isGenerating || !discipline || !dailyHours}
            className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Gerando..." : "Gerar Plano"}
          </button>
        </div>

        {studyPlan && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Plano de Estudo para: <span className="text-blue-600">{studyPlan.discipline}</span>
            </h2>
            <p className="mb-6 text-gray-600">Duração total: {studyPlan.totalDuration}</p>

            <div className="space-y-6">
              {studyPlan.modules.map((module, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                  <h3 className="text-xl font-semibold mb-2">{module.title} 
                    <span className="text-sm font-normal text-gray-500"> ({module.duration})</span>
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4">
                    {module.topics.map((topic, idx) => <li key={idx}>{topic}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            {studyPlan.recommendations && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Recomendações</h3>
                <ul className="list-disc list-inside text-blue-700 ml-4">
                  {studyPlan.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
