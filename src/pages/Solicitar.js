import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// 🔹 IMPORTA O JSON LOCAL
import dataProdutos from "./BASE-ATUALIZADA-DEZ-25.json";

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

  // CARREGA DADOS DO USUÁRIO
  useEffect(() => {
    const nome = localStorage.getItem("usuarioNome");
    const cat = localStorage.getItem("usuarioCategoria");
    const lj = localStorage.getItem("usuarioLoja");

    if (nome) setUsuario(nome);
    if (cat) setCategoria(cat);
    if (lj) {
      setLoja(lj);
      setOrigem(lj);
    }
  }, []);

  // CONSULTA DO PRODUTO PELO NÚMERO DO INVENTÁRIO
  useEffect(() => {
    if (!codigoBarras.trim()) {
      setProduto(null);
      setMensagem("");
      return;
    }

    const encontrado = dataProdutos.find(
      (item) => String(item["Nº inventário"]) === String(codigoBarras)
    );

    if (encontrado) {
      setProduto(encontrado);
      setMensagem("✅ Produto encontrado!");
    } else {
      setProduto(null);
      setMensagem("⚠️ Produto não encontrado!");
    }
  }, [codigoBarras]);

  // ENVIAR SOLICITAÇÃO
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
        origem,
        destino,
        valor,
        motivo,

        // CÓDIGO DIGITADO
        codigoBarras,

        // 🔥 INFO COMPLETA DO PRODUTO
        produto: produto ? { ...produto } : null,

        // 🔥 INFO NO FORMATO PEDIDO
        produtoCodigo: produto ? produto["Nº inventário"] : "—",
        produtoDescricao: produto ? produto["Denominação do imobilizado"] : "—",

        status: "Pendente",
        statusFiscal: "Em análise",
        aprovadoPorFiscal: null,
        dataAprovacaoFiscal: null,

        documentoSolicitanteBase64: arquivoBase64 || null,
        nomeDocumentoSolicitante: nomeArquivo || null,

        data: new Date(),
      });

      setMensagem("✅ Solicitação enviada com sucesso!");
      setDestino("");
      setValor("");
      setCodigoBarras("");
      setProduto(null);
      setMotivo("");
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

        <input type="text" value={usuario} disabled style={inputEstilo(true)} />
        <input type="text" value={categoria} disabled style={inputEstilo(true)} />
        <input type="text" value={origem} disabled style={inputEstilo(true)} />

        {/* Código do produto */}
        <div style={containerInput}>
          <label style={labelEstilo(codigoBarras)}>Número do Património</label>
          <input
            type="text"
            value={codigoBarras}
            onChange={(e) => setCodigoBarras(e.target.value)}
            style={inputAnimado()}
          />
        </div>

        {/* 🔥 BLOCO IGUAL AO MODELO "Produto: Código: Descrição:" */}
        <div
          style={{
            background: "#eef0ff",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "left",
            marginBottom: "14px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <strong>Produto:</strong> <br />
          <strong>Código:</strong>{" "}
          {produto ? produto["Nº inventário"] : "—"} <br />
          <strong>Descrição:</strong>{" "}
          {produto ? produto["Denominação do imobilizado"] : "—"}
        </div>

        {/* Destino */}
        <div style={containerInput}>
          <label style={labelEstilo(destino)}>Destino</label>

          <select
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #aaa",
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "16px",
              transition: "all 0.3s ease",
            }}
          >
            <option value="-1" selected ></option>
            <option value="1001">1001 - Matriz</option>
            <option value="1002">1002 - Centro de Distribuição</option>
            <option value="1003">1003 - Escritório - Suporte</option>
            <option value="1021">1021 - Osasco - Primitiva Vianco</option>
            <option value="1023">1023 - Sto. Amaro - Floriano Peixoto</option>
            <option value="1024">1024 - Jabaquara</option>
            <option value="1030">1030 - Penha</option>
            <option value="1031">1031 - Suzano</option>
            <option value="1032">1032 - 24 de Maio</option>
            <option value="1034">1034 - Lapa</option>
            <option value="1036">1036 - Aricanduva</option>
            <option value="1037">1037 - Osasco</option>
            <option value="1038">1038 - Mogi das Cruzes</option>
            <option value="1039">1039 - Sto. Amaro - Adolfo Pinheiro</option>
            <option value="1040">1040 - São Bernardo</option>
            <option value="1041">1041 - Mauá Rua</option>
            <option value="1042">1042 - Guarulhos - Dom Pedro II</option>
            <option value="1043">1043 - Sto. André - Shopping Grand Plaza</option>
            <option value="1044">1044 - Guarulhos - Shopping</option>
            <option value="1045">1045 - Central Plaza Shopping</option>
            <option value="1046">1046 - Sto. André - Oliveira Lima</option>
            <option value="1047">1047 - Santos</option>
            <option value="1049">1049 - Sto. Amaro - Largo 13 de Maio</option>
            <option value="1050">1050 - Shopping Taboão</option>
            <option value="1051">1051 - Shopping Interlagos</option>
            <option value="1052">1052 - Vila Nova Cachoeirinha</option>
            <option value="1053">1053 - São Miguel</option>
            <option value="1054">1054 - Shopping Tatuapé</option>
            <option value="1055">1055 - Shopping Itaquera</option>
            <option value="1056">1056 - Itaquaquecetuba</option>
            <option value="1057">1057 - São Vicente</option>
            <option value="1058">1058 - Osasco - Shopping União</option>
            <option value="1059">1059 - Diadema</option>
            <option value="1060">1060 - Capão Redondo</option>
            <option value="1061">1061 - Mauá - Shopping Mauá</option>
            <option value="1062">1062 - Campinas</option>
            <option value="1065">1065 - Sto André - Shopping Atrium</option>
            <option value="1067">1067 - M Boi Mirim</option>
            <option value="1068">1068 - Shopping Cantareira</option>
            <option value="1069">1069 - São Mateus</option>
            <option value="1070">1070 - Parelheiros</option>
            <option value="1071">1071 - Shopping Aricanduva</option>
            <option value="1072">1072 - e-commerce</option>
          </select>
        </div>


        {/* Motivo */}
        <div style={containerInput}>
          <label style={labelEstilo(motivo)}>Motivo</label>

          <select
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            style={selectAnimado()}
          >
            <option value="" disabled>
              Motivo
            </option>

            <optgroup label="TRANSFERÊNCIA">
              <option value="Armazenagem (CD)">Armazenagem (CD)</option>
              <option value="Antigo">Antigo</option>
              <option value="Fora de uso">Fora de uso</option>
            </optgroup>

            <optgroup label="REPARO / DESCARTE">
              <option value="Reparo / Descarte">Reparo / Descarte</option>
              <option value="Mau uso">Mau uso</option>
              <option value="Desgaste">Desgaste</option>
              <option value="Garantia do fabricante">
                Garantia do fabricante
              </option>
            </optgroup>
          </select>
        </div>

        {/* Valor */}
        <div style={containerInput}>
          <label style={labelEstilo(valor)}>Valor</label>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            style={inputAnimado()}
          />
        </div>

        {/* Upload */}
        <label>Anexar Documento:</label>
        <input
          type="file"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
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

// === ESTILOS ===
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
});
