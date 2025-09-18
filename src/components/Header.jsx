import React from 'react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-blue-600">SIMPAT</span>
        <span className="text-2xl font-bold text-purple-600">ia</span>
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Entrar
      </button>
    </header>
  );
}
