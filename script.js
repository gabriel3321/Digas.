/* ========================================
   CONFIGURAÇÃO
======================================== */

const TOTAL_AULAS = 90;
const AULAS_INICIAIS = 48;
const DATA_INICIAL = "20/09/2026";


/* ========================================
   ELEMENTOS
======================================== */

const numero =
    document.getElementById("numero");

const barra =
    document.getElementById("barraProgresso");

const aulasTexto =
    document.getElementById("aulasTexto");

const dataTexto =
    document.getElementById("dataAtualizacao");

const porcentagemMensagem =
    document.getElementById("porcentagemMensagem");


const botaoSecreto =
    document.getElementById("botaoSecreto");

const painel =
    document.getElementById("painelSecreto");

const fecharPainel =
    document.getElementById("fecharPainel");

const inputAulas =
    document.getElementById("aulasConcluidas");

const preview =
    document.getElementById("previewPorcentagem");

const salvar =
    document.getElementById("salvarProgresso");


/* ========================================
   DADOS SALVOS
======================================== */

let aulas =
    Number(
        localStorage.getItem("curso_aulas")
    );


let data =
    localStorage.getItem("curso_data");


/* PRIMEIRA VISITA */

if (
    !Number.isFinite(aulas) ||
    aulas < 0 ||
    aulas > TOTAL_AULAS
) {

    aulas = AULAS_INICIAIS;

}


if (!data) {

    data = DATA_INICIAL;

}


/* ========================================
   PORCENTAGEM
======================================== */

function calcularPorcentagem(valor) {

    return (
        valor /
        TOTAL_AULAS
    ) * 100;

}


/* ========================================
   FORMATAR
======================================== */

function formatarPorcentagem(valor) {

    return valor
        .toFixed(2)
        .replace(".", ",");

}


/* ========================================
   DATA BRASILEIRA
======================================== */

function pegarDataAtual() {

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


    return `${dia}/${mes}/${ano}`;

}


/* ========================================
   ANIMAR NÚMERO
======================================== */

let animacaoAtual = null;


function animarNumero(final) {

    if (animacaoAtual) {

        cancelAnimationFrame(
            animacaoAtual
        );

    }


    const inicio =
        performance.now();


    const duracao =
        1100;


    function quadro(tempo) {

        const progresso =
            Math.min(
                (tempo - inicio) /
                duracao,
                1
            );


        /*
           Faz a animação desacelerar
           perto do final
        */

        const suavizado =
            1 -
            Math.pow(
                1 - progresso,
                3
            );


        const atual =
            final *
            suavizado;


        numero.textContent =
            formatarPorcentagem(
                atual
            );


        if (progresso < 1) {

            animacaoAtual =
                requestAnimationFrame(
                    quadro
                );

        }

    }


    animacaoAtual =
        requestAnimationFrame(
            quadro
        );

}


/* ========================================
   ATUALIZAR TELA
======================================== */

function atualizarTela() {

    const porcentagem =
        calcularPorcentagem(
            aulas
        );


    aulasTexto.textContent =
        `${aulas} / ${TOTAL_AULAS} AULAS`;


    dataTexto.textContent =
        `Atualizado em ${data}`;


    porcentagemMensagem.textContent =
        `${formatarPorcentagem(
            porcentagem
        )}%`;


    animarNumero(
        porcentagem
    );


    /*
       Reinicia animação da barra
    */

    barra.style.transition =
        "none";


    barra.style.width =
        "0%";


    requestAnimationFrame(
        function () {

            requestAnimationFrame(
                function () {

                    barra.style.transition =
                        "width 1.3s cubic-bezier(.18,.89,.32,1.1)";


                    barra.style.width =
                        `${porcentagem}%`;

                }
            );

        }
    );

}


/* ========================================
   ABRIR PAINEL
======================================== */

function abrir() {

    painel.hidden =
        false;


    inputAulas.value =
        aulas;


    preview.textContent =
        `${formatarPorcentagem(
            calcularPorcentagem(
                aulas
            )
        )}%`;


    setTimeout(
        function () {

            inputAulas.focus();

            inputAulas.select();

        },
        50
    );

}


/* ========================================
   FECHAR
======================================== */

function fechar() {

    painel.hidden =
        true;

}


/* ========================================
   BOTÃO SECRETO
======================================== */

botaoSecreto.addEventListener(
    "click",
    abrir
);


/* ========================================
   X
======================================== */

fecharPainel.addEventListener(
    "click",
    fechar
);


/* ========================================
   PREVIEW AO DIGITAR
======================================== */

inputAulas.addEventListener(
    "input",
    function () {

        const valor =
            Number(
                inputAulas.value
            );


        if (
            Number.isFinite(valor) &&
            valor >= 0 &&
            valor <= TOTAL_AULAS
        ) {

            preview.textContent =
                `${formatarPorcentagem(
                    calcularPorcentagem(
                        valor
                    )
                )}%`;

        }

        else {

            preview.textContent =
                "--,--%";

        }

    }
);


/* ========================================
   SALVAR
======================================== */

function salvarDados() {

    let novoValor =
        Number(
            inputAulas.value
        );


    if (
        !Number.isFinite(
            novoValor
        ) ||
        novoValor < 0 ||
        novoValor > TOTAL_AULAS
    ) {

        alert(
            `Digite um valor entre 0 e ${TOTAL_AULAS}.`
        );

        return;

    }


    novoValor =
        Math.floor(
            novoValor
        );


    aulas =
        novoValor;


    data =
        pegarDataAtual();


    localStorage.setItem(
        "curso_aulas",
        String(aulas)
    );


    localStorage.setItem(
        "curso_data",
        data
    );


    atualizarTela();

    fechar();

}


/* ========================================
   BOTÃO SALVAR
======================================== */

salvar.addEventListener(
    "click",
    salvarDados
);


/* ========================================
   ENTER SALVA
======================================== */

inputAulas.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            salvarDados();

        }


        if (
            event.key === "Escape"
        ) {

            fechar();

        }

    }
);


/* ========================================
   ESC TAMBÉM FECHA
======================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            fechar();

        }

    }
);


/* ========================================
   INICIAR
======================================== */

atualizarTela();
