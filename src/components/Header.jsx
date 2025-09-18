import React from 'react';
import SimpatIaImg from '../assets/SimpatIa.png'; // ajuste o caminho se necessário

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={SimpatIaImg} alt="SIMPATia" className="h-10 w-auto" />
      </div>

      {/* Botão */}
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Entrar
      </button>
    </header>
  );
}
