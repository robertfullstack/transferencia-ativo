import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import confetti from "canvas-confetti"; // 🔥 biblioteca para fogos

const ConsultarRecebimentos = () => {
    const [recebimentos, setRecebimentos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        fetchRecebimentos();
    }, []);

    const fetchRecebimentos = async () => {
        setCarregando(true);
        const destinoLoja = localStorage.getItem("usuarioLoja");

        if (!destinoLoja) {
            setCarregando(false);
            return;
        }

        try {
            const q = query(
                collection(db, "solicitacoes"),
                where("destino", "==", destinoLoja)
            );
            const snapshot = await getDocs(q);
            const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRecebimentos(dados);
        } catch (erro) {
            console.log("❌ Erro ao buscar recebimentos:", erro);
        }

        setCarregando(false);
    };

    const handleRecebimento = async (itemId) => {
        try {
            const docRef = doc(db, "solicitacoes", itemId);
            const usuario = localStorage.getItem("nome") || "Usuário";

            await updateDoc(docRef, {
                status: "Recebimento Concluído",
                recebidoPorLoja: usuario,
                dataRecebimento: new Date()
            });

            // 🎆 Animação de fogos
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });

            alert("✅ Recebimento registrado e enviado para o Fiscal!");
            fetchRecebimentos();
        } catch (erro) {
            console.error("❌ Erro ao atualizar recebimento:", erro);
            alert("❌ Erro ao registrar recebimento.");
        }
    };

    if (carregando) return <p>Carregando recebimentos...</p>;

    return (
        <div style={{ padding: 20 }}>
            <h1>Consultar Recebimentos</h1>

            {recebimentos.length === 0 ? (
                <p>Nenhum recebimento encontrado para sua loja.</p>
            ) : (
                recebimentos.map(item => (
                    <div
                        key={item.id}
                        style={{
                            marginBottom: 20,
                            padding: 15,
                            borderRadius: 8,
                            background: "#f4f4f4",
                            border: "1px solid #ccc"
                        }}
                    >

                        <h3>Registro: {item.id}</h3>

                        <p><strong>Solicitante:</strong> {item.usuario}, {item.categoria}</p>
                        <p><strong>Origem do Item:</strong> {item.origem}</p>
                        <p><strong>Destino do Item:</strong> {item.destino}</p>
                        {/* <p><strong>Loja:</strong> {item.loja}</p> */}
                        <p><strong>Status Geral:</strong> {item.status}</p>

                        <p><strong>Motivo:</strong> {item.motivo}</p>

                        <p><strong>Código do Produto:</strong> {item.codigoBarras}</p>
                        <p><strong>Descrição do Produto:</strong> {item.produto?.["Denominação do imobilizado"]}</p>
                        <p><strong>Nº Inventário:</strong> {item.produto?.["Nº inventário"]}</p>
                        <p><strong>Empresa:</strong> {item.produto?.Empr}</p>

                        <p><strong>Valor:</strong> R$ {item.valor}</p>


                        <p>
                            <strong>Data Solicitação:</strong>{" "}
                            {item.data ? item.data.toDate().toLocaleString("pt-BR") : "Sem data"}
                        </p>

                        <p>
                            <strong>Aprovado por Supervisor:</strong> {item.statusSupervisor},{" "}
                            {item.dataAprovacaoSupervisor
                                ? item.dataAprovacaoSupervisor.toDate().toLocaleString("pt-BR")
                                : "Sem data"}
                        </p>

                        <p>
                            <strong>Aprovado por Operações:</strong> {item.statusOperacoes},{" "}
                            {item.dataAprovacaoOperacoes
                                ? item.dataAprovacaoOperacoes.toDate().toLocaleString("pt-BR")
                                : "Sem data"}
                        </p>

                        <p>
                            <strong>Aprovado por Contábil:</strong> {item.statusContabil},{" "}
                            {item.dataAprovacaoContabil
                                ? item.dataAprovacaoContabil.toDate().toLocaleString("pt-BR")
                                : "Sem data"}
                        </p>

                        <p>
                            <strong>Aprovado por Fiscal:</strong> {item.statusFiscal},{" "}
                            {item.dataAprovacaoFiscal
                                ? item.dataAprovacaoFiscal.toDate().toLocaleString("pt-BR")
                                : "Sem data"}
                        </p>

                        <hr />

                        <p>
                            <strong>Nome Documento:</strong>{" "}
                            {item.documentoFiscalBase64 ? (
                                <a
                                    href={item.documentoFiscalBase64}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "blue", textDecoration: "underline" }}
                                >
                                    {item.nomeDocumento}
                                </a>
                            ) : (
                                item.nomeDocumento || "Nenhum documento"
                            )}
                        </p>
                        {/* Botão para registrar recebimento */}
                        {item.status !== "Recebimento Concluído" ? (
                            <button
                                onClick={() => handleRecebimento(item.id)}
                                style={{
                                    marginTop: 10,
                                    backgroundColor: "green",
                                    color: "#fff",
                                    padding: "8px 16px",
                                    border: "none",
                                    borderRadius: 6,
                                    cursor: "pointer"
                                }}
                            >
                                Ok, recebimento realizado
                            </button>
                        ) : (
                            <p style={{ fontWeight: "bold", color: "blue", marginTop: 10 }}>
                                ✅ Recebimento Concluído
                            </p>
                        )}

                        <hr style={{ marginTop: 15 }} />
                    </div>
                ))
            )}
        </div >
    );
};

export default ConsultarRecebimentos;
