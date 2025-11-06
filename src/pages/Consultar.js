import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Consultar() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const nomeUsuario = localStorage.getItem("usuarioNome");
    setUsuario(nomeUsuario);

    if (nomeUsuario) {
      carregarSolicitacoes(nomeUsuario);
    } else {
      setCarregando(false);
    }
  }, []);

  const carregarSolicitacoes = async (nomeUsuario) => {
    try {
      const solicitacoesRef = collection(db, "solicitacoes");
      const q = query(solicitacoesRef, where("usuario", "==", nomeUsuario));
      const querySnapshot = await getDocs(q);

      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSolicitacoes(lista);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p>Carregando solicitações...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        color: "#000",
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "25px" }}>
        Minhas Solicitações
      </h1>

      {solicitacoes.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>
          Nenhuma solicitação encontrada.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "15px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {solicitacoes.map((s) => (
            <div
              key={s.id}
              style={{
                backgroundColor: "#f7f7f7",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                boxShadow: "0 0 10px rgba(0,0,0,0.05)",
              }}
            >
              <p>
                <strong>Usuário:</strong> {s.usuario}
              </p>
              <p>
                <strong>Categoria:</strong> {s.categoria}
              </p>
              <p>
                <strong>Loja:</strong> {s.loja || "—"}
              </p>
              <p>
                <strong>Origem:</strong> {s.origem}
              </p>
              <p>
                <strong>Destino:</strong> {s.destino}
              </p>
              <p>
                <strong>Valor:</strong> R$ {s.valor}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      s.status === "Pendente"
                        ? "orange"
                        : s.status === "Aprovado"
                        ? "green"
                        : "gray",
                    fontWeight: "bold",
                  }}
                >
                  {s.status}
                </span>
              </p>
              <p style={{ fontSize: "13px", color: "#777" }}>
                Criado em:{" "}
                {s.data
                  ? new Date(s.data.seconds * 1000).toLocaleString()
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
