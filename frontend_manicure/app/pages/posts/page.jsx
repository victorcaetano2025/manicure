"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { getToken } from "../../utils/api";
import MyFeed from "../../component/post/MyFeed"; 
import CreatePostComponent from "../../component/post/CreatePost";
import UpdatePost from "../../component/post/UpdatePost"; // 💡 NOVO: Importando o componente de edição

export default function PostsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // 💡 NOVOS ESTADOS PARA EDIÇÃO
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Gatilho para recarregar o MyFeed
    const router = useRouter();

    // 💡 Lógica de Verificação de Login e Redirecionamento
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!getToken()) {
                alert("Você precisa estar logado para gerenciar seus posts.");
                router.push('/');
            } else {
                setIsAuthenticated(true);
            }
        }
    }, [router]);

    // Função genérica para fechar todos os modais e atualizar o feed
    const handleSuccess = useCallback(() => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setPostToEdit(null);
        // Incrementa o gatilho para forçar o MyFeed a recarregar seus dados
        setRefreshTrigger(prev => prev + 1); 
        alert("Operação concluída com sucesso!");
    }, []);

    // 💡 FUNÇÃO PASSADA PARA MyFeed para abrir o modal de Edição
    const openEditModal = (post) => {
        setPostToEdit(post);
        setIsEditModalOpen(true);
    };

    // Mostra um estado de carregamento enquanto verifica o token
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl text-pink-600">Carregando e verificando autenticação...</p>
            </div>
        );
    }

    return (
        <>
            <header className="bg-pink-600 text-white p-4">
                <div className="max-w-screen-xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Meus Posts e Gerenciamento ⚙️</h1>
                    
                    <div className="flex items-center space-x-4">
                        {/* BOTÃO PARA ABRIR O MODAL DE CRIAÇÃO */}
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                        >
                            + Novo Post
                        </button>

                        {/* BOTÃO DE VOLTAR */}
                        <Link 
                            href="/" 
                            className="text-white border border-white px-3 py-1 rounded-lg hover:bg-white hover:text-pink-600 transition flex items-center space-x-1"
                        >
                            Voltar ao Feed
                        </Link>
                    </div>
                </div>
            </header>
            
            <main className="p-6 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold mb-4">Seus Trabalhos Publicados</h2>
                {/* 💡 PASSANDO A FUNÇÃO DE ABERTURA DE MODAL E O GATILHO DE RECARGA */}
                <MyFeed 
                    onEdit={openEditModal} 
                    refreshTrigger={refreshTrigger} 
                />
            </main>

            {/* MODAL DE CRIAÇÃO DE POST */}
            {isCreateModalOpen && (
                <ModalBackdrop onClose={() => setIsCreateModalOpen(false)}>
                    <CreatePostComponent onSuccess={handleSuccess} />
                </ModalBackdrop>
            )}

            {/* 💡 MODAL DE EDIÇÃO DE POST */}
            {isEditModalOpen && postToEdit && (
                <ModalBackdrop onClose={() => setIsEditModalOpen(false)}>
                    <UpdatePost 
                        post={postToEdit} 
                        onClose={() => setIsEditModalOpen(false)} 
                        onSuccess={handleSuccess} 
                    />
                </ModalBackdrop>
            )}
        </>
    );
}

// 💡 Componente auxiliar para o Backdrop do Modal (reaproveitável)
function ModalBackdrop({ children, onClose }) {
    return (
        <div 
            id="modal-backdrop-generic"
            onClick={(e) => { 
                if (e.target.id === 'modal-backdrop-generic') onClose();
            }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6 relative">
                 {/* Botão de fechar */}
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}