import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "ControleAtivos") {
      alert("✅ Acesso permitido!");
      setError("");
      navigate("/admin/cadastrar");
    } else {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fff",
        color: "#000",
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
        <h2
          style={{
            marginBottom: "25px",
            fontSize: "22px",
            letterSpacing: "1px",
            color: "#000",
          }}
        >
          Painel Admin
        </h2>

        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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

        {error && (
          <p
            style={{
              color: "#d33",
              fontSize: "14px",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            {error}
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
