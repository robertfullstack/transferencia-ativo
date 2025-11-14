import { useEffect, useState } from "react";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import * as XLSX from "xlsx";

export default function Consultar() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [categoria, setCategoria] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [produtosBase, setProdutosBase] = useState([]);


  const uploadArquivoFiscal = async (solicitacaoId, file) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `fiscal/${solicitacaoId}/${file.name}`);

      // Faz upload
      await uploadBytes(storageRef, file);

      // Pega a URL pública do arquivo
      const downloadURL = await getDownloadURL(storageRef);

      // Atualiza no Firestore
      const refDoc = doc(db, "solicitacoes", solicitacaoId);
      await updateDoc(refDoc, {
        arquivoFiscalURL: downloadURL,
        dataUploadFiscal: new Date(),
      });

      alert("📄 Arquivo fiscal anexado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar arquivo fiscal:", error);
      alert("❌ Falha ao enviar arquivo fiscal.");
    }
  };


  useEffect(() => {
    const nomeUsuario = localStorage.getItem("usuarioNome");
    const categoriaUsuario = localStorage.getItem("usuarioCategoria");
    setUsuario(nomeUsuario);
    setCategoria(categoriaUsuario);

    // Carregar base Excel ao montar componente
    carregarBaseExcel();

    if (nomeUsuario) {
      carregarSolicitacoes(nomeUsuario, categoriaUsuario);
    } else {
      setCarregando(false);
    }
  }, []);

  const carregarBaseExcel = async () => {
    try {
      // Buscar arquivo Excel da pasta public
      const response = await fetch("/base.XLSX");
      const arrayBuffer = await response.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const dadosProdutos = XLSX.utils.sheet_to_json(sheet);

      setProdutosBase(dadosProdutos);
    } catch (error) {
      console.error("Erro ao carregar base Excel:", error);
    }
  };


  const carregarSolicitacoes = async (nomeUsuario, categoriaUsuario) => {
    try {
      const solicitacoesRef = collection(db, "solicitacoes");
      let q;

      if (categoriaUsuario === "Supervisor") {
        // Supervisor vê todas as solicitações
        q = query(solicitacoesRef);
      }
      else if (categoriaUsuario === "Operacoes") {
        // Operações vê apenas solicitações aprovadas pelo Supervisor
        q = query(solicitacoesRef, where("status", "==", "Aprovado"));
      }
      else if (categoriaUsuario === "Contabil") {
        // Contábil vê todas as solicitações aprovadas
        q = query(solicitacoesRef, where("status", "==", "Aprovado"));
      }
      else if (categoriaUsuario === "Fiscal") {
        // Fiscal vê todas as solicitações aprovadas para poder anexar documento
        q = query(solicitacoesRef, where("status", "==", "Aprovado"));
      }
      else if (categoriaUsuario === "Adm Loja") {
        // Busca todas, e depois filtra as que têm documento anexado
        const snapshot = await getDocs(solicitacoesRef);
        const docs = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((s) => s.documentoFiscalBase64); // só as que têm anexo
        setSolicitacoes(docs);
        return;
      }

      else {
        // Usuário comum vê apenas as suas solicitações
        q = query(solicitacoesRef, where("usuario", "==", nomeUsuario));
      }

      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSolicitacoes(lista);
      setCarregando(false);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      setCarregando(false);
    }
  };


  // ======== Atualiza status (Supervisor aprova/reprova) ========
  const atualizarStatus = async (id, novoStatus) => {
    try {
      const ref = doc(db, "solicitacoes", id);
      await updateDoc(ref, { status: novoStatus });

      // Atualiza status na tela
      setSolicitacoes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: novoStatus } : s))
      );

      // ✅ Se aprovado → envia automaticamente para "transferencias"
      if (novoStatus === "Aprovado") {
        const solicitacao = solicitacoes.find((s) => s.id === id);
        if (solicitacao) {
          await addDoc(collection(db, "transferencias"), {
            ...solicitacao,
            status: "Aprovado",
            aprovadoPor: usuario,
            dataAprovacao: new Date(),
          });
          alert("✅ Transferência enviada para Operações com sucesso!");
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };


  // Função para encontrar produto no base.xlsx pelo código (supondo a coluna 'codigo')
  const buscarProdutoPorCodigo = (codigo) => {
    if (!codigo || produtosBase.length === 0) return null;

    return produtosBase.find(
      (p) => String(p.codigo).trim() === String(codigo).trim()
    );
  };

  if (carregando) {
    return (
      <div style={styles.overlay}>
        <div style={styles.loaderBox}>
          <div style={styles.spinner}></div>
          <p style={{ fontSize: 18, marginTop: 10 }}> Carregando solicitações...</p>
        </div>
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
        {categoria === "Supervisor"
          ? "Todas as Solicitações"
          : "Minhas Solicitações"}
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


          {solicitacoes.map((s) => {
            const produtoEncontrado = buscarProdutoPorCodigo(
              s.produto?.codigo || s.codigoProduto || ""
            );

            return (
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
                  <strong>Usuário:</strong> {s.nomeDocumentoSolicitante}
                </p>
                <p>
                  <strong>Categoria:</strong> {s.categoria}
                </p>
                <p>
                  <strong>Loja/Destino:</strong> {s.destino || "—"}</p>

                {/* Produto do Firestore */}
                {/* Produto do Firestore */}
                {s.produto ? (
                  <div
                    style={{
                      backgroundColor: "#e6f5e8",
                      padding: "10px",
                      borderRadius: "8px",
                      marginTop: "10px",
                      marginBottom: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Produto:
                    </p>
                    <p>
                      <strong>Código:</strong> {s.produto.codigo || "—"}
                    </p>
                    <p>
                      <strong>Descrição:</strong> {s.produto.descricao || "—"}
                    </p>
                    {s.produto.preco && (
                      <p>
                        <strong>Preço:</strong> R$ {s.produto.preco}
                      </p>
                    )}
                    {s.produto.estoque && (
                      <p>
                        <strong>Estoque:</strong> {s.produto.estoque}
                      </p>
                    )}

                    {/* ✅ Link do anexo do Fiscal */}
                    {s.arquivoFiscalURL && (
                      <div
                        style={{
                          marginTop: "10px",
                          backgroundColor: "#f0f8ff",
                          padding: "8px",
                          borderRadius: "6px",
                          border: "1px solid #d0e0ff",
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: "bold", color: "#003366" }}>
                          📎 Documento Fiscal:
                        </p>
                        <a
                          href={s.arquivoFiscalURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-block",
                            marginTop: "4px",
                            color: "#007bff",
                            textDecoration: "underline",
                            wordBreak: "break-all",
                          }}
                        >
                          Ver arquivo anexado
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>
                    <strong>Produto Firestore:</strong> Não informado
                  </p>
                )}

                {s.documentoFiscalBase64 && (
                  <div
                    style={{
                      marginTop: "10px",
                      backgroundColor: "#f0f8ff",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #d0e0ff",
                    }}
                  >
                    <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#003366" }}>
                      📎 Documento Fiscal Anexado:
                    </p>
                    <a
                      href={s.documentoFiscalBase64}
                      target="_blank"
                      rel="noopener noreferrer"
                      type="application/pdf"
                    >
                      {s.nomeDocumento || "Abrir documento"}
                    </a>

                  </div>
                )}


                {/* Produto do Excel */}
                {produtoEncontrado ? (
                  <div
                    style={{
                      backgroundColor: "#d8ecf9",
                      padding: "10px",
                      borderRadius: "8px",
                      marginTop: "10px",
                      marginBottom: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Produto Base (Excel):
                    </p>
                    <p>
                      <strong>Código:</strong> {produtoEncontrado.codigo || "—"}
                    </p>
                    <p>
                      <strong>Descrição:</strong>{" "}
                      {produtoEncontrado.descricao || "—"}
                    </p>
                    {produtoEncontrado.preco && (
                      <p>
                        <strong>Preço:</strong> R$ {produtoEncontrado.preco}
                      </p>
                    )}
                    {produtoEncontrado.estoque && (
                      <p>
                        <strong>Estoque:</strong> {produtoEncontrado.estoque}
                      </p>
                    )}
                  </div>
                ) : (
                  <p>
                    <strong>Produto Base Excel:</strong> Não encontrado
                  </p>
                )}

                <p>
                  <strong>Origem:</strong> {s.origem}
                </p>
                {/* <p>
                  <strong>Destino:</strong> {s.destino}
                </p> */}
                <p>
                  <strong>Motivo:</strong> {s.motivo || "—"}
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
                            : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {s.status}
                  </span>
                </p>


                <a
                  href={s.documentoSolicitanteBase64}
                  target="_blank"
                  rel="noopener noreferrer"
                  type="application/pdf"
                >
                  {s.nomeDocumentoSolicitante || "Abrir documento"}
                </a>


                <p style={{ fontSize: "13px", color: "#777" }}>
                  Criado em:{" "}
                  {s.data ? new Date(s.data.seconds * 1000).toLocaleString() : "—"}
                </p>

                {(categoria === "Supervisor" || categoria === "Operacoes") && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      onClick={() => atualizarStatus(s.id, "Aprovado")}
                      style={{
                        backgroundColor: "green",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      ✅ Aprovar
                    </button>
                    <button
                      onClick={() => atualizarStatus(s.id, "Reprovado")}
                      style={{
                        backgroundColor: "red",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      ❌ Reprovar
                    </button>
                  </div>
                )}


                {/* === Edição para o Contábil === */}
                {/* === Edição e Aprovação para o Contábil === */}



                {categoria === "Contabil" && (
                  <div
                    style={{
                      marginTop: "15px",
                      borderTop: "1px solid #ccc",
                      paddingTop: "10px",
                    }}
                  >
                    <h4 style={{ marginBottom: "8px", textAlign: "center" }}>
                      Edição e Aprovação Contábil
                    </h4>

                    <input
                      type="text"
                      placeholder="Editar descrição do produto"
                      value={s.produto?.descricao || ""}
                      onChange={(e) =>
                        setSolicitacoes((prev) =>
                          prev.map((item) =>
                            item.id === s.id
                              ? {
                                ...item,
                                produto: { ...item.produto, descricao: e.target.value },
                              }
                              : item
                          )
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccccccff",
                        marginBottom: "8px",
                      }}
                    />

                    <input
                      type="number"
                      placeholder="Editar valor"
                      value={s.valor || ""}
                      onChange={(e) =>
                        setSolicitacoes((prev) =>
                          prev.map((item) =>
                            item.id === s.id ? { ...item, valor: e.target.value } : item
                          )
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        marginBottom: "8px",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <button
                        onClick={async () => {
                          const ref = doc(db, "solicitacoes", s.id);
                          await updateDoc(ref, {
                            "produto.descricao": s.produto?.descricao || "",
                            valor: s.valor || "",
                            editadoPor: usuario,
                            dataEdicao: new Date(),
                          });
                          alert("💾 Alterações salvas com sucesso!");
                        }}
                        style={{
                          backgroundColor: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 14px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        💾 Salvar
                      </button>

                      <button
                        onClick={async () => {
                          const ref = doc(db, "solicitacoes", s.id);
                          await updateDoc(ref, {
                            statusContabil: "Aprovado",
                            status: "Aprovado", // ✅ também muda o status geral
                            aprovadoPorContabil: usuario,
                            dataAprovacaoContabil: new Date(),
                          });

                          setSolicitacoes((prev) =>
                            prev.map((item) =>
                              item.id === s.id
                                ? { ...item, statusContabil: "Aprovado", status: "Aprovado" }
                                : item
                            )
                          );

                          alert("✅ Solicitação aprovada pelo Contábil!");
                        }}
                        style={{
                          backgroundColor: "green",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 14px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ✅ Aprovar
                      </button>

                      <button
                        onClick={async () => {
                          if (
                            window.confirm("Tem certeza que deseja reprovar esta solicitação?")
                          ) {
                            const ref = doc(db, "solicitacoes", s.id);
                            await updateDoc(ref, {
                              statusContabil: "Reprovado",
                              status: "Reprovado",
                              reprovadoPorContabil: usuario,
                              dataReprovacaoContabil: new Date(),
                            });

                            setSolicitacoes((prev) =>
                              prev.map((item) =>
                                item.id === s.id
                                  ? {
                                    ...item,
                                    status: "Reprovado",
                                    statusContabil: "Reprovado",
                                  }
                                  : item
                              )
                            );

                            alert("❌ Solicitação reprovada pelo Contábil!");
                          }
                        }}
                        style={{
                          backgroundColor: "red",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 14px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ❌ Reprovar
                      </button>
                    </div>
                  </div>
                )}

                {/* === Upload de arquivo para o Fiscal === */}
                {categoria === "Fiscal" && (
                  <div
                    style={{
                      marginTop: "15px",
                      borderTop: "1px solid #ccc",
                      paddingTop: "10px",
                    }}
                  >
                    <h4 style={{ marginBottom: "8px", textAlign: "center" }}>
                      Anexar Documento Fiscal
                    </h4>

                    <input
                      type="file"
                      accept="*/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          uploadArquivoFiscal(s.id, file);
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        marginBottom: "10px",
                      }}
                    />

                    {/* Exibir link se já tiver arquivo anexado */}
                    {s.arquivoFiscalURL && (
                      <p style={{ textAlign: "center" }}>
                        📎 <a href={s.arquivoFiscalURL} target="_blank" rel="noopener noreferrer">
                          Ver arquivo anexado
                        </a>
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <button
                        onClick={async () => {
                          const ref = doc(db, "solicitacoes", s.id);
                          await updateDoc(ref, {
                            statusFiscal: "Aprovado",
                            status: "Finalizado",
                            aprovadoPorFiscal: usuario,
                            dataAprovacaoFiscal: new Date(),
                          });
                          alert("✅ Solicitação finalizada pelo Fiscal!");
                        }}
                        style={{
                          backgroundColor: "green",
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 14px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ✅ Finalizar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


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

// 🔄 Animação CSS
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }",
  styleSheet.cssRules.length
);
