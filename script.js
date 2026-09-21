// ======================================
// CONFIGURAÇÃO DO CURSO
// ======================================

const TOTAL_AULAS = 90;

const AULAS_INICIAIS = 48;

const DATA_INICIAL = "20/09/2026";


// ======================================
// ELEMENTOS DA PÁGINA
// ======================================

const numero =
    document.getElementById("numero");

const barraProgresso =
    document.getElementById("barraProgresso");

const aulasTexto =
    document.getElementById("aulasTexto");

const dataAtualizacao =
    document.getElementById("dataAtualizacao");

const porcentagemMensagem =
    document.getElementById("porcentagemMensagem");

const botaoSecreto =
    document.getElementById("botaoSecreto");

const painelSecreto =
    document.getElementById("painelSecreto");

const aulasConcluidas =
    document.getElementById("aulasConcluidas");

const salvarProgresso =
    document.getElementById("salvarProgresso");


// ======================================
// CARREGAR DADOS SALVOS
// ======================================

let aulasSalvas =
    localStorage.getItem("aulasConcluidas");

let dataSalva =
    localStorage.getItem("dataAtualizacao");


if (aulasSalvas === null) {

    aulasSalvas = AULAS_INICIAIS;

}


if (dataSalva === null) {

    dataSalva = DATA_INICIAL;

}


aulasSalvas =
    Number(aulasSalvas);


// ======================================
// CALCULAR PORCENTAGEM
// ======================================

function calcularPorcentagem(aulas) {

    return (aulas / TOTAL_AULAS) * 100;

}


// ======================================
// FORMATAR PORCENTAGEM
// ======================================

function formatarPorcentagem(valor) {

    return valor
        .toFixed(2)
        .replace(".", ",");

}


// ======================================
// ATUALIZAR O SITE
// ======================================

function atualizarSite(aulas, data) {

    const porcentagem =
        calcularPorcentagem(aulas);


    // Atualiza aulas

    aulasTexto.textContent =
        aulas +
        " / " +
        TOTAL_AULAS +
        " AULAS";


    // Atualiza data

    dataAtualizacao.textContent =
        "Atualizado em " + data;


    // Atualiza texto da mensagem

    porcentagemMensagem.textContent =
        formatarPorcentagem(porcentagem) + "%";


    // Começa animação do número

    animarNumero(porcentagem);


    // Faz a barra começar vazia

    barraProgresso.style.width =
        "0%";


    // Pequeno atraso para mostrar animação

    setTimeout(function () {

        barraProgresso.style.width =
            porcentagem + "%";

    }, 150);

}


// ======================================
// ANIMAÇÃO DA PORCENTAGEM
// ======================================

function animarNumero(porcentagemFinal) {

    let atual = 0;

    const duracao = 1200;

    const intervalo = 15;

    const passos =
        duracao / intervalo;

    const incremento =
        porcentagemFinal / passos;


    const animacao =
        setInterval(function () {

            atual += incremento;


            if (atual >= porcentagemFinal) {

                atual =
                    porcentagemFinal;

                clearInterval(animacao);

            }


            numero.textContent =
                formatarPorcentagem(atual);

        }, intervalo);

}


// ======================================
// ABRIR PAINEL SECRETO
// ======================================

botaoSecreto.addEventListener(
    "click",
    function () {

        if (
            painelSecreto.style.display
            === "block"
        ) {

            painelSecreto.style.display =
                "none";

        }

        else {

            painelSecreto.style.display =
                "block";

            aulasConcluidas.value =
                aulasSalvas;

            aulasConcluidas.focus();

        }

    }
);


// ======================================
// SALVAR NOVO PROGRESSO
// ======================================

salvarProgresso.addEventListener(
    "click",
    function () {

        let novoNumero =
            Number(aulasConcluidas.value);


        // Impede valores inválidos

        if (
            novoNumero < 0 ||
            novoNumero > TOTAL_AULAS ||
            isNaN(novoNumero)
        ) {

            alert(
                "Digite um número entre 0 e " +
                TOTAL_AULAS +
                "."
            );

            return;

        }


        // Não permite casas decimais

        novoNumero =
            Math.floor(novoNumero);


        // Pega a data atual

        const hoje =
            new Date();


        const dia =
            String(
                hoje.getDate()
            ).padStart(2, "0");


        const mes =
            String(
                hoje.getMonth() + 1
            ).padStart(2, "0");


        const ano =
            hoje.getFullYear();


        const novaData =
            dia +
            "/" +
            mes +
            "/" +
            ano;


        // Atualiza valores

        aulasSalvas =
            novoNumero;

        dataSalva =
            novaData;


        // Salva no navegador

        localStorage.setItem(
            "aulasConcluidas",
            aulasSalvas
        );


        localStorage.setItem(
            "dataAtualizacao",
            dataSalva
        );


        // Atualiza o site

        atualizarSite(
            aulasSalvas,
            dataSalva
        );


        // Fecha painel

        painelSecreto.style.display =
            "none";

    }
);


// ======================================
// ENTER TAMBÉM SALVA
// ======================================

aulasConcluidas.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            salvarProgresso.click();

        }

    }
);


// ======================================
// INICIAR SITE
// ======================================

atualizarSite(
    aulasSalvas,
    dataSalva
);
