"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Feed from "./component/post/Feed";
import AuthPage from "./component/auth/AuthPage";
import FeedUsuarios from "./component/friend/FeedUsarios";

import { logout } from "./utils/api"; // importa logout
import { useRouter } from 'next/navigation';

export default function Home() {
  const [authModal, setAuthModal] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthModal(true);
      setIsLogged(false);
    } else {
      setIsLogged(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setIsLogged(false);
    setAuthModal(true);
  };

  const irPara = () => {
    // 3. Use router.push() para mudar a rota
    router.push('/pages/posts');
  };

  return (
    // 1. CONTAINER PRINCIPAL: Define largura máxima (xl) e centraliza a página (mx-auto).
    <div className="p-4 mx-auto max-w-screen-xl min-h-screen">

      {/* Modal de login/cadastro */}
      {authModal && (
        <AuthPage
          onClose={() => {
            setAuthModal(false);
            setIsLogged(true);
          }}
        />
      )}

      {/* Conteúdo da Home */}
      {!authModal && (
        <>
          <header className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700 mb-8">
            <h1 className="text-3xl font-extrabold text-pink-600">Manicure Social 💅</h1>
            <div>
              <button
                onClick={irPara}
                className="bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-pink-700 transition mr-[25px]"
              >
                Criar Novo Post
              </button>

              {isLogged ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition shadow-md"
                >
                  Sair
                </button>
              ) : (
                <button
                  onClick={() => setAuthModal(true)}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600 transition shadow-md"
                >
                  Entrar / Cadastrar
                </button>
              )}
            </div>
          </header>

          {/* 2. LAYOUT DE 3 COLUNAS: Define o grid principal para centralizar o feed. 
               - grid-cols-5: Usando 5 colunas para uma divisão 1/3/1 (20%/60%/20%)
          */}
          <main className="grid grid-cols-5 gap-8">

            {/* COLUNA ESQUERDA (1/5) - Navegação/Outro Conteúdo */}
            <div className="hidden lg:block col-span-1">
              <h2 className="text-lg font-semibold mb-3">Navegação</h2>
              <nav className="mt-6">
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition">
                      Sobre
                    </Link>
                  </li>
                  <li></li>
                  {/* Adicione links para Postar, Perfil, etc. */}
                </ul>
              </nav>
            </div>

            {/* COLUNA CENTRAL (3/5) - FEED PRINCIPAL */}
            {/* O Feed ocupará 3 das 5 colunas, ficando no meio e sendo o mais largo. */}
            <div className="col-span-5 lg:col-span-3">
              {/* CORREÇÃO: Usando classes Tailwind para cor e remoção do estilo inline incorreto */}
              <div className="text-gray-800 dark:text-gray-100">
                <Feed />
              </div>
               <FeedUsuarios />
            </div>

            {/* COLUNA DIREITA (1/5) - Outro Tipo de Feed (Tendências) */}
            <div className="hidden lg:block col-span-1">
              <h2 className="text-lg font-semibold mb-3">Tendências</h2>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
                {/* Conteúdo de Tendências, Sugestões, etc. */}
                <p className="text-sm text-gray-500 dark:text-gray-400">Posts populares da semana.</p>
              </div>
             
            </div>
          </main>
        </>
      )}
    </div>
  );
}