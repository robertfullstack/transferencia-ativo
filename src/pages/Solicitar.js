import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Solicitar() {
  const [usuario, setUsuario] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loja, setLoja] = useState("");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [valor, setValor] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [produto, setProduto] = useState(null);
  const [mensagem, setMensagem] = useState("");

  // ======== CARREGA DADOS DO USUÁRIO ========
  useEffect(() => {
    const nome = localStorage.getItem("usuarioNome");
    const cat = localStorage.getItem("usuarioCategoria");
    const lj = localStorage.getItem("usuarioLoja");
    if (nome) setUsuario(nome);
    if (cat) setCategoria(cat);
    if (lj) setLoja(lj);
  }, []);

  // ======== CONSULTA PRODUTO PELO CÓDIGO DE BARRAS ========
  useEffect(() => {
    const buscarProduto = async () => {
      if (!codigoBarras.trim()) {
        setProduto(null);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "produtos"));
        const produtos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // procura o produto pelo campo "codigo"
        const encontrado = produtos.find(
          (p) => String(p.codigo).trim() === String(codigoBarras).trim()
        );

        if (encontrado) {
          setProduto(encontrado);
          setMensagem("✅ Produto encontrado!");
        } else {
          setProduto(null);
          setMensagem("⚠️ Produto não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao consultar produto:", error);
        setMensagem("❌ Erro ao consultar produto.");
      }
    };

    buscarProduto();
  }, [codigoBarras]);

  // ======== ENVIAR SOLICITAÇÃO ========
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario || !loja || !origem || !destino || !valor || !codigoBarras) {
      setMensagem("⚠️ Preencha todos os campos!");
      return;
    }

    try {
      await addDoc(collection(db, "solicitacoes"), {
        usuario,
        categoria,
        loja,
        codigoBarras,
        produto: produto
          ? {
              id: produto.id || null,
              codigo: produto.codigo || "",
              descricao: produto.descricao || "",
              preco: produto.preco || null,
              estoque: produto.estoque || null,
              ...produto, // caso tenha mais campos no Firestore
            }
          : null,
        origem,
        destino,
        valor,
        status: "Pendente",
        data: new Date(),
      });

      setMensagem("✅ Solicitação enviada com sucesso!");
      setOrigem("");
      setDestino("");
      setValor("");
      setCodigoBarras("");
      setProduto(null);
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      setMensagem("❌ Erro ao enviar solicitação.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        color: "#000",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#f7f7f7",
          padding: "40px",
          borderRadius: "12px",
          width: "380px",
          textAlign: "center",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Solicitar Transferência</h2>

        <input type="text" value={usuario} disabled style={inputEstilo(true)} />
        <input type="text" value={categoria} disabled style={inputEstilo(true)} />
        <input type="text" value={loja} disabled style={inputEstilo(true)} />

        {/* Código de Barras */}
        <input
          type="text"
          placeholder="Código de Barras do Produto"
          value={codigoBarras}
          onChange={(e) => setCodigoBarras(e.target.value)}
          style={inputEstilo()}
        />

        {/* Mostrar informações do produto */}
        {produto && (
          <div
            style={{
              background: "#e6f5e8",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            <strong>Código:</strong> {produto.codigo} <br />
            <strong>Descrição:</strong> {produto.descricao || "—"} <br />
            {produto.preco && (
              <>
                <strong>Preço:</strong> R$ {produto.preco} <br />
              </>
            )}
            {produto.estoque && (
              <>
                <strong>Estoque:</strong> {produto.estoque}
              </>
            )}
          </div>
        )}

        {/* Origem / Destino / Valor */}
        <input
          type="text"
          placeholder="Origem"
          value={origem}
          onChange={(e) => setOrigem(e.target.value)}
          style={inputEstilo()}
        />
        <input
          type="text"
          placeholder="Destino"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          style={inputEstilo()}
        />
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={inputEstilo()}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#000",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Enviar Solicitação
        </button>

        {mensagem && (
          <p
            style={{
              marginTop: "12px",
              color: mensagem.startsWith("✅")
                ? "green"
                : mensagem.startsWith("⚠️")
                ? "#c58f00"
                : "#d33",
              fontWeight: "bold",
            }}
          >
            {mensagem}
          </p>
        )}
      </form>
    </div>
  );
}

// ======== Estilo dos inputs ========
const inputEstilo = (disabled = false) => ({
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #aaa",
  backgroundColor: disabled ? "#eee" : "#fff",
  fontWeight: disabled ? "bold" : "normal",
});
