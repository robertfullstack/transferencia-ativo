import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FaUserEdit, FaDatabase } from "react-icons/fa";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [view, setView] = useState("menu"); // menu | usuarios | base
  const [novoNome, setNovoNome] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "ControleAtivos") {
      setIsLogged(true);
      setError("");
    } else {
      setError("Usuário ou senha inválidos");
    }
  };

  const handleAddUsuario = async (e) => {
    e.preventDefault();
    try {
      if (!novoNome || !novaSenha || !categoria) {
        setMensagem("⚠️ Preencha todos os campos!");
        return;
      }

      await addDoc(collection(db, "usuarios"), {
        nome: novoNome,
        senha: novaSenha,
        categoria,
        criadoEm: new Date(),
      });

      setMensagem(`✅ Usuário "${novoNome}" criado como "${categoria}"!`);
      setNovoNome("");
      setNovaSenha("");
      setCategoria("");
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao salvar no Firebase!");
    }
  };

  // === TELA DE CADASTRAR NOVO USUÁRIO ===
  if (isLogged && view === "usuarios") {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          color: "#000",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "26px", marginBottom: "20px" }}>
          Cadastrar Novo Usuário
        </h1>

        <form
          onSubmit={handleAddUsuario}
          style={{
            backgroundColor: "#f7f7f7",
            padding: "30px",
            borderRadius: "10px",
            width: "320px",
            boxShadow: "0 0 20px rgba(0,0,0,0.1)",
            border: "1px solid #ddd",
          }}
        >
          <input
            type="text"
            placeholder="Nome do usuário"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
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
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #aaa",
            }}
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #aaa",
              backgroundColor: "#fff",
              color: "#000",
            }}
          >
            <option value="">Selecione a categoria</option>
            <option value="Adm Loja (Inicio do processo de transferência)">
              Adm Loja (Início do processo de transferência)
            </option>
            <option value="Supervisor">Supervisor</option>
            <option value="Operacoes">Operações</option>
            <option value="Contabil">Contábil</option>
            <option value="Adm Loja (Recebimentos)">
              Adm Loja (Recebimentos)
            </option>
          </select>

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
            Salvar
          </button>

          {mensagem && (
            <p
              style={{
                marginTop: "10px",
                color: mensagem.startsWith("✅") ? "green" : "#d33",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {mensagem}
            </p>
          )}
        </form>

        <button
          onClick={() => setView("menu")}
          style={{
            marginTop: "20px",
            background: "none",
            border: "1px solid #000",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Voltar
        </button>
      </div>
    );
  }

  // === TELA PRINCIPAL DO PAINEL ===
  if (isLogged && view === "menu") {
    const opcoes = [
      {
        nome: "Alterar Usuários",
        icone: <FaUserEdit size={40} />,
        acao: () => setView("usuarios"),
      },
      {
        nome: "Base",
        icone: <FaDatabase size={40} />,
        acao: () => setView("base"),
      },
    ];

    return (
      <div
        style={{
          backgroundColor: "#fff",
          color: "#000",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "40px" }}>
          Painel Administrativo
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "25px",
            width: "90%",
            maxWidth: "600px",
          }}
        >
          {opcoes.map((botao, index) => (
            <div
              key={index}
              onClick={botao.acao}
              style={{
                backgroundColor: "#f7f7f7",
                borderRadius: "12px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                padding: "25px",
                textAlign: "center",
                cursor: "pointer",
                transition: "0.3s",
                border: "1px solid #ddd",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 15px rgba(0,0,0,0.2)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 10px rgba(0,0,0,0.1)")
              }
            >
              <div style={{ marginBottom: "10px", color: "#000" }}>
                {botao.icone}
              </div>
              <p style={{ fontWeight: "bold", fontSize: "15px" }}>
                {botao.nome}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // === TELA DE LOGIN ===
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
        <h2 style={{ marginBottom: "25px", fontSize: "22px", color: "#000" }}>
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
