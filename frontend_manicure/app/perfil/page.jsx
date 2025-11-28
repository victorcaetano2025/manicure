"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGetUserById, apiUpdateUser, getCurrentUser, logout } from "../utils/api";

export default function PerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Estado do formulário
  const [user, setUser] = useState({
    idUsuario: null,
    nome: "",
    email: "",
    idade: "",
    sexo: "F",
    urlFotoPerfil: "",
    // Dados de Manicure (Complementos)
    especialidade: "",
    regiao: ""
  });

  const [isManicure, setIsManicure] = useState(false);

  useEffect(() => {
    async function loadData() {
      // 1. Pega o ID do usuário salvo no login
      const currentUser = getCurrentUser();
      
      if (!currentUser || !currentUser.id) {
        alert("Você precisa fazer login primeiro!");
        router.push("/");
        return;
      }

      try {
        // 2. Busca os dados atualizados do backend
        const fullData = await apiGetUserById(currentUser.id);
        
        // 3. Preenche o formulário
        setUser({
            idUsuario: fullData.idUsuario,
            nome: fullData.nome,
            email: fullData.email,
            idade: fullData.idade || "",
            sexo: fullData.sexo || "F",
            urlFotoPerfil: fullData.urlFotoPerfil || "",
            // Se tiver complemento, preenche. Senão, vazio.
            especialidade: fullData.complemento?.especialidade || "",
            regiao: fullData.complemento?.regiao || ""
        });

        // Se tiver complemento, ativa o modo Manicure
        if (fullData.complemento) {
            setIsManicure(true);
        }

      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        alert("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdating(true);

    // Prepara o objeto para envio (DTO do Backend)
    const payload = {
        nome: user.nome,
        email: user.email,
        idade: user.idade,
        sexo: user.sexo,
        urlFotoPerfil: user.urlFotoPerfil,
        senha: "", // Envia vazio para não alterar a senha
        // Se for manicure, manda os dados. Se não, manda null/vazio.
        especialidade: isManicure ? user.especialidade : null,
        regiao: isManicure ? user.regiao : null
    };

    try {
        await apiUpdateUser(user.idUsuario, payload);
        alert("Perfil atualizado com sucesso! ✨");
    } catch (error) {
        alert("Erro ao atualizar: " + error.message);
    } finally {
        setUpdating(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Carregando seu perfil...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 mb-20">
      
      {/* CABEÇALHO COM FOTO */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 text-center relative border border-pink-100">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-pink-500 shadow-md mb-4 bg-gray-200 relative">
            {user.urlFotoPerfil ? (
                <img src={user.urlFotoPerfil} alt="Foto de Perfil" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">📷</div>
            )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{user.nome}</h1>
        <p className="text-gray-500">{user.email}</p>

        {isManicure && (
            <span className="inline-block mt-2 px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-bold uppercase tracking-wide">
                Profissional Manicure
            </span>
        )}
      </div>

      {/* FORMULÁRIO DE EDIÇÃO */}
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">Editar Informações</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nome Completo</label>
                <input type="text" name="nome" value={user.nome} onChange={handleChange} required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none" />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Idade</label>
                <input type="number" name="idade" value={user.idade} onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">URL da Foto (Copie e cole aqui)</label>
            <input type="text" name="urlFotoPerfil" value={user.urlFotoPerfil} onChange={handleChange} placeholder="https://..."
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none" />
            <p className="text-xs text-gray-400 mt-1">Cole um link de imagem do Google, Unsplash, etc.</p>
        </div>

        {/* ÁREA PROFISSIONAL */}
        <div className="bg-pink-50 p-5 rounded-xl border border-pink-100 mt-6">
            <div className="flex items-center justify-between mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={isManicure} onChange={() => setIsManicure(!isManicure)}
                        className="w-5 h-5 text-pink-600 rounded border-gray-300 focus:ring-pink-500" />
                    <span className="font-bold text-pink-700">Sou Manicure / Profissional</span>
                </label>
            </div>

            {isManicure && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                    <div>
                        <label className="block text-xs font-bold text-pink-600 uppercase mb-1">Especialidade</label>
                        <input type="text" name="especialidade" value={user.especialidade} onChange={handleChange} placeholder="Ex: Gel, Nail Art"
                            className="w-full p-2 rounded border border-pink-200 focus:border-pink-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-pink-600 uppercase mb-1">Região</label>
                        <input type="text" name="regiao" value={user.regiao} onChange={handleChange} placeholder="Ex: Centro"
                            className="w-full p-2 rounded border border-pink-200 focus:border-pink-500 outline-none" />
                    </div>
                </div>
            )}
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="flex flex-col gap-3 pt-4">
            <button type="submit" disabled={updating}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition shadow-md disabled:opacity-70">
                {updating ? "Salvando..." : "Salvar Alterações"}
            </button>
            
            <button type="button" onClick={() => router.push("/")}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition">
                Voltar para Home
            </button>

            <button type="button" onClick={logout}
                className="w-full border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-xl transition mt-4">
                Sair da Conta (Logout)
            </button>
        </div>

      </form>
    </div>
  );
}