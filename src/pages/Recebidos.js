import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Recebidos() {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const categoriaUsuario = localStorage.getItem("categoria");
  const nomeUsuario = localStorage.getItem("nome");

  useEffect(() => {
    // ✅ Verifica se é o perfil permitido
    if (categoriaUsuario !== "Adm Loja (Inicio do processo de transferência)") {
      alert("⛔ Acesso restrito! Somente 'Adm Loja (Início do processo de transferência)' pode acessar.");
      navigate("/home");
      return;
    }

    const solicitacoesRef = collection(db, "solicitacoes");

    // ✅ Filtra solicitações finalizadas com arquivoFiscalURL anexado
    const q = query(solicitacoesRef, where("status", "==", "Finalizado"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((s) => s.arquivoFiscalURL); // Só mostra se tiver arquivo anexado
      setSolicitacoes(dados);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, [categoriaUsuario, navigate]);

  if (carregando) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>Carregando solicitações recebidas...</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        color: "#000",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        📦 Solicitações Recebidas
      </h1>

      {solicitacoes.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nenhuma solicitação recebida ainda.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {solicitacoes.map((s) => (
            <div
              key={s.id}
              style={{
                backgroundColor: "#f7f7f7",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "8px" }}>{s.produto || "Produto sem nome"}</h3>
              <p><strong>Loja Origem:</strong> {s.lojaOrigem}</p>
              <p><strong>Loja Destino:</strong> {s.lojaDestino}</p>
              <p><strong>Solicitado por:</strong> {s.usuario}</p>
              <p><strong>Status:</strong> {s.status}</p>
              <p><strong>Data:</strong> {new Date(s.criadoEm?.seconds * 1000).toLocaleString()}</p>

              {/* Link do arquivo fiscal */}
              {s.arquivoFiscalURL && (
                <p style={{ marginTop: "10px" }}>
                  📎{" "}
                  <a
                    href={s.arquivoFiscalURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Ver Documento Fiscal
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "12px 25px",
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
          🔙 Voltar
        </button>
      </div>
    </div>
  );
}
