import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Fiscal = () => {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [selecionados, setSelecionados] = useState([]); // IDs selecionados
  const [arquivoUnico, setArquivoUnico] = useState(null); // Arquivo único

  useEffect(() => {
    const categoria = localStorage.getItem("usuarioCategoria");
    if (categoria !== "Fiscal") {
      navigate("/");
    } else {
      buscarSolicitacoes();
    }
  }, [navigate]);

  // Buscar todas as solicitações (independente do status)
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

  const toggleSelecionado = (id) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleUploadMultiplo = async () => {
    if (!arquivoUnico) {
      alert("⚠️ Selecione um arquivo para anexar!");
      return;
    }
    if (selecionados.length === 0) {
      alert("⚠️ Nenhuma solicitação selecionada!");
      return;
    }

    const nomeUsuario = localStorage.getItem("nome");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;

      for (const id of selecionados) {
        const docRef = doc(db, "solicitacoes", id);

        await updateDoc(docRef, {
          documentoFiscalBase64: base64String,
          nomeDocumento: arquivoUnico.name,
          statusFiscal: "Aprovado",
          aprovadoPorFiscal: nomeUsuario,
          dataAprovacaoFiscal: new Date(),
        });
      }

      alert(`✅ Documento anexado a ${selecionados.length} solicitações!`);

      setSelecionados([]);
      setArquivoUnico(null);
      buscarSolicitacoes();
    };

    reader.readAsDataURL(arquivoUnico);
  };

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
      <h2 style={{ textAlign: "center" }}>---- Painel do Fiscal Geral ----</h2>

      {/* Upload de Nota Fiscal */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          marginBottom: 25,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Anexar Nota Fiscal Para as Solicitações</h3>

        <input
          type="file"
          onChange={(e) => setArquivoUnico(e.target.files[0])}
          style={{ marginTop: 10 }}
        />

        <button
          onClick={handleUploadMultiplo}
          style={{
            background: "green",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            marginLeft: 10,
          }}
        >
          Enviar para Selecionadas ({selecionados.length})
        </button>
      </div>

      {/* Lista de solicitações */}
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
              border: selecionados.includes(sol.id)
                ? "2px solid green"
                : "1px solid #ccc",
            }}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selecionados.includes(sol.id)}
              onChange={() => toggleSelecionado(sol.id)}
              style={{ transform: "scale(1.4)", marginBottom: 10 }}
            />

            <h3 style={{ marginBottom: "10px", color: "#000" }}>
              Registro: <span style={{ color: "#333" }}>{sol.id}</span>
            </h3>

            <p>
              <strong>Descrição:</strong>{" "}
              {sol.produto?.["Denominação do imobilizado"] || "—"}
            </p>
            <p>
              <strong>Código:</strong> {sol.codigoBarras || sol.produto?.codigo || "—"}
            </p>
            <p><strong>Usuário Solicitante:</strong> {sol.usuario || "—"}</p>
            <p><strong>Categoria:</strong> {sol.categoria || "—"}</p>
            <p><strong>Loja/Origem:</strong> {sol.origem || "—"}</p>
            <p><strong>Loja/Destino:</strong> {sol.destino || "—"}</p>
            <p><strong>Motivo:</strong> {sol.motivo || "—"}</p>
            <p><strong>Valor:</strong> R$ {sol.valor || "—"}</p>

            {/* <p>
              <strong>Status Geral:</strong>{" "}
              <span style={{ fontWeight: "bold", color: "green" }}>{sol.status}</span>
            </p> */}

            {/* 🔹 Se houver aprovação fiscal */}
            {sol.statusFiscal === "Aprovado" && sol.dataAprovacaoFiscal && sol.aprovadoPorFiscal && (
              <p style={{ fontStyle: "italic", color: "#555", marginTop: 4 }}>
                Concluído por: {sol.aprovadoPorFiscal},{" "}
                {sol.dataAprovacaoFiscal.toDate().toLocaleString("pt-BR")}
              </p>
            )}

            <p>
              <strong>Status Geral:</strong>{" "}
              {sol.statusLoja !== "" && sol.recebidoPorLoja ? (
                <span style={{ fontWeight: "bold", color: "blue" }}>
                  Recebimento Concluído - Concluído por: {sol.recebidoPorLoja},{" "}
                  {sol.dataRecebimento ? sol.dataRecebimento.toDate().toLocaleString("pt-BR") : ""}
                </span>
              ) : (
                <span style={{ fontWeight: "bold", color: "green" }}>{sol.status}</span>
              )}
            </p>

            <hr style={{ margin: "15px 0" }} />

            {sol.documentoFiscalBase64 ? (
              <p>
                📎 Documento/Nota Fiscal:{" "}
                <a
                  href={sol.documentoFiscalBase64}
                  download={sol.nomeDocumento}
                  target="_blank"
                  rel="noreferrer"
                >
                  {sol.nomeDocumento}
                </a>
              </p>
            ) : (
              <p style={{ opacity: 0.6 }}>Nenhum documento anexado ainda</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Loader
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
  loaderBox: { textAlign: "center" },
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

export default Fiscal;
