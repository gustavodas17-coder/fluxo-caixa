let saldo = 0;

function adicionarTransacao() {
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;

    if (!descricao || !valor) {
        alert("Preencha todos os campos!");
        return;
    }

    const lista = document.getElementById("lista");
    const item = document.createElement("li");

    if (tipo === "entrada") {
        saldo += valor;
        item.innerText = `${descricao}: + R$${valor}`;
    } else {
        saldo -= valor;
        item.innerText = `${descricao}: - R$${valor}`;
    }

    lista.appendChild(item);
    document.getElementById("saldo").innerText = saldo.toFixed(2);

    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
}