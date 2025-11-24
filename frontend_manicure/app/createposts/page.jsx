"use client";

import CreatePostComponent from "../component/post/CreatePost"; // Ajuste o caminho conforme sua estrutura
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../utils/api";
import Link from "next/link"; 

export default function CreatePosts() {
  const router = useRouter();

  // Redireciona se não estiver logado
  useEffect(() => {
    if (typeof window !== 'undefined' && !getToken()) { 
      alert("Você precisa estar logado para criar um post.");
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <header className="bg-pink-600 text-white p-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Publicar um Novo Trabalho 💅</h1>
          
          {/* BOTÃO DE VOLTAR */}
          <Link 
            href="/" // Volta para a raiz (Home)
            className="text-white border border-white px-3 py-1 rounded-lg hover:bg-white hover:text-pink-600 transition flex items-center space-x-1"
          >
            {/* Ícone de voltar */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Voltar ao Feed</span>
          </Link>
        </div>
      </header>
      
      <main className="p-6">
        {/* O componente que contém o formulário de criação de post */}
        <CreatePostComponent />
      </main>
    </>
  );
}