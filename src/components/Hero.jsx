import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 py-16 bg-gray-50">
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Uma nova forma de <span className="text-blue-600">aprender</span> com
          o poder da <span className="text-purple-600">IA</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Gere planos de ensino personalizados para suas disciplinas com
          inteligência artificial.
        </p>
        <button
          onClick={() => navigate('/study-plan')}
          className="mt-6 px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition"
        >
          Conheça os módulos
        </button>
      </div>
      <img
        src={heroImg}
        alt="Estudante"
        className="mt-10 md:mt-0 w-full md:w-1/2"
      />
    </section>
  );
}
