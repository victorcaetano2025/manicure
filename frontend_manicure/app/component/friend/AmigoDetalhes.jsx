import React from 'react';

function AmigoItem(props) {

    const {amigo} = props;

    return (
        <div className="amigo-item">
            {/* Imagem do Avatar */}
            <img 
            src={amigo.avatar}
            alt={`Avatar de ${amigo.nome}`}
            className="amigo-avatar"
            />

            {/* Informações */}
            <div className="amigo-info">
              <span className="amigo-nome">{amigo.nome}</span>
              <p className="amigo-status">{amigo.status}</p>
            </div>

            {/* Botão de Ação*/}
            <button
            className="botao-acao"
            onClick={() => alert(`Iniciando chat com ${amigo.nome}`)}
            >
              chat
              </button>
            </div>  
        );
      }         

      export default ItemAmigo;