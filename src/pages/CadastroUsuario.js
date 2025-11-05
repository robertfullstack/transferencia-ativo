import { useState } from "react";

export default function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nome || !senha) {
      setMensagem("⚠️ Preencha todos os campos!");
      return;
    }

    // Salvando no localStorage (simulando banco)
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios.push({ nome, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    setMensagem("✅ Usuário cadastrado com sucesso!");
    setNome("");
    setSenha("");
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
          boxShadow: "0 0 25px rgba(0, 0, 0, 0.1)",
          width: "340px",
          textAlign: "center",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "22px" }}>
          Cadastrar Usuário
        </h2>

        <input
          type="text"
          placeholder="Nome de usuário"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "6px",
            border: "1px solid #aaa",
            backgroundColor: "#fff",
            color: "#000",
            fontSize: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "6px",
            border: "1px solid #aaa",
            backgroundColor: "#fff",
            color: "#000",
            fontSize: "15px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#000",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
            fontSize: "15px",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#000")}
        >
          Cadastrar
        </button>

        {mensagem && (
          <p
            style={{
              marginTop: "15px",
              fontSize: "14px",
              fontWeight: "bold",
              color: mensagem.includes("✅") ? "green" : "red",
            }}
          >
            {mensagem}
          </p>
        )}
      </form>
    </div>
  );
}
