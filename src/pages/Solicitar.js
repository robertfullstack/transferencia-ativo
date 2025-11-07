import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { collection, addDoc } from "firebase/firestore";
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
  const [dadosExcel, setDadosExcel] = useState([]);

  useEffect(() => {
    const nome = localStorage.getItem("usuarioNome");
    const cat = localStorage.getItem("usuarioCategoria");
    const lj = localStorage.getItem("usuarioLoja");
    if (nome) setUsuario(nome);
    if (cat) setCategoria(cat);
    if (lj) setLoja(lj);

    // Carrega a planilha Excel automaticamente ao iniciar
    carregarPlanilha();
  }, []);

  // Lê o arquivo Excel do projeto (ex: public/produtos.xlsx)
  const carregarPlanilha = async () => {
    try {
      const response = await fetch("/produtos.xlsx"); // Coloque o arquivo em /public
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Matriz (array de arrays)
      setDadosExcel(json);
    } catch (error) {
      console.error("Erro ao carregar planilha:", error);
    }
  };

  const buscarProdutoPorCodigo = () => {
    if (!codigoBarras.trim() || dadosExcel.length === 0) return;

    // Começa da linha 1 (ignorando o cabeçalho)
    const encontrado = dadosExcel.find((linha, index) => index > 0 && linha[1] === codigoBarras);

    if (encontrado) {
      // Supondo estrutura: [Nome, CódigoBarras, Descrição, Estoque, Valor]
      const produtoInfo = {
        nome: encontrado[0],
        codigoBarras: encontrado[1],
        descricao: encontrado[2],
        estoque: encontrado[3],
        preco: encontrado[4],
      };
      setProduto(produtoInfo);
      setMensagem("✅ Produto encontrado!");
    } else {
      setProduto(null);
      setMensagem("⚠️ Produto não encontrado na planilha!");
    }
  };

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
        produto: produto ? produto.nome : "Produto não encontrado",
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
      console.error(error);
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

        {/* Nome */}
        <input type="text" value={usuario} disabled style={inputEstilo(true)} />

        {/* Categoria */}
        <input type="text" value={categoria} disabled style={inputEstilo(true)} />

        {/* Loja */}
        <input type="text" value={loja} disabled style={inputEstilo(true)} />

        {/* Código de Barras */}
        <input
          type="text"
          placeholder="Código de Barras do Produto/Item"
          value={codigoBarras}
          onChange={(e) => setCodigoBarras(e.target.value)}
          onBlur={buscarProdutoPorCodigo}
          style={inputEstilo()}
        />

        {/* Exibir info do produto */}
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
            <strong>Produto:</strong> {produto.nome} <br />
            <strong>Descrição:</strong> {produto.descricao || "—"} <br />
            <strong>Estoque:</strong> {produto.estoque || "—"} <br />
            <strong>Preço:</strong> {produto.preco || "—"}
          </div>
        )}

        {/* Origem */}
        <input
          type="text"
          placeholder="Origem"
          value={origem}
          onChange={(e) => setOrigem(e.target.value)}
          style={inputEstilo()}
        />

        {/* Destino */}
        <input
          type="text"
          placeholder="Destino"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          style={inputEstilo()}
        />

        {/* Valor */}
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

// Função de estilo para inputs
const inputEstilo = (disabled = false) => ({
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #aaa",
  backgroundColor: disabled ? "#eee" : "#fff",
  fontWeight: disabled ? "bold" : "normal",
});
