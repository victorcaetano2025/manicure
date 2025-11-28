"use client";
import React, { useState, useEffect } from "react";
import { apiCreateAgendamento, apiGetAgendamento, apiDeleteAgendamento, apiGetManicures } from "../../utils/api";

export default function CriarAgendamento() {
  const [form, setForm] = useState({ manicureId: "", data: "", horario: "", descricao: "" });
  const [manicures, setManicures] = useState([]); 
  const [meusAgendamentos, setMeusAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const usuarios = await apiGetManicures();
      
      // 💡 FILTRO REFORÇADO: Só mostra quem tem objeto 'complemento' (Manicures)
      const listaManicures = Array.isArray(usuarios) 
        ? usuarios.filter(u => u.complemento !== null && typeof u.complemento === 'object') 
        : [];
      
      setManicures(listaManicures);

      const agendamentos = await apiGetAgendamento();
      setMeusAgendamentos(agendamentos || []);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.manicureId) return alert("Selecione uma manicure!");
    setLoading(true);
    
    // Formata Data (YYYY-MM-DD -> DD/MM/YYYY)
    let dataFormatada = form.data;
    if (form.data.includes("-")) {
        const [ano, mes, dia] = form.data.split("-");
        dataFormatada = `${dia}/${mes}/${ano}`; 
    }

    const payload = {
        manicureId: Number(form.manicureId),
        descricao: form.descricao,
        data: dataFormatada, 
        hora: form.horario
    };

    try {
      await apiCreateAgendamento(payload);
      alert("Agendamento realizado com sucesso! 💅");
      setForm({ manicureId: "", data: "", horario: "", descricao: "" });
      carregarDados(); // Recarrega a lista
    } catch (error) {
      alert("Erro ao agendar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja cancelar?")) return;
    try {
      await apiDeleteAgendamento(id);
      setMeusAgendamentos(meusAgendamentos.filter(a => a.idAgendamento !== id));
    } catch (error) {
      alert("Erro ao cancelar.");
    }
  };

  // Classes fixas para garantir visibilidade (Fundo Branco, Letra Escura)
  const inputClass = "w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none";

  return (
    <div className="max-w-lg mx-auto">
      
      {/* CARD DE AGENDAMENTO */}
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-pink-100 mb-8">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">Novo Agendamento</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Escolha a Profissional</label>
                <select 
                    name="manicureId" 
                    value={form.manicureId} 
                    onChange={handleChange} 
                    required 
                    className={inputClass}
                >
                    <option value="">Selecione...</option>
                    {manicures.map(m => (
                        <option key={m.idUsuario} value={m.idUsuario}>
                            {m.nome} {m.complemento?.especialidade ? `(${m.complemento.especialidade})` : ''}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
                    <input type="date" name="data" value={form.data} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Horário</label>
                    <input type="time" name="horario" value={form.horario} onChange={handleChange} required className={inputClass} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Serviço / Descrição</label>
                <input type="text" name="descricao" value={form.descricao} onChange={handleChange} placeholder="Ex: Unha de Gel" required className={inputClass} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition shadow-md disabled:opacity-50">
                {loading ? "Agendando..." : "Confirmar Agendamento"}
            </button>
        </form>
      </div>

      {/* LISTA DE AGENDAMENTOS (RESTAURADA) */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            📅 Meus Horários Marcados
          </h3>
          
          {meusAgendamentos.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                  <p>Você ainda não tem agendamentos.</p>
              </div>
          ) : (
              <ul className="space-y-3">
                  {meusAgendamentos.map(a => (
                      <li key={a.idAgendamento} className="flex justify-between items-center bg-pink-50 p-4 rounded-xl border border-pink-100">
                          <div>
                              <p className="font-bold text-pink-800 text-sm">{a.descricao}</p>
                              <p className="text-xs text-gray-600">
                                {a.data} às {a.hora} com <span className="font-bold">{a.manicure?.nome}</span>
                              </p>
                          </div>
                          <button 
                            onClick={() => handleDelete(a.idAgendamento)} 
                            className="bg-white text-red-500 hover:text-red-700 border border-red-100 p-2 rounded-lg text-xs font-bold transition"
                          >
                            Cancelar
                          </button>
                      </li>
                  ))}
              </ul>
          )}
      </div>

    </div>
  );
}