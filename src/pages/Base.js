import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

const Base = () => {
  const [data, setData] = useState([]);
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ======== LER ARQUIVO EXCEL ========
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log("📘 Dados lidos do Excel:", jsonData);
      setData(jsonData);

      await saveDataToFirestore(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  // ======== SALVAR NO FIRESTORE ========
  const saveDataToFirestore = async (jsonData) => {
    setLoading(true);
    const collectionRef = collection(db, "produtos");

    try {
      // 🔹 Limita a quantidade de dados e salva com await correto
      for (const item of jsonData) {
        const codigo = item[Object.keys(item)[1]]; // 2ª coluna
        const descricao = item[Object.keys(item)[2]]; // 3ª coluna

        if (!codigo || !descricao) continue; // ignora linhas vazias

        await addDoc(collectionRef, { codigo, descricao });
        console.log(`✅ Adicionado: ${codigo} - ${descricao}`);
      }
      alert("Base salva com sucesso no Firebase!");
    } catch (error) {
      console.error("❌ Erro ao salvar no Firestore:", error);
      alert("Erro ao salvar no Firebase. Veja o console.");
    } finally {
      setLoading(false);
    }
  };

  // ======== CONSULTAR NO FIRESTORE ========
  const handleQuery = async () => {
    if (!barcodeQuery) return;
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "produtos"));
      const allProducts = querySnapshot.docs.map((doc) => doc.data());

      console.log("📦 Produtos no Firestore:", allProducts);

      const found = allProducts.find(
        (item) => String(item.codigo) === String(barcodeQuery)
      );
      setResult(found || null);
    } catch (err) {
      console.error("Erro ao consultar:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📂 Upload e Consulta de Base</h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        disabled={loading}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Digite o código de barras"
        value={barcodeQuery}
        onChange={(e) => setBarcodeQuery(e.target.value)}
      />
      <button onClick={handleQuery} disabled={loading}>
        Consultar
      </button>

      {loading && <p>⏳ Processando...</p>}

      {result ? (
        <div>
          <h3>Resultado:</h3>
          <p>
            <b>Código:</b> {result.codigo}
          </p>
          <p>
            <b>Descrição:</b> {result.descricao}
          </p>
        </div>
      ) : (
        barcodeQuery && !loading && <p>Nenhum item encontrado.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
};

export default Base;
