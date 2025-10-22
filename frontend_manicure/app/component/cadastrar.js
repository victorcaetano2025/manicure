"use client";

import { useState } from 'react';

export default function Cadastrar() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [pwd1, setPwd1] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (pwd1 !== pwd2) {
      setError('As senhas não conferem!');
      return;
    }
    setError('');
    alert('Cadastro realizado com sucesso!');
    // aqui você colocaria sua lógica para enviar os dados pra API
  }

  return (
    <div>
      <h1>Cadastrar</h1>
      <form onSubmit={handleSubmit}>
        <h3>Nome</h3>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <h3>Email</h3>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <h3>Data de nascimento</h3>
        <input
          type="date"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <h3>Senha</h3>
        <input
          type="password"
          id="pwd1"
          value={pwd1}
          onChange={(e) => setPwd1(e.target.value)}
          required
        />

        <h3>Confirmar senha</h3>
        <input
          type="password"
          id="pwd2"
          value={pwd2}
          onChange={(e) => setPwd2(e.target.value)}
          required
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
