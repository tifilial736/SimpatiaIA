import React, { useState } from 'react';

const faqs = [
  {
    q: 'Como funciona o gerador de planos?',
    a: 'Nosso sistema utiliza inteligência artificial avançada para analisar seu perfil de estudo e criar planos personalizados que se adaptam ao seu ritmo e objetivos. O algoritmo considera fatores como disponibilidade de tempo, dificuldade das matérias e seu histórico de desempenho.',
  },
  {
    q: 'Posso personalizar as disciplinas?',
    a: 'Absolutamente! Você tem controle total sobre suas disciplinas. Pode adicionar matérias específicas, definir prioridades, estabelecer metas de estudo e até mesmo importar conteúdo de diferentes fontes para criar um plano verdadeiramente personalizado.',
  },
  {
    q: 'É gratuito?',
    a: 'Oferecemos um plano gratuito robusto que inclui funcionalidades essenciais como criação de planos básicos e acompanhamento de progresso. Para recursos avançados como IA personalizada, relatórios detalhados e suporte prioritário, temos planos premium acessíveis.',
  },
  {
    q: 'Como acompanho meu progresso?',
    a: 'Nossa plataforma oferece dashboards intuitivos com métricas detalhadas, gráficos de evolução, streak de estudos e relatórios semanais. Você pode visualizar seu desempenho por matéria, identificar pontos de melhoria e celebrar suas conquistas.',
  },
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);
  const toggleItem = (index) => setOpenItem(openItem === index ? null : index);

  return (
    <section className="w-full py-16 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-600 text-lg">
            Encontre respostas para suas principais dúvidas
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-lg transition-all duration-300 ${
                openItem === index
                  ? 'bg-white shadow-lg'
                  : 'bg-white/90 hover:bg-white hover:shadow-md'
              }`}
            >
              {/* Question Button */}
              <button
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                onClick={() => toggleItem(index)}
              >
                <span
                  className={`text-lg font-medium transition-colors duration-200 ${
                    openItem === index ? 'text-gray-800' : 'text-gray-700'
                  }`}
                >
                  {faq.q}
                </span>

                {/* Smaller Plus/Minus Button */}
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-base transition-all duration-200 ${
                    openItem === index
                      ? 'bg-purple-700 hover:bg-purple-800'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {openItem === index ? '−' : '+'}
                </div>
              </button>

              {/* Answer */}
              {openItem === index && (
                <div className="px-6 pb-6">
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <p className="text-gray-700 leading-relaxed mt-4">
                      {faq.a}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-purple-700 rounded-2xl border border-purple-600 shadow-lg">
            <div className="text-white text-left">
              <p className="font-semibold text-lg">
                Não encontrou sua resposta?
              </p>
              <p className="text-purple-200 text-sm mt-1">
                Nossa equipe está pronta para ajudar!
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg">
              Fale Conosco
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
