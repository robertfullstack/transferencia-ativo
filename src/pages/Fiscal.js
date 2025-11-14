import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Fiscal = () => {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [arquivo, setArquivo] = useState({});

  useEffect(() => {
    const categoria = localStorage.getItem("usuarioCategoria");
    if (categoria !== "Fiscal") {
      navigate("/");
    } else {
      buscarSolicitacoes();
    }
  }, [navigate]);

  const buscarSolicitacoes = async () => {
    try {
      const q = query(collection(db, "solicitacoes"), where("status", "==", "Aprovado"));
      const querySnapshot = await getDocs(q);

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
        buscarSolicitacoes();
      };
      reader.readAsDataURL(file);
    } catch (erro) {
      console.error("Erro ao anexar documento:", erro);
      alert("❌ Erro ao anexar documento fiscal!");
    }
  };

  // 🔥🔥🔥 LOADER PROFESSIONAL (IGUAL AO DA BASE) 🔥🔥🔥
  if (carregando) {
    return (
      <div style={styles.overlay}>
        <div style={styles.loaderBox}>
          <div style={styles.spinner}></div>
          <p style={{ fontSize: 18, marginTop: 10 }}>Carregando solicitações...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>📋 Painel do Fiscal</h2>
      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        Exibindo apenas solicitações com status <b>"Aprovado"</b>
      </p>

      {solicitacoes.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nenhuma solicitação aprovada encontrada.</p>
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
              {/* <h3 style={{ marginBottom: "10px", color: "#000" }}>
                Produto: <span style={{ color: "#333" }}>{sol.produto?.descricao || "—"}</span>
              </h3>

              <p><strong>Código:</strong> {sol.codigoBarras || sol.produto?.codigo || "—"}</p> */}


              <h3 style={{ marginBottom: "10px", color: "#000" }}>
                Produto: <span style={{ color: "#333" }}>{sol.produto?.descricao || "—"}</span>
              </h3>

              <p><strong>Código:</strong> {sol.codigoBarras || sol.produto?.codigo || "—"}</p>
              <p><strong>Usuário:</strong> {sol.usuario || "—"}</p>
              <p><strong>Categoria:</strong> {sol.categoria || "—"}</p>
              <p><strong>Origem:</strong> {sol.origem || "—"}</p>
              <p><strong>Destino:</strong> {sol.destino || "—"}</p>
              <p><strong>Motivo:</strong> {sol.motivo || "—"}</p>
              <p><strong>Valor:</strong> R$ {sol.valor || "—"}</p>
              <p><strong>Loja:</strong> {sol.loja || "—"}</p>
              <p>
                <strong>Descrição:</strong>{" "}
                {sol.produto?.["Denominação do imobilizado"] || "—"}
              </p>


              <p>
                <strong>Status:</strong>{" "}
                <span style={{ fontWeight: "bold", color: "green" }}>{sol.status}</span>
              </p>

              <hr style={{ margin: "15px 0" }} />

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

// ======== ESTILOS DO LOADER (MESMO DA BASE) ========
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    zIndex: 9999,
  },
  loaderBox: {
    textAlign: "center",
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #fff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
};

// 🔁 Animação CSS
const sheet = document.styleSheets[0];
sheet.insertRule(
  "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }",
  sheet.cssRules.length
);

export default Fiscal;
