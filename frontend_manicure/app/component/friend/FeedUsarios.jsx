"use client";

import React, { useEffect, useState, useCallback } from 'react';
import FriendItem from './FriendItem.jsx'; // 💡 CORREÇÃO: Usando o nome do arquivo exato e minúsculo
import { apiGetAllUsers, apiFollowUser, apiUnfollowUser } from "../../utils/api"; // 💡 CORREÇÃO: Ajuste no caminho da API (assumindo /src/utils/api)

// Removendo o AddIcon, pois usaremos um botão com texto dinâmico para melhor UX.

export default function FeedUsuarios() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 💡 Estado para gerenciar o status de seguimento localmente: { idUsuario: boolean }
    // O status inicial será falso, pois a apiGetAllUsers não fornece essa informação.
    const [localFollowStatus, setLocalFollowStatus] = useState({}); 

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // apiGetAllUsers deve retornar uma lista de objetos DTO de usuário (com 'idUsuario', 'nome', etc.)
            const data = await apiGetAllUsers();
            
            // Inicializa o status de follow localmente como 'não seguindo' para todos
            const initialStatus = {};
            (data || []).forEach(user => {
                // Assumimos que o ID é 'idUsuario' (padrão do backend)
                initialStatus[user.idUsuario] = false; 
            });

            setUsers(data || []);
            setLocalFollowStatus(initialStatus);

        } catch (err) {
            setError(err.message || "Erro ao carregar a lista de usuários.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // --- Funções de Ação: Seguir / Deixar de Seguir ---

    const handleToggleFollow = async (userId, isCurrentlyFollowing) => {
        setLoading(true); // Bloqueia a interface enquanto a requisição está em andamento
        
        try {
            if (isCurrentlyFollowing) {
                // Ação de Unfollow (Deixar de Seguir)
                await apiUnfollowUser(userId);
                
                // Atualiza o estado local para "não seguindo"
                setLocalFollowStatus(prev => ({
                    ...prev,
                    [userId]: false
                }));
                
            } else {
                // Ação de Follow (Seguir)
                await apiFollowUser(userId);
                
                // Atualiza o estado local para "seguindo"
                setLocalFollowStatus(prev => ({
                    ...prev,
                    [userId]: true
                }));
            }
        
        } catch (err) {
            // Exibe mensagem de erro do backend (ex: "Você já está seguindo este usuário")
            alert(`Falha na operação: ${err.message}`); 
            
        } finally {
            setLoading(false);
        }
    };

    // --- Renderização de Status ---

    if (loading) return <p className="text-center mt-8 text-indigo-600">Carregando usuários...</p>;
    if (error) return <p className="text-red-500 text-center mt-8 bg-red-100 p-3 rounded-lg">Erro: {error}</p>;
    if (users.length === 0) return <p className="text-center text-gray-500 mt-8">Nenhum novo usuário encontrado.</p>;


    // --- Renderização do Feed ---
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">Explorar Manicures e Seguidores</h2>
            
            <div className="space-y-4">
                {users.map(user => {
                    // Usa o campo 'idUsuario' do DTO
                    const userId = user.idUsuario;
                    // Verifica o status de seguimento local
                    const isFollowing = localFollowStatus[userId] || false; 

                    return (
                        <div 
                            key={userId} // Chave baseada no idUsuario
                            className="flex justify-between items-center p-3 border-b hover:bg-gray-50 transition rounded-md"
                        >
                            
                            {/* Componente FriendItem */}
                            <FriendItem friend={user} />
                            
                            {/* Botão de Seguir / Deixar de Seguir */}
                            <div className="w-28 flex justify-end">
                                <button 
                                    onClick={() => handleToggleFollow(userId, isFollowing)} 
                                    disabled={loading} // Desabilita enquanto qualquer requisição está em andamento
                                    className={`
                                        px-3 py-1 text-sm font-semibold rounded-full transition duration-150 whitespace-nowrap
                                        ${isFollowing 
                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Estilo "Seguindo"
                                            : 'bg-indigo-500 text-white hover:bg-indigo-600' // Estilo "Seguir"
                                        }
                                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {isFollowing ? 'Seguindo' : 'Seguir'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}