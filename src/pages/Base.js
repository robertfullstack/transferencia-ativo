import React, { useState } from "react";
import * as XLSX from "xlsx";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Base = () => {
  const [arquivo, setArquivo] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const storage = getStorage();

  const handleArquivo = (e) => {
    const file = e.target.files[0];
    setArquivo(file);
  };

  const processarArquivo = async () => {
    if (!arquivo) {
      alert("⚠️ Selecione um arquivo Excel primeiro!");
      return;
    }

    setSalvando(true);
    setMensagem("Enviando arquivo...");

    try {
      // === 1️⃣ Upload do arquivo para o Firebase Storage ===
      const storageRef = ref(storage, `bases/${arquivo.name}`);
      await uploadBytes(storageRef, arquivo);
      const urlDownload = await getDownloadURL(storageRef);

      setMensagem(`✅ Arquivo salvo com sucesso! URL: ${urlDownload}`);

      // === 2️⃣ Ler o conteúdo do Excel ===
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const primeiraPlanilha = workbook.SheetNames[0];
        const sheet = workbook.Sheets[primeiraPlanilha];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        setProdutos(json);

        // === 3️⃣ Salvar os produtos no Firestore ===
        await salvarNoFirebase(json);
      };
      reader.readAsArrayBuffer(arquivo);
    } catch (erro) {
      console.error("Erro:", erro);
      alert("❌ Erro ao enviar o arquivo para o Firebase!");
    } finally {
      setSalvando(false);
    }
  };

  // === Função para salvar produtos no Firestore ===
  const salvarNoFirebase = async (dados) => {
    try {
      const produtosRef = collection(db, "produtos");

      for (const produto of dados) {
        await addDoc(produtosRef, produto);
      }

      setMensagem(
        `✅ Base salva com sucesso! ${dados.length} produtos adicionados.`
      );
    } catch (erro) {
      console.error("Erro ao salvar no Firestore:", erro);
      setMensagem("❌ Erro ao salvar os produtos no Firestore.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>📦 Base de Produtos</h2>

      <div style={styles.uploadBox}>
        <label style={styles.label}>Selecione o arquivo Excel (.xlsx):</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleArquivo}
          style={styles.input}
        />
        <button
          onClick={processarArquivo}
          style={styles.botao}
          disabled={salvando}
        >
          {salvando ? "Salvando..." : "Ler e Enviar"}
        </button>
        {mensagem && <p style={styles.mensagem}>{mensagem}</p>}
      </div>

      {/* Tabela dos produtos */}
      {produtos.length > 0 && (
        <div style={styles.tabelaContainer}>
          <h3 style={styles.subtitulo}>Produtos Carregados:</h3>
          <table style={styles.tabela}>
            <thead>
              <tr>
                {Object.keys(produtos[0]).map((chave, index) => (
                  <th key={index} style={styles.th}>
                    {chave}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto, i) => (
                <tr key={i}>
                  {Object.values(produto).map((valor, j) => (
                    <td key={j} style={styles.td}>
                      {valor}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 🎨 Estilos
const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#fff",
    minHeight: "100vh",
    color: "#333",
    fontFamily: "Arial, sans-serif",
  },
  titulo: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  uploadBox: {
    backgroundColor: "#f7f7f7",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    border: "1px solid #ddd",
    marginBottom: "25px",
    textAlign: "center",
  },
  input: {
    marginBottom: "10px",
  },
  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "8px",
  },
  botao: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  mensagem: {
    marginTop: "10px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  tabelaContainer: {
    marginTop: "30px",
    overflowX: "auto",
  },
  subtitulo: {
    marginBottom: "10px",
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f0f0f0",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
};

export default Base;
