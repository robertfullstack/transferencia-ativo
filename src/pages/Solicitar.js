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
  const [motivo, setMotivo] = useState("");
const [arquivoSolicitar, setArquivoSolicitar] = useState(null);
const [arquivoBase64, setArquivoBase64] = useState(null);
const [nomeArquivo, setNomeArquivo] = useState("");
const converterParaBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


  // ======== CARREGA DADOS DO USUÁRIO ========
  useEffect(() => {
    const nome = localStorage.getItem("usuarioNome");
    const cat = localStorage.getItem("usuarioCategoria");
    const lj = localStorage.getItem("usuarioLoja");
    if (nome) setUsuario(nome);
    if (cat) setCategoria(cat);
    if (lj) {
      setLoja(lj);
      setOrigem(lj); // 👈 Origem automaticamente igual à Loja
    }
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
        ...produto,
      }
    : null,
  origem,
  destino,
  valor,
  motivo,
  status: "Pendente",

  // 🔹 Status do fiscal
  statusFiscal: "Em análise",
  aprovadoPorFiscal: null,
  dataAprovacaoFiscal: null,

  // 🔹 Documento anexado
  documentoSolicitanteBase64: arquivoBase64 || null,
  nomeDocumentoSolicitante: nomeArquivo || null,

  data: new Date(),
});



      setMensagem("✅ Solicitação enviada com sucesso!");
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
        {/* <input type="text" value={loja} disabled style={inputEstilo(true)} /> */}

        
       {/* Origem (preenchida automaticamente com a Loja) */}
        <input
          type="text"
          placeholder="Origem"
          value={origem}
          disabled // 👈 impede edição manual
          style={inputEstilo(true)}
        />

<div style={containerInput}>
  <label style={labelEstilo(codigoBarras)}>Código do produto</label>
  <input 
    type="text"
    value={codigoBarras}
    onChange={(e) => setCodigoBarras(e.target.value)}
    style={inputAnimado()}
  />
</div>


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

 
<div style={containerInput}>
  <label style={labelEstilo(destino)}>Destino</label>
  <input
    type="text"
    value={destino}
    onChange={(e) => setDestino(e.target.value)}
    style={inputAnimado()}
  />
</div>

        {/* Motivo */}
<div style={containerInput}>
  <label style={labelEstilo(motivo)}>Motivo</label>

  <select
    value={motivo}
    onChange={(e) => setMotivo(e.target.value)}
    style={selectAnimado()}
  >
    <option value="" disabled>Motivo</option>

    <optgroup label="TRANSFERÊNCIA (Apenas equipamentos completos em perfeito estado)">
      <option value="Armazenagem (CD)">Armazenagem (CD)</option>
      <option value="Antigo">Antigo</option>
      <option value="Fora de uso">Fora de uso</option>
    </optgroup>

    <optgroup label="REPARO / DESCARTE">
      <option value="Reparo / Descarte">Reparo / Descarte</option>
      <option value="Mau uso">Mau uso</option>
      <option value="Desgaste">Desgaste</option>
      <option value="Garantia do fabricante">Garantia do fabricante</option>
    </optgroup>
  </select>
</div>
<div style={containerInput}>
  <label style={labelEstilo(valor)}>Valor</label>
  <input
    type="number"
    value={valor}
    onChange={(e) => setValor(e.target.value)}
    style={inputAnimado()}
  />
</div>

<label>
  Anexar Documento:
</label>
<input
  type="file"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoSolicitar(file);
      setNomeArquivo(file.name);
      const base64 = await converterParaBase64(file);
      setArquivoBase64(base64);
    }
  }}
  style={{
    marginTop: "6px",
    marginBottom: "12px",
    padding: "6px",
  }}
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
const containerInput = {
  position: "relative",
  width: "100%",
  marginBottom: "18px",
};

const labelEstilo = (ativo) => ({
  position: "absolute",
  top: ativo ? "-8px" : "13px",
  left: "15px",
  fontSize: ativo ? "12px" : "15px",
  color: ativo ? "#000" : "#777",
  backgroundColor: "#fff",
  padding: "0 6px",
  transition: "all 0.2s ease",
  pointerEvents: "none",

});

const inputAnimado = () => ({
  width: "100%",
  padding: "14px 12px 10px",
  borderRadius: "6px",
  border: "1.5px solid #aaa",
  outline: "none",
  fontSize: "15px",
  transition: "0.2s",
  backgroundColor: "#fff",
});
const selectAnimado = () => ({
  width: "100%",
  padding: "14px 12px 10px",
  borderRadius: "6px",
  border: "1.5px solid #aaa",
  outline: "none",
  fontSize: "15px",
  backgroundColor: "#fff",
  appearance: "none",
  transition: "0.2s",
  backgroundImage:
    "linear-gradient(45deg, transparent 50%, #888 50%), linear-gradient(135deg, #888 50%, transparent 50%)",
  backgroundPosition:
    "calc(100% - 20px) calc(50% - 3px), calc(100% - 15px) calc(50% - 3px)",
  backgroundSize: "5px 5px, 5px 5px",
  backgroundRepeat: "no-repeat",
});
