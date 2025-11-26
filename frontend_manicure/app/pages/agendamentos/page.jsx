"use client";

import { useState, useEffect, useCallback } from 'react';
// Biblioteca de data popular. Você pode precisar instalá-la: npm install react-datepicker date-fns
import DatePicker from 'react-datepicker'; 
import "react-datepicker/dist/react-datepicker.css"; // Estilo básico
import ListaAgendamento from '../../component/agendamento/ListaAgendamento';
import VisualizacaoAgendamento from '../../component/agendamento/VisualizacaoAgendamento';
import CriarAgendamento from '../../component/agendamento/CriarAgendamento';
import DetalhesAgendamento from '../../component/agendamento/id/DetalhesAgendamento';

// Importe a função API que você modificou (assumindo que api.js é o caminho correto)
import { postData, fetchData } from '@/app/utils/api'; // Ajuste o caminho conforme sua estrutura real

/**
 * Componente Client-Side para criar um novo agendamento.
 * Lida com a seleção de data, hora, serviço e a submissão do formulário.
 */
export default function CriarAgendamento({ onAgendamentoCriado }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Formata a data para a API (ex: YYYY-MM-DD)
    const formatDateForAPI = (date) => {
        return date.toISOString().split('T')[0];
    };

    // 1. Fetch de Serviços (Corre uma vez)
    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Endpoint de exemplo: /servicos
                const data = await fetchData('/servicos'); 
                setServices(data || []);
                if (data && data.length > 0) {
                    setSelectedService(data[0].id); // Seleciona o primeiro serviço por padrão
                }
            } catch (err) {
                console.error("Erro ao buscar serviços:", err);
                // setError("Não foi possível carregar a lista de serviços.");
            }
        };
        fetchServices();
    }, []);

    // 2. Fetch de Horários Disponíveis (Corre quando a data muda)
    const fetchAvailableTimes = useCallback(async (date) => {
        setLoading(true);
        setError(null);
        setAvailableTimes([]);
        setSelectedTime('');

        const formattedDate = formatDateForAPI(date);
        
        try {
            // Endpoint de exemplo: /agendamentos/disponibilidade?data=YYYY-MM-DD
            const data = await fetchData(`/agendamentos/disponibilidade?data=${formattedDate}`);
            
            if (data && data.length > 0) {
                setAvailableTimes(data);
            } else {
                setError("Nenhum horário disponível nesta data.");
            }
        } catch (err) {
            console.error("Erro ao buscar horários:", err);
            setError("Erro na comunicação com o servidor para horários.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Chama a função de busca sempre que a data selecionada mudar
    useEffect(() => {
        fetchAvailableTimes(selectedDate);
    }, [selectedDate, fetchAvailableTimes]);

    // 3. Submissão do Formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!selectedService || !selectedTime) {
            setError("Por favor, selecione o serviço e o horário.");
            setLoading(false);
            return;
        }

        // Monta o objeto de agendamento (assumindo que o usuário ID é obtido via Auth/Context)
        const agendamentoData = {
            data: formatDateForAPI(selectedDate),
            horario: selectedTime,
            servicoId: selectedService,
            // Adicione aqui o id do usuário logado: usuarioId: '...' 
        };

        try {
            const result = await postData('/agendamentos', agendamentoData);
            setSuccess(true);
            // Chama a função de callback para, por exemplo, atualizar a lista de agendamentos ou fechar a modal
            if (onAgendamentoCriado) {
                onAgendamentoCriado(result);
            }
            // Limpa o estado
            setSelectedTime('');
        } catch (err) {
            console.error("Erro ao criar agendamento:", err);
            setError(err.message || "Erro ao tentar agendar o serviço.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mensagens de Status */}
            {success && (
                <div className="p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg">
                    ✅ Agendamento realizado com sucesso!
                </div>
            )}
            {error && (
                <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">
                    ❌ Erro: {error}
                </div>
            )}

            {/* 1. Seleção de Serviço */}
            <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Serviço Desejado
                </label>
                <select
                    id="service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
                    required
                >
                    <option value="" disabled>Selecione um serviço</option>
                    {services.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.nome} (R$ {service.preco.toFixed(2)})
                        </option>
                    ))}
                </select>
            </div>

            {/* 2. Seleção de Data */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Escolha a Data
                </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()} // Impede agendamentos no passado
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                    wrapperClassName="w-full"
                />
            </div>

            {/* 3. Seleção de Horário */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horários Disponíveis ({formatDateForAPI(selectedDate)})
                </label>
                
                {loading && <p className="text-pink-500">Buscando horários...</p>}

                {!loading && availableTimes.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {availableTimes.map(time => (
                            <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedTime === time 
                                    ? 'bg-pink-600 text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-800 hover:bg-pink-100 border border-gray-200'
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                ) : !loading && !error && (
                    <p className="text-gray-500">Selecione uma data para ver os horários.</p>
                )}
            </div>

            {/* Botão de Submissão */}
            <button
                type="submit"
                disabled={loading || !selectedTime || !selectedService}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            >
                {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
        </form>
    );
}

// Lembre-se de instalar: npm install react-datepicker date-fns