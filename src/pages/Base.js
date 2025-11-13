import React, { useState } from "react";
import * as XLSX from "xlsx";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

const Base = () => {
  const [, setData] = useState([]);
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });

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
    setProgress({ current: 0, total: jsonData.length, percent: 0 });

    try {
      let count = 0;
      for (const item of jsonData) {
        const codigo = item[Object.keys(item)[1]]; // 2ª coluna
        const descricao = item[Object.keys(item)[2]]; // 3ª coluna
        if (!codigo || !descricao) continue;

        await addDoc(collectionRef, { codigo, descricao });
        count++;

        // Atualiza progresso
        const percent = Math.round((count / jsonData.length) * 100);
        setProgress({ current: count, total: jsonData.length, percent });
      }

      alert("✅ Base salva com sucesso no Firebase!");
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

      {loading && (
        <div style={styles.overlay}>
          <div style={styles.loaderBox}>
            <div style={styles.spinner}></div>
            <p style={{ fontSize: 18, marginTop: 10 }}>⏳ Enviando base...</p>
            <p>
              <b>
                {progress.current}/{progress.total}
              </b>{" "}
              produtos enviados
            </p>

            {/* Barra de progresso */}
            <div style={styles.progressBarContainer}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${progress.percent}%`,
                }}
              ></div>
            </div>
            <p>{progress.percent}% concluído</p>
          </div>
        </div>
      )}

      <input
        type="text"
        placeholder="Digite o código de barras"
        value={barcodeQuery}
        onChange={(e) => setBarcodeQuery(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleQuery} disabled={loading} style={styles.button}>
        Consultar
      </button>

      {result ? (
        <div style={{ marginTop: 20 }}>
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

// ======== ESTILOS ========
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  },
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
    width: "50px",
    height: "50px",
    border: "5px solid #fff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  progressBarContainer: {
    width: "300px",
    height: "10px",
    backgroundColor: "#444",
    borderRadius: "5px",
    overflow: "hidden",
    marginTop: "15px",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4caf50",
    transition: "width 0.3s ease",
  },
  input: {
    marginTop: "20px",
    padding: "8px",
    width: "250px",
  },
  button: {
    marginLeft: "10px",
    padding: "8px 15px",
    cursor: "pointer",
  },
};

// 🔄 Animação CSS (pode colocar no index.css também)
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }",
  styleSheet.cssRules.length
);

export default Base;
