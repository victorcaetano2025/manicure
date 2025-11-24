"use client";

import { useEffect, useState, useCallback } from "react";
import { apiGetPosts } from "../../utils/api";
import Post from "./Post";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Usamos useCallback para garantir que fetchPosts seja estável (evitando re-render desnecessário)
  const fetchPosts = useCallback(() => {
    setLoading(true);
    setError("");
    
    apiGetPosts()
      .then(data => setPosts(data || []))
      .catch(err => setError(err.message || "Erro ao carregar o feed."))
      .finally(() => setLoading(false));
  }, []);

  // Carregar posts na montagem
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // fetchPosts é estável graças ao useCallback

  // --- Renderização de Status ---
  if (loading) return <p className="text-center mt-8 text-pink-600">Carregando posts...</p>;
  if (error) return <p className="text-red-500 text-center mt-8 p-3 bg-red-100 rounded-lg">Erro: {error}</p>;
  if (!posts.length) return <p className="text-center mt-8 text-gray-500">Nenhum post encontrado</p>;

  // --- Renderização do Feed ---
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4">
      <button
        onClick={fetchPosts}
        className="self-end bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-700 transition w-40"
      >
        Recarregar 🔄
      </button>

      {posts.map(post => {
        // Desestruturamos 'authorNome' e usamos 'rest' para pegar o restante do objeto
        const { authorNome, ...rest } = post;
        
        return (
          // 💡 USO DO SPREAD E MAPEAMENTO
          // {...rest} passa idPost, titulo, descricao, urlImagem, data (tudo, exceto authorNome)
          // author={authorNome} mapeia o nome do autor corretamente
          <Post 
            key={post.idPost} 
            author={authorNome} 
            {...rest}
          />
        );
      })}
    </div>
  );
}