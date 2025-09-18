import React from 'react';

export default function Footer() {
  return (
    <footer className="px-6 py-10 bg-gray-100 text-gray-600">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold text-purple-600 mb-2">SIMPAT ia</h3>
          <p className="text-sm">A nova forma de aprender com o poder da IA.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Módulos</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contato</h4>
          <p className="text-sm">email@exemplo.com</p>
        </div>
      </div>
      <p className="text-center text-xs mt-6 text-gray-400">
        © {new Date().getFullYear()} SIMPAT ia - Todos os direitos reservados.
      </p>
    </footer>
  );
}
