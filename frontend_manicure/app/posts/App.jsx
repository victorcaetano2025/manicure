import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListaAmigo from './friend'; // Assuma que você tem uma lista de amigos
import FriendProfile from './friend';
// ... outros componentes

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota da lista principal onde FriendItem será renderizado */}
        <Route path="/" element={<FriendList />} />
        
        {/* 🚀 Rota para o perfil do amigo - Esta é a conexão! */}
        {/* O :id garante que a URL corresponda ao FriendItem (e.g., /friend/123) */}
        <Route path="/friend/:id" element={<FriendProfile />} />
        
        {/* ... outras rotas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;