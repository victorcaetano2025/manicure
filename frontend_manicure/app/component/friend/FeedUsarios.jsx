"use client";

import React, { useEffect, useState, useCallback } from 'react';
import FriendItem from './FriendItem'; // 💡 CORREÇÃO: Removendo a extensão .jsx na importação
import { 
    apiGetAllUsers, 
    apiFollowUser, 
    apiUnfollowUser, 
    apiGetFollowStatus 
} from "../../utils/api"; // O caminho relativo para a API é mantido

export default function FeedUsuarios() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para gerenciar o status de seguimento localmente: { idUsuario: boolean }
    const [localFollowStatus, setLocalFollowStatus] = useState({}); 

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Busca a lista de todos os usuários
            const data = await apiGetAllUsers();
            const userList = data || [];
            
            // 2. Cria um array de promessas para checar o status de seguimento de cada usuário
            const statusPromises = userList.map(user => 
                // Evita checar o status de seguimento se o ID for undefined ou null
                user.idUsuario ? apiGetFollowStatus(user.idUsuario) : Promise.resolve(false)
            );

            // 3. Espera o resultado de todas as checagens de status
            const followResults = await Promise.all(statusPromises);

            // 4. Constrói o estado inicial de seguimento com os dados reais
            const initialStatus = {};
            userList.forEach((user, index) => {
                // Seta o status real para o ID do usuário (true ou false)
                initialStatus[user.idUsuario] = followResults[index]; 
            });

            setUsers(userList);
            setLocalFollowStatus(initialStatus);

        } catch (err) {
            setError(err.message || "Erro ao carregar a lista de usuários ou status de seguimento.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // --- Funções de Ação: Seguir / Deixar de Seguir ---

    const handleToggleFollow = async (userId, isCurrentlyFollowing) => {
        // Define o loading específico apenas para o botão clicado
        // Para simplificar, vou manter o loading global por enquanto para evitar desabilitar todos os botões,
        // mas é ideal usar um estado de loading por ID para melhor UX.
        
        // Desabilita o botão enquanto a requisição está em andamento (loading global)
        if (loading) return; 

        setLoading(true); 
        
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
            // Usamos window.alert temporariamente, mas idealmente seria um modal customizado
            window.alert(`Falha na operação: ${err.message}`); 
            
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
                    // Evita renderizar se o ID for inválido (após a correção no loadUsers)
                    if (!userId) return null; 

                    // Verifica o status de seguimento, usando o status real da API
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
                                    // Desabilita apenas se estiver em um estado de loading global
                                    disabled={loading} 
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