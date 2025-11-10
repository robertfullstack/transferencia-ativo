import React from "react";
import { FaExchangeAlt, FaSearch, FaInbox } from "react-icons/fa"; // 👈 adicionado o ícone
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // 👇 Recupera categoria do usuário logado
  const categoriaUsuario = localStorage.getItem("categoria");

  // Botões padrão
  const botoes = [
    {
      titulo: "Solicitar Transferência",
      icone: <FaExchangeAlt size={32} color="#000" />,
      rota: "/solicitar",
    },
    {
      titulo: "Consultar Transferências",
      icone: <FaSearch size={32} color="#000" />,
      rota: "/consultar",
    },
  ];

  // 👇 Se for Adm Loja (Inicio...), adiciona o botão Recebidos
  if (categoriaUsuario === "Adm Loja (Inicio do processo de transferência)") {
    botoes.push({
      titulo: "Recebidos",
      icone: <FaInbox size={32} color="#000" />,
      rota: "/recebidos",
    });
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        color: "#000",
      }}
    >
      <h1 style={{ marginBottom: "40px", fontSize: "26px" }}>
        Controle de Transferências
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "20px",
          width: "80%",
          maxWidth: "600px",
        }}
      >
        {botoes.map((botao, index) => (
          <div
            key={index}
            onClick={() => navigate(botao.rota)}
            style={{
              backgroundColor: "#f7f7f7",
              borderRadius: "12px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              padding: "25px",
              textAlign: "center",
              cursor: "pointer",
              transition: "0.3s",
              border: "1px solid #ddd",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#000";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#f7f7f7";
              e.currentTarget.style.color = "#000";
            }}
          >
            <div style={{ marginBottom: "10px" }}>{botao.icone}</div>
            <p style={{ fontSize: "15px", fontWeight: "bold" }}>
              {botao.titulo}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "40px",
          padding: "12px 30px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#000",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#000")}
      >
        Sair
      </button>
    </div>
  );
}
