import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUsers, FaArrowLeft } from "react-icons/fa";

export default function CadastroUsuario() {
  const navigate = useNavigate();

  const opcoes = [
    {
      titulo: "Adicionar Usuário",
      icone: <FaUserPlus size={32} color="#000" />,
      rota: "/admin/novo-usuario",
    },
    {
      titulo: "Listar Usuários",
      icone: <FaUsers size={32} color="#000" />,
      rota: "/admin/listar-usuarios",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#fff",
        color: "#000",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "40px", fontSize: "26px" }}>Gerenciar Usuários</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "20px",
          width: "80%",
          maxWidth: "600px",
        }}
      >
        {opcoes.map((opcao, index) => (
          <div
            key={index}
            onClick={() => navigate(opcao.rota)}
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
            <div style={{ marginBottom: "10px" }}>{opcao.icone}</div>
            <p style={{ fontSize: "15px", fontWeight: "bold" }}>{opcao.titulo}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/admin")}
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
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#000")}
      >
        <FaArrowLeft /> Voltar
      </button>
    </div>
  );
}
