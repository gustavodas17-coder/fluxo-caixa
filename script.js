import {
    auth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    collection,
    addDoc,
    getDocs
} from "./firebase.js";

let saldo = 0;
let transacoes = [];
let graficoAtual = null;

window.cadastrar = async function () {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        await createUserWithEmailAndPassword(auth, email, senha);
        alert("Cadastro realizado!");
    } catch (error) {
        alert(error.message);
    }
};

window.login = async function () {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        await signInWithEmailAndPassword(auth, email, senha);
        alert("Login realizado!");
    } catch (error) {
        alert(error.message);
    }
};

window.logout = async function () {
    await signOut(auth);
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById("auth-area").style.display = "none";
        document.getElementById("app-area").style.display = "block";

        carregarTransacoes(user.uid);
    } else {
        document.getElementById("auth-area").style.display = "block";
        document.getElementById("app-area").style.display = "none";
    }
});

window.adicionarTransacao = async function () {
    const user = auth.currentUser;

    const descricao = document.getElementById("descricao").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const valor = parseFloat(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;

    if (!descricao || !quantidade || !valor) {
        alert("Preencha todos os campos!");
        return;
    }

    const total = quantidade * valor;

    const transacao = {
        uid: user.uid,
        descricao,
        quantidade,
        valor,
        total,
        tipo,
        data: new Date().toISOString()
    };

    await addDoc(collection(db, "transacoes"), transacao);

    carregarTransacoes(user.uid);

    document.getElementById("descricao").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("valor").value = "";
};

async function carregarTransacoes(uid) {
    transacoes = [];
    saldo = 0;

    const snapshot = await getDocs(collection(db, "transacoes"));

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    snapshot.forEach(doc => {
        const transacao = doc.data();

        if (transacao.uid === uid) {
            transacoes.push(transacao);
        }
    });

    transacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

    transacoes.forEach(transacao => {
        if (transacao.tipo === "entrada") {
            saldo += transacao.total;
        } else {
            saldo -= transacao.total;
        }
    });

    const ultimas = transacoes.slice(0, 10);

    ultimas.forEach(transacao => {
        const item = document.createElement("li");

        const dataFormatada = new Date(transacao.data).toLocaleDateString("pt-BR");

        if (transacao.tipo === "entrada") {
            item.innerHTML =
                `${transacao.descricao} (${transacao.quantidade}x) - ${dataFormatada}
                <span style="color:green"> + R$${transacao.total.toFixed(2)}</span>`;
        } else {
            item.innerHTML =
                `${transacao.descricao} (${transacao.quantidade}x) - ${dataFormatada}
                <span style="color:red"> - R$${transacao.total.toFixed(2)}</span>`;
        }

        lista.appendChild(item);
    });

    document.getElementById("saldo").innerText = saldo.toFixed(2);
}

window.filtrarPeriodo = function () {
    const inicio = new Date(document.getElementById("dataInicio").value);
    const fim = new Date(document.getElementById("dataFim").value);

    inicio.setHours(0, 0, 0, 0);
    fim.setHours(23, 59, 59, 999);

    let entradas = 0;
    let saidas = 0;
    let produtosSaida = {};

    transacoes.forEach(transacao => {
        const dataTransacao = new Date(transacao.data);

        if (dataTransacao >= inicio && dataTransacao <= fim) {
            if (transacao.tipo === "entrada") {
                entradas += transacao.total;
            } else {
                saidas += transacao.total;

                produtosSaida[transacao.descricao] =
                    (produtosSaida[transacao.descricao] || 0) + transacao.quantidade;
            }
        }
    });

    document.getElementById("relatorio").innerHTML = `
        <h3>Resumo do Período</h3>
        <p><strong>Entradas:</strong> R$${entradas.toFixed(2)}</p>
        <p><strong>Saídas:</strong> R$${saidas.toFixed(2)}</p>
        <p><strong>Saldo:</strong> R$${(entradas - saidas).toFixed(2)}</p>
    `;

    gerarGrafico(produtosSaida);
};

function gerarGrafico(produtos) {
    const labels = Object.keys(produtos);
    const valores = Object.values(produtos);

    const ctx = document.getElementById("grafico").getContext("2d");

    if (graficoAtual) {
        graficoAtual.destroy();
    }

    graficoAtual = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Produtos vendidos",
                data: valores,
                borderWidth: 1
            }]
        }
    });
}