import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const q = query(
        collection(db, "usuarios"),
        where("nome", "==", nome),
        where("senha", "==", senha)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErro("Usuário ou senha inválidos");
      } else {
        const userData = querySnapshot.docs[0].data();
        localStorage.setItem("usuarioNome", userData.nome);
        localStorage.setItem("usuarioCategoria", userData.categoria);

        navigate("/home"); // depois ele pode ir pra /Solicitar
      }
    } catch (error) {
      console.error(error);
      setErro("Erro ao fazer login!");
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
        onSubmit={handleLogin}
        style={{
          backgroundColor: "#f7f7f7",
          padding: "40px",
          borderRadius: "12px",
          width: "340px",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ marginBottom: "25px" }}>Login do Sistema</h2>

        <input
          type="text"
          placeholder="Nome de usuário"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px",
            border: "1px solid #aaa",
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
            marginBottom: "10px",
            borderRadius: "6px",
            border: "1px solid #aaa",
          }}
        />

        {erro && (
          <p style={{ color: "#d33", fontWeight: "bold", marginBottom: "10px" }}>
            {erro}
          </p>
        )}

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
          Entrar
        </button>
      </form>
    </div>
  );
}
