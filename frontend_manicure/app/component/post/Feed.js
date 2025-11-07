"use client";

import React, { useEffect, useState } from "react";
import Post from "./Post";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      const token = localStorage.getItem("token"); // pega token do login
      if (!token) {
        setError("Usuário não autenticado");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/posts", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // passa token no header
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar posts");
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <p>Carregando posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (posts.length === 0) return <p>Nenhum post encontrado.</p>;

  return (
    <div>
      <h1>Feed</h1>
      {posts.map((post) => (
        <Post
          key={post.idPost}
          title={post.titulo}
          content={post.descricao}
          author={post.author.nome} // mostra o nome do usuário
        />
      ))}
    </div>
  );
}
