/* ========================================
   CONFIGURAÇÃO
======================================== */

const TOTAL_AULAS = 90;

const FIREBASE_URL =
    "https://meu-progresso-curso-default-rtdb.firebaseio.com";


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

const painelStatus =
    document.getElementById("painelStatus");


/* ========================================
   VALORES INICIAIS
======================================== */

let aulas = 48;

let data = "20/09/2026";


/* ========================================
   CALCULAR PORCENTAGEM
======================================== */

function calcularPorcentagem(valor) {

    return (valor / TOTAL_AULAS) * 100;

}


/* ========================================
   FORMATAR PORCENTAGEM
======================================== */

function formatarPorcentagem(valor) {

    return valor
        .toFixed(2)
        .replace(".", ",");

}


/* ========================================
   PEGAR DATA ATUAL
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
   ANIMAÇÃO DO NÚMERO
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
        1000;


    function quadro(tempo) {

        const progresso =
            Math.min(
                (tempo - inicio) /
                duracao,
                1
            );


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


    barra.style.transition =
        "none";


    barra.style.width =
        "0%";


    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            barra.style.transition =
                "width 1.3s cubic-bezier(.18,.89,.32,1.1)";


            barra.style.width =
                `${porcentagem}%`;

        });

    });

}


/* ========================================
   CARREGAR DO FIREBASE
======================================== */

async function carregarFirebase() {

    try {

        const resposta =
            await fetch(
                `${FIREBASE_URL}/.json?t=${Date.now()}`,
                {
                    cache: "no-store"
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar"
            );

        }


        const dados =
            await resposta.json();


        if (
            dados &&
            typeof dados.aulas === "number"
        ) {

            aulas =
                dados.aulas;

        }


        if (
            dados &&
            typeof dados.data === "string"
        ) {

            data =
                dados.data;

        }


        atualizarTela();

    }

    catch (erro) {

        console.error(
            "Erro no Firebase:",
            erro
        );


        /*
           Se a internet ou Firebase falhar,
           mantém 48/90 ao invés de mostrar 0%.
        */

        atualizarTela();

    }

}


/* ========================================
   ABRIR PAINEL
======================================== */

function abrirPainel() {

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


    painelStatus.textContent =
        "";


    setTimeout(() => {

        inputAulas.focus();

        inputAulas.select();

    }, 50);

}


/* ========================================
   FECHAR PAINEL
======================================== */

function fechar() {

    painel.hidden =
        true;

}


/* ========================================
   BOTÃO ESCONDIDO
======================================== */

botaoSecreto.addEventListener(
    "click",
    abrirPainel
);


/* ========================================
   BOTÃO X
======================================== */

fecharPainel.addEventListener(
    "click",
    fechar
);


/* ========================================
   PREVIEW ENQUANTO DIGITA
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
   SALVAR ONLINE
======================================== */

async function salvarDados() {

    let novoValor =
        Number(
            inputAulas.value
        );


    if (
        !Number.isFinite(novoValor) ||
        novoValor < 0 ||
        novoValor > TOTAL_AULAS
    ) {

        painelStatus.textContent =
            `Digite um número entre 0 e ${TOTAL_AULAS}.`;

        return;

    }


    novoValor =
        Math.floor(
            novoValor
        );


    const novaData =
        pegarDataAtual();


    salvar.disabled =
        true;


    salvar.textContent =
        "SALVANDO...";


    painelStatus.textContent =
        "Enviando para o Firebase...";


    try {

        const resposta =
            await fetch(
                `${FIREBASE_URL}/.json`,
                {

                    method: "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            aulas:
                                novoValor,

                            data:
                                novaData

                        })

                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Firebase recusou"
            );

        }


        aulas =
            novoValor;


        data =
            novaData;


        atualizarTela();


        painelStatus.textContent =
            "✓ Salvo online!";


        setTimeout(() => {

            fechar();

        }, 600);

    }

    catch (erro) {

        console.error(
            erro
        );


        painelStatus.textContent =
            "Erro ao salvar. Tente novamente.";

    }

    finally {

        salvar.disabled =
            false;


        salvar.textContent =
            "SALVAR PROGRESSO";

    }

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
   ESC FECHA
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

carregarFirebase();
