"use client";
import { useState, useEffect, useCallback } from 'react';

// CORREÇÃO: "Agendamento" com A maiúsculo para bater com o nome da pasta
import ListaAgendamento from '../component/Agendamento/ListaAgendamento';
import VisualizacaoAgendamento from '../component/Agendamento/VisualizacaoAgendamento';
import CriarAgendamento from '../component/Agendamento/CriarAgendamento';

export default function AgendamentosPage() {
    // ... seu código da página (pode manter o que estava ou usar o exemplo abaixo se estiver vazio)
    
    // Se você ainda não tem o conteúdo da página, vou deixar um esqueleto pronto aqui:
    return (
        <div className="max-w-4xl mx-auto p-6 pb-20">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-pink-600 mb-2">Agendamentos 📅</h1>
                <p className="text-gray-500">Marque seu horário ou gerencie sua agenda.</p>
            </div>

            {/* Componente de Criar (Formulário) */}
            <div className="mb-10">
                <CriarAgendamento />
            </div>

            {/* Componente de Listar */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100">
                <ListaAgendamento />
            </div>
        </div>
    );
}