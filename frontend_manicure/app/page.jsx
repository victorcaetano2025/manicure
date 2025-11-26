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
        // 💡 ATENÇÃO: Em uma aplicação real, você deve usar um serviço de autenticação
        // baseado em cookie/session ou verificar o token com uma API para confirmar a validade.
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

    const irPara = (url) => {
    // A função pode ir para qualquer lugar que você passar
    router.push(url);
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
                        <h1 className="text-3xl font-extrabold text-pink-600">Belanetic 💅</h1>

                        <p>pesquisa</p>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => irPara('/pages/agendamentos')}
                                className="bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-pink-700 transition"
                            >
                                Agendamentos
                            </button>

                            <button
                                onClick={() => irPara('/pages/posts')}
                                className="bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-pink-700 transition"
                            >
                                Posts
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

                    {/* 2. LAYOUT AJUSTADO: Usando grid-cols-12 para maior flexibilidade (2/7/3) */}
                    <main className="grid grid-cols-12 gap-8 ">

                        {/* COLUNA ESQUERDA (2/12) - Navegação */}
                        <div className="hidden lg:block col-span-2">
                            <h2 className="text-lg font-semibold mb-3 text-gray-700">Navegação</h2>
                            <nav className="mt-6">
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition">
                                            Sobre
                                        </Link>
                                    </li>
                                    {/* Adicione links para Postar, Perfil, etc. */}
                                </ul>
                            </nav>
                        </div>

                        {/* COLUNA CENTRAL (7/12) - FEED PRINCIPAL */}
                        {/* Ocupa a largura total (col-span-12) em telas pequenas e 7 colunas em telas grandes (lg) */}
                        <div className="col-span-12 lg:col-span-7">
                            <div className="text-gray-800 dark:text-gray-100">
                                <Feed />
                            </div>
                        </div>

                        {/* COLUNA DIREITA (3/12) - Feed Usuários e Tendências */}
                        {/* Ocupa a largura total (col-span-12) em telas pequenas e 3 colunas em telas grandes (lg) */}
                        <div className="col-span-12 lg:col-span-3 space-y-8">
                            
                            {/* Feed de Usuários: Agora com mais espaço horizontal */}
                            <div className="p-2">
                                <FeedUsuarios />
                            </div>

                            {/* Tendências */}
                            <div>
                                <h2 className="text-lg font-semibold mb-3 text-gray-700">Tendências</h2>
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-inner">
                                    {/* Conteúdo de Tendências, Sugestões, etc. */}
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Posts populares da semana.</p>
                                </div>
                            </div>
                        </div>
                    </main>
                </>
            )}
        </div>
    );
}