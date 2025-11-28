import React from "react";

export default function Post({ titulo, descricao, urlImagem, data, author }) {
  
  const dataFormatada = new Date(data).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
      
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                {author ? author.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="leading-tight">
                <p className="font-bold text-gray-900 dark:text-white text-sm">{author || "Anônimo"}</p>
                <p className="text-xs text-gray-400">{dataFormatada}</p>
            </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">•••</button>
      </div>

      {/* IMAGEM (Se existir) */}
      {urlImagem && (
        <div className="w-full bg-gray-50 relative group">
            <img 
                src={urlImagem} 
                alt={titulo} 
                className="w-full h-auto object-cover max-h-[600px]"
                onError={(e) => e.target.style.display = 'none'} 
            />
        </div>
      )}

      {/* CONTEÚDO */}
      <div className="p-4">
        {/* Ícones de Ação */}
        <div className="flex items-center gap-4 mb-3 text-2xl text-gray-700 dark:text-gray-300">
            <button className="hover:text-pink-600 hover:scale-110 transition">♡</button>
            <button className="hover:text-blue-500 hover:scale-110 transition">💬</button>
            <button className="hover:text-green-500 hover:scale-110 transition">➤</button>
        </div>

        {/* Título e Legenda - AQUI ESTAVA O PROBLEMA VISUAL ANTES */}
        <div className="flex flex-col gap-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
                {titulo}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                <span className="font-semibold mr-2 text-black dark:text-white">{author}</span>
                {descricao}
            </p>
        </div>

        {/* Simulação de Comentários */}
        <p className="text-gray-400 text-xs mt-3 cursor-pointer hover:text-gray-600">
            Ver todos os 12 comentários
        </p>
      </div>
    </div>
  );
}