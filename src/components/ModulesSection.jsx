import React from 'react';

const modules = [
  {
    title: 'Gerador de Planos de Aulas',
    desc: 'Monte planos completos de estudo de forma automática.',
  },
  {
    title: 'Controle de Disciplinas',
    desc: 'Organize suas disciplinas e receba sugestões personalizadas.',
  },
  {
    title: 'Módulos Especiais',
    desc: 'Expanda seu conhecimento com conteúdos complementares.',
  },
];

export default function ModulesSection() {
  return (
    <section className="w-full py-16 bg-gradient-to-r from-white via-gray-50 to-white">
      <div className="px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center">
          Conheça todos os <span className="text-blue-600">módulos</span>!
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {modules.map((m, i) => (
            <div
              key={i}
              className="p-6 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
            >
              <h3 className="text-xl font-semibold text-purple-600">
                {m.title}
              </h3>
              <p className="mt-2 text-gray-600">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
