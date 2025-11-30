"use client"

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
// Presume que AuthPage e logout estão em locais acessíveis
import AuthPage from '../app/component/auth/AuthPage'; // Ajuste o caminho conforme necessário
import { logout } from '../app/utils/api'; // Ajuste o caminho conforme necessário

export default function Hedo() {
    const [authModal, setAuthModal] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        setIsLogged(!!token);
    }, []);

    const handleLogout = () => { logout(); 
                                setIsLogged(false);
                                window.location.reload();
                                irPara('/');    
                            };
    const irPara = (url) => {
        if (!isLogged && (url.includes('agendamentos') || url.includes('perfil') || url.includes('/perfil'))) {
            setAuthModal(true); return;
        }
        router.push(url);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && search.trim()) {
            router.push(`/pesquisa?q=${encodeURIComponent(search)}`);
        }
    };

    return (
        <>
            {authModal && <AuthPage onClose={() => { setAuthModal(false); if (typeof window !== 'undefined' && localStorage.getItem("token")) setIsLogged(true); }} />}

            <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => irPara('/')}>
                    <span className="text-3xl">💅</span>
                    <h1 className="text-2xl font-extrabold text-pink-600">Belanetic</h1>
                </div>

                <div className="relative w-full md:w-96 my-2 md:my-0">
                    <input type="text" placeholder="Pesquisar..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full py-2 px-4 pl-10 focus:ring-2 focus:ring-pink-500 placeholder-gray-400" />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>

                <div className="flex items-center space-x-3">
                    <button onClick={() => irPara('/agendamentos')} className="hover:text-pink-600 font-semibold px-3 py-2">📅 Agenda</button>
                    <button onClick={() => irPara('/posts')} className="hover:text-pink-600 font-semibold px-3 py-2">📷 Feed</button>
                    <button onClick={() => irPara('/perfil')} className="hover:text-pink-600 font-semibold px-3 py-2">👤 Perfil</button>
                    {isLogged ?
                        <button onClick={handleLogout} className="text-red-500 border border-red-200 px-4 py-1 rounded-full hover:bg-red-50">Sair</button> :
                        <button onClick={() => setAuthModal(true)} className="bg-pink-600 text-white px-5 py-2 rounded-full hover:bg-pink-700">Entrar</button>
                    }
                </div>
            </header>
        </>
    );
}