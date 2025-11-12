import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Fiscal = () => {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [arquivo, setArquivo] = useState({});

  useEffect(() => {
    const categoria = localStorage.getItem("usuarioCategoria");
    if (categoria !== "Fiscal") {
      navigate("/"); // bloqueia acesso direto se não for fiscal
    } else {
      buscarSolicitacoes();
    }
  }, [navigate]);

  const buscarSolicitacoes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "solicitacoes"));
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSolicitacoes(lista);
    } catch (erro) {
      console.error("Erro ao carregar solicitações:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const handleFileChange = (id, file) => {
    setArquivo((prev) => ({ ...prev, [id]: file }));
  };

  const handleUpload = async (id) => {
    const file = arquivo[id];
    if (!file) {
      alert("⚠️ Selecione um arquivo primeiro!");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        const docRef = doc(db, "solicitacoes", id);
        await updateDoc(docRef, {
          documentoFiscalBase64: base64String,
          nomeDocumento: file.name,
        });
        alert("✅ Documento anexado com sucesso!");
        buscarSolicitacoes(); // atualiza lista
      };
      reader.readAsDataURL(file);
    } catch (erro) {
      console.error("Erro ao anexar documento:", erro);
      alert("❌ Erro ao anexar documento fiscal!");
    }
  };

  if (carregando) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Carregando...</p>;
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>📋 Painel do Fiscal</h2>
      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        Todas as solicitações (Aprovadas, Reprovadas e Pendentes)
      </p>

      {solicitacoes.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nenhuma solicitação encontrada.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: "20px",
          }}
        >
          {solicitacoes.map((sol) => (
            <div
              key={sol.id}
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "1px solid #eee",
              }}
            >
              <h3 style={{ marginBottom: "10px", color: "#000" }}>
                Produto:{" "}
                <span style={{ color: "#333" }}>
                  {sol.produto?.descricao || "—"}
                </span>
              </h3>
              <p><strong>Código:</strong> {sol.codigoBarras || sol.produto?.codigo || "—"}</p>
              <p><strong>Usuário:</strong> {sol.usuario || "—"}</p>
              <p><strong>Categoria:</strong> {sol.categoria || "—"}</p>
              <p><strong>Origem:</strong> {sol.origem || "—"}</p>
              <p><strong>Destino:</strong> {sol.destino || "—"}</p>
              <p><strong>Motivo:</strong> {sol.motivo || "—"}</p>
              <p><strong>Valor:</strong> R$ {sol.valor || "—"}</p>
              <p><strong>Loja:</strong> {sol.loja || "—"}</p>
              <p><strong>Editado por:</strong> {sol.editadoPor || "—"}</p>
              <p><strong>Aprovado por Contábil:</strong> {sol.aprovadoPorContabil || "—"}</p>

              <p>
                <strong>Data de Solicitação:</strong>{" "}
                {sol.data
                  ? new Date(sol.data.seconds * 1000).toLocaleString("pt-BR")
                  : "—"}
              </p>
              <p>
                <strong>Data de Edição:</strong>{" "}
                {sol.dataEdicao
                  ? new Date(sol.dataEdicao.seconds * 1000).toLocaleString("pt-BR")
                  : "—"}
              </p>
              <p>
                <strong>Data de Aprovação Contábil:</strong>{" "}
                {sol.dataAprovacaoContabil
                  ? new Date(sol.dataAprovacaoContabil.seconds * 1000).toLocaleString("pt-BR")
                  : "—"}
              </p>

              <p>
                <strong>Status Fiscal:</strong>{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      sol.status === "Aprovado"
                        ? "green"
                        : sol.status === "Reprovado"
                        ? "red"
                        : "#555",
                  }}
                >
                  {sol.status || "Pendente"}
                </span>
              </p>
              <p>
                <strong>Status Contábil:</strong>{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      sol.statusContabil === "Aprovado"
                        ? "green"
                        : sol.statusContabil === "Reprovado"
                        ? "red"
                        : "#555",
                  }}
                >
                  {sol.statusContabil || "Pendente"}
                </span>
              </p>

              <hr style={{ margin: "15px 0" }} />

              {/* Upload de documento fiscal */}
              {sol.documentoFiscalBase64 ? (
                <p>
                  📎 Documento anexado:{" "}
                  <a
                    href={sol.documentoFiscalBase64}
                    download={sol.nomeDocumento || "documentoFiscal"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {sol.nomeDocumento || "Abrir documento"}
                  </a>
                </p>
              ) : (
                <div>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(sol.id, e.target.files[0])}
                    style={{ marginBottom: "10px" }}
                  />
                  <button
                    onClick={() => handleUpload(sol.id)}
                    style={{
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Enviar Documento Fiscal
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fiscal;
