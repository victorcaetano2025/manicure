"use client";
import React, { useEffect, useState } from "react";
import { apiGetAllUsers, apiFollowUser, apiUnfollowUser, getCurrentUser, apiGetFollowStatus } from "../../utils/api";

export default function FeedUsuarios() {
  const [users, setUsers] = useState([]);
  const [localFollowStatus, setLocalFollowStatus] = useState({});
  const [loading, setLoading] = useState(true);
  
  const currentUser = getCurrentUser();

  useEffect(() => {
    async function loadData() {
      try {
        const allUsers = await apiGetAllUsers();
        // Remove o próprio usuário da lista e pega os 5 primeiros
        const suggestions = allUsers.filter(u => u.idUsuario !== currentUser?.id).slice(0, 5);
        setUsers(suggestions);

        // Verifica status de quem já sigo
        const statusMap = {};
        for (const user of suggestions) {
            try {
                const isFollowing = await apiGetFollowStatus(user.idUsuario);
                statusMap[user.idUsuario] = isFollowing;
            } catch (e) {
                statusMap[user.idUsuario] = false;
            }
        }
        setLocalFollowStatus(statusMap);

      } catch (err) {
        console.error("Erro ao carregar sugestões", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleFollow = async (userId) => {
    const isFollowing = localFollowStatus[userId];
    // Atualização Otimista (Muda a cor do botão antes da API responder para parecer rápido)
    setLocalFollowStatus(prev => ({ ...prev, [userId]: !isFollowing }));

    try {
        if (isFollowing) await apiUnfollowUser(userId);
        else await apiFollowUser(userId);
    } catch (error) {
        // Se der erro, desfaz a mudança visual
        setLocalFollowStatus(prev => ({ ...prev, [userId]: isFollowing }));
        alert("Erro ao realizar ação.");
    }
  };

  if (loading) return <div className="animate-pulse bg-gray-100 h-40 rounded-xl w-full"></div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-pink-100 p-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">
        Sugestões para você
      </h3>
      
      <div className="space-y-4">
        {users.map((user) => {
            const isFollowing = localFollowStatus[user.idUsuario];

            return (
                <div key={user.idUsuario} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {/* Avatar */}
                        <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {user.urlFotoPerfil ? (
                                <img src={user.urlFotoPerfil} className="w-full h-full rounded-full object-cover" alt={user.nome} />
                            ) : (
                                user.nome?.charAt(0).toUpperCase()
                            )}
                        </div>
                        
                        {/* Nome e Cargo */}
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[120px]" title={user.nome}>
                                {user.nome.split(" ")[0]} {user.nome.split(" ")[1]?.charAt(0)}.
                            </span>
                            {user.complemento ? (
                                <span className="text-[10px] text-pink-600 bg-pink-50 px-1.5 rounded-md w-fit font-medium">Manicure</span>
                            ) : (
                                <span className="text-[10px] text-gray-400">Novo usuário</span>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={() => handleToggleFollow(user.idUsuario)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                            isFollowing 
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                            : "bg-pink-600 text-white hover:bg-pink-700 shadow-md hover:shadow-lg"
                        }`}
                    >
                        {isFollowing ? "Seguindo" : "Seguir"}
                    </button>
                </div>
            );
        })}
      </div>
    </div>
  );
}