import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ConsultarRecebimentos = () => {
    const [recebimentos, setRecebimentos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const fetchRecebimentos = async () => {
            setCarregando(true);

            // pega a loja do usuário logado
            const destinoLoja = localStorage.getItem("usuarioLoja");

            console.log("📌 Loja logada:", destinoLoja);

            if (!destinoLoja) {
                console.log("Nenhum perfil de loja encontrado no localStorage.");
                setCarregando(false);
                return;
            }

            try {
                // consulta no Firestore
                const q = query(
                    collection(db, "solicitacoes"),
                    where("destino", "==", destinoLoja)
                );

                const snapshot = await getDocs(q);

                console.log("📦 Total encontrados:", snapshot.size);

                const dados = snapshot.docs.map(doc => {
                    return {
                        id: doc.id,
                        ...doc.data()
                    };
                });

                setRecebimentos(dados);
            } catch (erro) {
                console.log("❌ Erro ao buscar recebimentos:", erro);
            }

            setCarregando(false);
        };

        fetchRecebimentos();
    }, []);

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

                        <h3>📄 Registro: {item.id}</h3>

                        <p><strong>Usuário:</strong> {item.usuario}</p>
                        <p><strong>Origem:</strong> {item.origem}</p>
                        <p><strong>Destino:</strong> {item.destino}</p>
                        <p><strong>Loja:</strong> {item.loja}</p>
                        <p><strong>Status Geral:</strong> {item.status}</p>

                        <p><strong>Motivo:</strong> {item.motivo}</p>
                        <p><strong>Categoria:</strong> {item.categoria}</p>
                        <p><strong>Valor:</strong> {item.valor}</p>
                        <p><strong>Código de Barras:</strong> {item.codigoBarras}</p>

                        <p><strong>Aprovado por Supervisor:</strong> {item.statusSupervisor}</p>
                        <p><strong>Aprovado por Fiscal:</strong> {item.statusFiscal}</p>
                        <p><strong>Aprovado por Contábil:</strong> {item.statusContabil}</p>
                        <p><strong>Aprovado por Operações:</strong> {item.statusOperacoes}</p>

                        <p><strong>Data Solicitação:</strong> {String(item.data)}</p>
                        <p><strong>Data Supervisor:</strong> {String(item.dataAprovacaoSupervisor)}</p>
                        <p><strong>Data Fiscal:</strong> {String(item.dataAprovacaoFiscal)}</p>
                        <p><strong>Data Contábil:</strong> {String(item.dataAprovacaoContabil)}</p>
                        <p><strong>Data Operações:</strong> {String(item.dataAprovacaoOperacoes)}</p>

                        <hr />

                        <h4>📦 Produto</h4>
                        <p><strong>Produto Código:</strong> {item.produto?.produtoCodigo}</p>
                        <p><strong>Produto Descrição:</strong> {item.produto?.produtoDescricao}</p>
                        <p><strong>Nº Inventário:</strong> {item.produto?.["Nº inventário"]}</p>
                        <p><strong>Denominação:</strong> {item.produto?.["Denominação do imobilizado"]}</p>
                        <p><strong>Empresa:</strong> {item.produto?.Empr}</p>

                        <hr />

                        <p><strong>Nome Documento:</strong> {item.nomeDocumento}</p>

                        {item.arquivoURL && (
                            <a
                                href={item.arquivoURL}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "blue", fontWeight: "bold" }}
                            >
                                📎 Abrir Documento
                            </a>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ConsultarRecebimentos;
