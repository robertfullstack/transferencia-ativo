import { useState } from "react";

export default function Login() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioValido = usuarios.find(
      (u) => u.nome === nome && u.senha === senha
    );

    if (usuarioValido) {
      alert("✅ Login realizado com sucesso!");
      setErro("");
    } else {
      setErro("Usuário ou senha incorretos");
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
          boxShadow: "0 0 25px rgba(0, 0, 0, 0.1)",
          width: "340px",
          textAlign: "center",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "22px" }}>Login</h2>

        <input
          type="text"
          placeholder="Usuário"
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

        {erro && (
          <p
            style={{
              color: "#d33",
              fontSize: "14px",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            {erro}
          </p>
        )}

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
          Entrar
        </button>
      </form>
    </div>
  );
}
