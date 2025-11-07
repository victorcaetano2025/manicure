"use client";

import { useState } from "react";
import Login from "../../component/auth/Login";
import Cadastrar from "../../component/auth/Cadastrar";

export default function AuthPage() {
  const [modo, setModo] = useState("login"); // alterna entre login e cadastro

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
          {modo === "login" ? "Entrar" : "Criar Conta"}
        </h1>

        {/* alterna entre os componentes */}
        {modo === "login" ? <Login /> : <Cadastrar />}

        <p className="text-center text-sm mt-6">
          {modo === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <button
            onClick={() =>
              setModo(modo === "login" ? "cadastro" : "login")
            }
            className="text-pink-600 font-semibold hover:underline"
          >
            {modo === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
