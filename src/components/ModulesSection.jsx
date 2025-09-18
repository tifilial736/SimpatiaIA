import React from 'react';

const modules = [
  {
    title: 'Gerador de Planos de Aulas',
    desc: 'Gere planos de ensino detalhados para qualquer atividade, ajudando o aluno a organizar seus estudos rapidamente.',
  },
  {
    title: 'Controle de Disciplinas',
    desc: 'Organize suas disciplinas e receba sugestões de estudo, sem coletar dados pessoais.',
  },
  {
    title: 'Módulos Especiais',
    desc: 'Explore conteúdos complementares para expandir seu conhecimento de forma prática.',
  },
];

export default function ModulesSection() {
  return (
    <section className="w-full py-16 bg-neutral-50">
      <div className="px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Conheça todos os <span className="text-primary">módulos</span>!
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((m, i) => (
            <div
              key={i}
              className="p-6 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
            >
              <h3 className="text-xl font-semibold text-purple-600 mb-2">
                {m.title}
              </h3>
              <p className="text-gray-600">{m.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-[#4904C8] text-white font-semibold rounded-xl hover:bg-[#3703A0] transition-shadow shadow-lg hover:shadow-xl">
            Conheça os módulos
          </button>
        </div>
      </div>
    </section>
  );
}
