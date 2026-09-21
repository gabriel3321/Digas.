const numero = document.getElementById("numero");

const porcentagemFinal = 53.33;

let atual = 0;

const animacao = setInterval(() => {

    atual += 0.37;

    if (atual >= porcentagemFinal) {
        atual = porcentagemFinal;
        clearInterval(animacao);
    }

    numero.textContent = atual
        .toFixed(2)
        .replace(".", ",");

}, 15);
