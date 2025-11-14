import React, { useState } from "react";
import base from "./BASE-ATUALIZADA-DEZ-25.json"; // <--- ajuste o nome exatamente como está no seu projeto

const Base = () => {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  const buscarItem = () => {
    if (!codigo.trim()) {
      setErro("Digite um número de inventário");
      setResultado(null);
      return;
    }

    const itemEncontrado = base.find(
      (item) => item["Nº inventário"] === codigo.trim()
    );

    if (itemEncontrado) {
      setResultado(itemEncontrado);
      setErro("");
    } else {
      setErro("Nenhum item encontrado.");
      setResultado(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Consulta de Inventário</h2>

      <input
        type="text"
        placeholder="Digite o Nº inventário"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        style={{ padding: "8px", width: "250px", marginRight: "10px" }}
      />

      <button onClick={buscarItem} style={{ padding: "8px 16px" }}>
        Consultar
      </button>

      {erro && (
        <p style={{ color: "red", marginTop: "20px" }}>
          {erro}
        </p>
      )}

      {resultado && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <p><b>Nº inventário:</b> {resultado["Nº inventário"]}</p>
          <p><b>Descrição:</b> {resultado["Denominação do imobilizado"]}</p>
          <p><b>Empresa:</b> {resultado["Empr"]}</p>
        </div>
      )}
    </div>
  );
};

export default Base;
