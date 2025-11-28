"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

// Componentes
import Feed from "./component/post/Feed";
import AuthPage from "./component/auth/AuthPage";
import FeedUsuarios from "./component/friend/FeedUsarios";

// Utils
import { logout } from "./utils/api";

export default function Home() {
    const [authModal, setAuthModal] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        setIsLogged(!!token);
    }, []);

    const handleLogout = () => {
        logout();
        setIsLogged(false);
        setAuthModal(true);
    };

    const irPara = (url) => {
        router.push(url);
    };

    return (
        <div className="p-4 mx-auto max-w-screen-xl min-h-screen bg-white dark:bg-black">

            {/* Modal de Autenticação */}
            {authModal && (
                <AuthPage
                    onClose={() => {
                        setAuthModal(false);
                        if(localStorage.getItem("token")) setIsLogged(true);
                    }}
                />
            )}

            {/* Cabeçalho */}
            <header className="flex flex-col md:flex-row justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800 mb-8 gap-4 bg-white dark:bg-black">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
                    <span className="text-3xl">💅</span>
                    <h1 className="text-3xl font-extrabold text-pink-600 tracking-tight">Belanetic</h1>
                </div>

                {/* Barra de Pesquisa */}
                <div className="relative w-full md:w-96">
                    <input 
                        type="text" 
                        placeholder="Pesquisar..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black placeholder-gray-400"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>

                <div className="flex items-center space-x-3">
                    <button onClick={() => irPara('/agendamentos')} className="text-gray-600 hover:text-pink-600 font-semibold py-2 px-4 transition dark:text-gray-300">📅 Agendar</button>
                    <button onClick={() => irPara('/posts')} className="text-gray-600 hover:text-pink-600 font-semibold py-2 px-4 transition dark:text-gray-300">📷 Feed</button>
                    <button onClick={() => irPara('/perfil')} className="text-gray-600 hover:text-pink-600 font-semibold py-2 px-4 transition dark:text-gray-300">👤 Perfil</button>

                    {isLogged ? (
                        <button onClick={handleLogout} className="bg-red-50 text-red-500 px-5 py-2 rounded-full font-bold hover:bg-red-500 hover:text-white transition">Sair</button>
                    ) : (
                        <button onClick={() => setAuthModal(true)} className="bg-pink-600 text-white px-6 py-2 rounded-full font-bold hover:bg-pink-700 transition">Entrar</button>
                    )}
                </div>
            </header>

            {/* Layout Principal */}
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Menu Esquerdo */}
                <div className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-4 bg-pink-50 rounded-2xl p-6 border border-pink-100">
                        <h3 className="font-bold text-pink-800 mb-2">Bem-vindo(a)! ✨</h3>
                        <p className="text-sm text-pink-600 mb-4">Gerencie seus horários e posts.</p>
                        {!isLogged && <button onClick={() => setAuthModal(true)} className="w-full bg-white text-pink-600 font-bold py-2 rounded-lg shadow-sm">Começar</button>}
                    </div>
                </div>

                {/* Feed Central */}
                <div className="col-span-1 lg:col-span-6">
                    <Feed />
                </div>

                {/* Sugestões Direita */}
                <div className="col-span-1 lg:col-span-3">
                    <div className="sticky top-4">
                        <FeedUsuarios />
                    </div>
                </div>

            </main>
        </div>
    );
}