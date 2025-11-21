import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Logo from './logo.png'

export default function Login() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      let usuarioEncontrado = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.nome === nome && data.senha === senha) {
          usuarioEncontrado = data;
        }
      });

      if (usuarioEncontrado) {
        localStorage.setItem("usuarioNome", usuarioEncontrado.nome);
        localStorage.setItem("usuarioCategoria", usuarioEncontrado.categoria);
        localStorage.setItem("usuarioLoja", usuarioEncontrado.loja);

        if (usuarioEncontrado.categoria === "Fiscal") {
          navigate("/fiscal");
        } else {
          navigate("/home");
        }
      } else {
        setErro("Usuário ou senha inválidos!");
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setErro("Erro ao conectar ao servidor!");
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#fff",
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
            width: "360px",
            textAlign: "center",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
            border: "1px solid #ddd",
          }}
        >

          {/* 🔹 LOGO ACIMA DO TÍTULO */}


          <h2 style={{ marginBottom: "20px" }}>Login</h2>

          <input
            type="text"
            placeholder="Usuário"
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
            <p
              style={{
                color: "#d33",
                fontWeight: "bold",
                fontSize: "14px",
                marginTop: "5px",
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



      {/* 🔹 LEGENDA DISCRETA NO CANTO INFERIOR DIREITO */}
      <div
        style={{
          position: "fixed",
          bottom: "8px",
          right: "12px",
          fontSize: "12px",
          color: "rgba(0, 0, 0, 0.61)",
          userSelect: "none",
          pointerEvents: "none",
          textAlign: "right",
        }}
      >

        <img
          src={Logo} // coloque aqui o nome exato do arquivo da sua logo
          alt="Logo"
          style={{
            width: "120px",
            marginBottom: "-30px",
            marginTop: "-30px",
            opacity: 0.95, // deixa mais suave
          }}
        />
        <div>Controle de Ativos - Transferência de Ativos</div>
        <div>Versão 1.8 - 17/11/2025</div>
      </div>
    </>
  );
}
