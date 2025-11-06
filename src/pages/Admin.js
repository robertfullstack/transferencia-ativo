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
  const [loja, setLoja] = useState(""); // 👈 novo estado
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

    if (!novoNome || !novaSenha || !categoria || !loja) {
      setMensagem("⚠️ Preencha todos os campos!");
      return;
    }

    try {
      await addDoc(collection(db, "usuarios"), {
        nome: novoNome,
        senha: novaSenha,
        categoria,
        loja,
        criadoEm: new Date(),
      });

      setMensagem(`✅ Usuário "${novoNome}" criado na ${loja} como "${categoria}"!`);
      setNovoNome("");
      setNovaSenha("");
      setCategoria("");
      setLoja("");
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

          {/* 👇 NOVO SELECT DE LOJA */}
          <select
            value={loja}
            onChange={(e) => setLoja(e.target.value)}
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
           <option value="-1">Selecione a loja</option>
	<option value="1001">1001 - Matriz</option>
	<option value="1002">1002 - Centro de Distribuição</option>
	<option value="1003">1003 - Escritório - Suporte</option>
	<option value="1021">1021 - Osasco - Primitiva Vianco</option>
	<option value="1023">1023 - Sto. Amaro - Floriano Peixoto</option>
	<option value="1024">1024 - Jabaquara</option>
	<option value="1030">1030 - Penha</option>
	<option value="1031">1031 - Suzano</option>
	<option value="1032">1032 - 24 de Maio</option>
	<option value="1034">1034 - Lapa</option>
	<option value="1036">1036 - Aricanduva</option>
	<option value="1037">1037 - Osasco</option>
	<option value="1038">1038 - Mogi das Cruzes</option>
	<option value="1039">1039 - Sto. Amaro - Adolfo Pinheiro</option>
	<option value="1040">1040 - São Bernardo</option>
	<option value="1041">1041 - Mauá Rua</option>
	<option value="1042">1042 - Guarulhos - Dom Pedro II</option>
	<option value="1043">1043 - Sto. André - Shopping Grand Plaza</option>
	<option value="1044">1044 - Guarulhos - Shopping</option>
	<option value="1045">1045 - Central Plaza Shopping</option>
	<option value="1046">1046 - Sto. André - Oliveira Lima</option>
	<option value="1047">1047 - Santos</option>
	<option value="1049">1049 - Sto. Amaro - Largo 13 de Maio</option>
	<option value="1050">1050 - Shopping Taboão</option>
	<option value="1051">1051 - Shopping Interlagos</option>
	<option value="1052">1052 - Vila Nova Cachoeirinha</option>
	<option value="1053">1053 - São Miguel</option>
	<option value="1054">1054 - Shopping Tatuapé</option>
	<option value="1055">1055 - Shopping Itaquera</option>
	<option value="1056">1056 - Itaquaquecetuba</option>
	<option value="1057">1057 - São Vicente</option>
	<option value="1058">1058 - Osasco - Shopping União</option>
	<option value="1059">1059 - Diadema</option>
	<option value="1060">1060 - Capão Redondo</option>
	<option value="1061">1061 - Mauá - Shopping Mauá</option>
	<option value="1062">1062 - Campinas</option>
	<option value="1065">1065 - Sto André - Shopping Atrium</option>
	<option value="1067">1067 - M Boi Mirim</option>
	<option value="1068">1068 - Shopping Cantareira</option>
	<option value="1069">1069 - São Mateus</option>
	<option value="1070">1070 - Parelheiros</option>
	<option value="1071">1071 - Shopping Aricanduva</option>
	<option value="1072">1072 - e-commerce</option>
          </select>

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

  // === RESTANTE DO CÓDIGO (Painel e Login) MANTIDO IGUAL ===
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

  // === LOGIN ADMIN ===
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
