let saldo = 0;
let transacoes = [];
let graficoAtual = null;

function adicionarTransacao() {
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
        descricao,
        quantidade,
        valor,
        total,
        tipo,
        data: new Date()
    };

    transacoes.push(transacao);

    const lista = document.getElementById("lista");
    const item = document.createElement("li");

    if (tipo === "entrada") {
        saldo += total;
        item.innerHTML = `${descricao} (${quantidade}x) <span style="color:green">+ R$${total.toFixed(2)}</span>`;
    } else {
        saldo -= total;
        item.innerHTML = `${descricao} (${quantidade}x) <span style="color:red">- R$${total.toFixed(2)}</span>`;
    }

    lista.appendChild(item);
    document.getElementById("saldo").innerText = saldo.toFixed(2);

    document.getElementById("descricao").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("valor").value = "";
}

function gerarRelatorio(periodo) {
    let entradas = 0;
    let saidas = 0;
    let produtosSaida = {};

    const agora = new Date();

    transacoes.forEach(transacao => {
        let incluir = false;

        const diffTempo = agora - transacao.data;
        const diffDias = diffTempo / (1000 * 60 * 60 * 24);

        if (periodo === "dia" && diffDias < 1) incluir = true;
        if (periodo === "semana" && diffDias <= 7) incluir = true;
        if (periodo === "mes" && diffDias <= 30) incluir = true;

        if (incluir) {
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
        <h3>Resumo</h3>
        <p><strong>Entradas:</strong> R$${entradas.toFixed(2)}</p>
        <p><strong>Saídas:</strong> R$${saidas.toFixed(2)}</p>
        <p><strong>Saldo:</strong> R$${(entradas - saidas).toFixed(2)}</p>
    `;

    gerarGrafico(produtosSaida);
}

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
            labels: labels,
            datasets: [{
                label: "Produtos mais vendidos",
                data: valores,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

function gerarRelatorioDia() {
    gerarRelatorio("dia");
}

function gerarRelatorioSemana() {
    gerarRelatorio("semana");
}

function gerarRelatorioMes() {
    gerarRelatorio("mes");
}