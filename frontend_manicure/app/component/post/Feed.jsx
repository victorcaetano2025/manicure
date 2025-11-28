"use client";

import { useEffect, useState, useCallback } from "react";
import { apiGetPosts } from "../../utils/api";
import Post from "./Post";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(() => {
    setLoading(true);
    setError("");
    
    apiGetPosts()
      .then(data => {
          // Garante que é um array
          if (Array.isArray(data)) setPosts(data);
          else setPosts([]);
      })
      .catch(err => {
          console.error(err);
          setError("Não foi possível carregar o feed.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // --- 1. Loading Bonito (Skeleton) ---
  if (loading) return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
        {[1, 2].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-96 animate-pulse"></div>
        ))}
    </div>
  );

  // --- 2. Estado de Erro (Botão de Tentar Novamente) ---
  if (error) return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
        <p className="text-red-600 font-medium mb-4">Ocorreu um erro ao buscar os posts.</p>
        <button onClick={fetchPosts} className="bg-red-500 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition">
            Tentar Novamente
        </button>
    </div>
  );

  // --- 3. Estado Vazio (Sem Posts) ---
  if (!posts.length) return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-center border border-gray-100 dark:border-gray-700">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Tudo calmo por aqui</h3>
        <p className="text-gray-500 mb-6">Ainda não há publicações no momento.</p>
        <button onClick={fetchPosts} className="bg-pink-100 text-pink-600 px-6 py-2 rounded-full font-bold hover:bg-pink-200 transition">
            Atualizar Página
        </button>
    </div>
  );

  // --- 4. Feed Normal ---
  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto p-4 pb-20">
      {/* Botão flutuante de atualizar (opcional, bom para UX) */}
      <div className="flex justify-end">
        <button onClick={fetchPosts} className="text-xs font-bold text-gray-400 hover:text-pink-600 flex items-center gap-1 transition">
            🔄 Atualizar
        </button>
      </div>

      {posts.map(post => {
        const { authorNome, ...rest } = post;
        return <Post key={post.idPost} author={authorNome} {...rest} />;
      })}
    </div>
  );
}