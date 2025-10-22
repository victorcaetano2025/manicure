"use client";

import React, { useEffect, useState } from 'react';
import Post from './Post';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('https://sua-api.com/posts'); // Substitua pela sua API real
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Erro ao buscar os posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <p>Carregando posts...</p>;

  if (posts.length === 0) return <p>Nenhum post encontrado.</p>;

  return (
    <div>
      <h1>Feed</h1>

      {posts.map((post) => (
        <Post
          key={post.id}
          title={post.title}
          content={post.content}
          author={post.author}
        />
      ))}
    </div>
  );
}
