"use client";

import { useEffect, useState } from "react";
import { apiGetPosts } from "../../utils/api";
import Post from "./Post";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Função para buscar posts
  const fetchPosts = () => {
    setLoading(true);
    setError("");
    apiGetPosts()
      .then(setPosts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Carregar posts na montagem
  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p>Carregando posts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!posts.length) return <p>Nenhum post encontrado</p>;

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={fetchPosts}
        className="self-end bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
      >
        Recarregar
      </button>

      {posts.map(post => {
        // 🚀 AJUSTE AQUI: Desestruturando e renomeando authorNome para author
        const { idPost, titulo, descricao, authorNome, data } = post;
        
        return (
          <Post 
            key={idPost} 
            titulo={titulo} 
            descricao={descricao}
            // Mapeia authorNome (do backend) para a prop author (esperada pelo componente Post)
            author={authorNome} 
            data={data} // É bom passar a data também, caso queira mostrá-la
          />
        );
      })}
      
      {/* ALTERNATIVA: Usar spread (...) e passar a renomeação */}
      {/* {posts.map(({ authorNome, ...rest }) => (
          <Post key={rest.idPost} author={authorNome} {...rest} />
      ))} */}
      
    </div>
  );
}
