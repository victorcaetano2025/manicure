"use client";

// 💡 Adicionando 'urlImagem' e o prop 'children'
export default function Post({ idPost, titulo, descricao, urlImagem, author, data, children }) {
  
  // Formata a data para exibição (necessário pois 'data' vem como string ISO)
  const displayDate = data 
    ? new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) 
    : 'Data desconhecida';
  
  return (
    <div className="p-4 mb-6 border border-gray-200 rounded-lg shadow-md bg-white">
      
      {/* 💡 Exibição da Imagem (Condicional) */}
      {urlImagem && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img 
            src={urlImagem} 
            alt={`Imagem do post: ${titulo}`} 
            className="w-full h-auto object-cover max-h-96"
          />
        </div>
      )}

      <h2 className="font-bold text-gray-800 text-xl mb-2">{titulo}</h2>
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{descricao}</p>
      
      <div className="flex justify-between items-end border-t pt-3 mt-3 text-sm text-gray-500">
        
        {/* Informações do Autor e Data */}
        <div className="flex flex-col">
            <p className="font-medium text-pink-600">Por: {author}</p>
            <p className="text-xs mt-1">Publicado em: {displayDate}</p>
        </div>
        
        {/* 💡 BOTÕES DE AÇÃO: Renderiza o children passado (Editar/Deletar) */}
        {children && (
            <div className="flex space-x-2">
                {children}
            </div>
        )}
      </div>
    </div>
  );
}