"use client";

import { useState } from "react";
import Login from "./Login";
import Cadastrar from "./Cadastrar";

export default function AuthPage({ onClose }) {
  const [modo, setModo] = useState("login"); // "login" ou "cadastro"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
          {modo === "login" ? "Entrar" : "Criar Conta"}
        </h1>

        {modo === "login" ? (
          <Login onSuccess={onClose} />
        ) : (
          <Cadastrar onSuccess={() => setModo("login")} />
        )}

        <p className="text-center text-sm mt-4">
          {modo === "login" ? "Não tem conta?" : "Já possui conta?"}{" "}
          <button
            onClick={() => setModo(modo === "login" ? "cadastro" : "login")}
            className="text-pink-500 font-semibold hover:underline"
          >
            {modo === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
