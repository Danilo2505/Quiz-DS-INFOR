// ----- Cards com Perguntas -----
const buttonPreviousCard = document.querySelector("#button-previous-card");
const buttonNextCard = document.querySelector("#button-next-card");

// --- Criar Card para uma Pergunta ---
function criarCardPergunta(pergunta) {
  // Cria os elementos do card da pergunta
  const divCardBox = document.createElement("div");
  const divCardPergunta = document.createElement("div");
  const ulTemas = document.createElement("ul");
  const pConteudoPergunta = document.createElement("p");
  const ulAlternativas = document.createElement("ul");

  // Adiciona classes aos elementos criados
  divCardBox.classList.add("div-card-box");
  divCardPergunta.classList.add("div-card-pergunta");
  ulTemas.classList.add("ul-temas");
  pConteudoPergunta.classList.add("p-conteudo-pergunta");
  ulAlternativas.classList.add("ul-alternativas");

  // Adiciona o ID da pergunta ao card
  divCardPergunta.setAttribute("id_pergunta", pergunta.id);

  // Adiciona os temas da pergunta
  for (nomeTema of nomesTemas[pergunta.id]) {
    const liTema = document.createElement("li");
    liTema.classList.add("li-tema");
    liTema.innerHTML = nomeTema;
    ulTemas.append(liTema);
  }

  // Adiciona as alternativas da pergunta
  for (let i = 0; i < pergunta.alternativas.length; i++) {
    const liAlternativa = document.createElement("li");
    liAlternativa.classList.add("li-alternativa");
    liAlternativa.setAttribute("id_alternativa", i + 1);

    const buttonAlternativa = document.createElement("button");
    buttonAlternativa.classList.add("button-alternativa");
    buttonAlternativa.setAttribute(
      "onclick",
      `escolherAlternativa(${pergunta.id}, ${i + 1})`
    );
    buttonAlternativa.textContent = `${indicadoresAlternativas[i]}) ${pergunta.alternativas[i]}`;

    liAlternativa.append(buttonAlternativa);
    ulAlternativas.append(liAlternativa);
  }

  // Adiciona o conteúdo da pergunta
  pConteudoPergunta.textContent = pergunta.conteudo.pergunta;

  // Monta a estrutura do card da pergunta
  divCardPergunta.appendChild(ulTemas);
  divCardPergunta.appendChild(pConteudoPergunta);
  divCardPergunta.appendChild(ulAlternativas);
  divCardBox.appendChild(divCardPergunta);

  return divCardBox;
}

// --- Carregar Questões ---
function carregarPerguntas() {
  const divCardsPerguntas = document.querySelector("#div-cards-perguntas");
  const parentDivCardEnvio =
    document.querySelector(".div-card-envio").parentNode;
  let idsPerguntas = perguntas;

  // Pega os parâmetros da URL
  const queryString = window.location.search;
  // Cria um objeto URLSearchParams
  const urlParams = new URLSearchParams(queryString);
  // Pega todos os valores do parâmetro "q"
  const idsQuestoes = urlParams.getAll("q");

  // Filtra as perguntas para carregar apenas as que estão na URL
  if (idsQuestoes.length !== 0) {
    idsPerguntas = perguntas.filter((p) =>
      idsQuestoes.includes(p.id.toString())
    );
  }

  // Cria os cards das perguntas
  for (pergunta of idsPerguntas) {
    divCardsPerguntas.insertBefore(
      criarCardPergunta(pergunta),
      parentDivCardEnvio
    );
  }

  // Scroll para o primeiro card sem resposta
  const cardSemResposta = document.querySelector(
    `.div-card-pergunta[id_pergunta]:not(:has(.alternativa-selecionada))`
  );
  if (cardSemResposta) {
    cardSemResposta.scrollIntoView();
  }
}

// --- Escolher apenas uma Altenativa ---
function escolherAlternativa(idPergunta, idAlternativa) {
  const ulAlternativas = document.querySelector(
    `.div-card-pergunta[id_pergunta="${idPergunta}"] .ul-alternativas`
  );

  // Retira a alternativa selecionada de todas as alternativas
  ulAlternativas
    .querySelectorAll(".alternativa-selecionada")
    .forEach((liAlternativa) => {
      liAlternativa.classList.remove("alternativa-selecionada");
    });

  // Define a nova alternativa selecionada
  ulAlternativas
    .querySelector(`.li-alternativa[id_alternativa="${idAlternativa}"]`)
    .classList.add("alternativa-selecionada");
}

// --- Enviar Respostas para Correção ---
async function enviarRespostas() {
  // Procura algum Card Sem Resposta
  const cardSemResposta = document.querySelector(
    `.div-card-pergunta[id_pergunta]:not(:has(.alternativa-selecionada))`
  );
  if (cardSemResposta) {
    const p = document.querySelector(".div-card-envio p");
    // !!!
    p.textContent = "Há perguntas sem resposta! Realmente deseja enviar?";
    // cardSemResposta.scrollIntoView();
    return;
  }

  // Pega as Alternativas Selecionadas e guarda junto ao ID da Pergunta
  let perguntasERespostas = {};
  const alternativasSelecionadas = document.querySelectorAll(
    `.alternativa-selecionada`
  );
  alternativasSelecionadas.forEach((alternativa) => {
    const idPergunta =
      alternativa.parentElement.parentElement.getAttribute("id_pergunta");
    const idAlternativa = alternativa.getAttribute("id_alternativa");
    perguntasERespostas = {
      ...perguntasERespostas,
      [idPergunta]: idAlternativa,
    };
  });

  // Faz uma requisição POST para enviar os dados ao Flask e redireciona para a página de resultados
  const resposta = await postData("/api/enviar_respostas_para_resultado", {
    perguntasERespostas: perguntasERespostas,
  });

  // Redireciona para a página de resultados
  window.location.href = resposta.redirect;
}

async function verificarRespostas(idPergunta) {
  const pergunta = await pegarDadosDoFlask(`api/perguntas?id=${idPergunta}`);
  const idResposta = pergunta[0]["id_resposta"];
}

// --- Locomoção entre as Perguntas ---
function voltarParaPrimeiraPergunta() {
  const divCardsPerguntas = document.querySelector("#div-cards-perguntas");
  const divCardBox = document.querySelector(".div-card-box");

  divCardsPerguntas.scrollTo({ top: 0 });
}

function voltarPergunta() {
  const divCardsPerguntas = document.querySelector("#div-cards-perguntas");
  const divCardBox = document.querySelector(".div-card-box");

  const maxScrollCards = divCardsPerguntas.scrollTop;
  const alturaCardBox = divCardBox.clientHeight;

  divCardsPerguntas.scrollBy(0, -alturaCardBox);
}

function avancarPergunta() {
  const divCardsPerguntas = document.querySelector("#div-cards-perguntas");
  const divCardBox = document.querySelector(".div-card-box");

  const maxScrollCards = divCardsPerguntas.scrollTop;
  const alturaCardBox = divCardBox.clientHeight;

  divCardsPerguntas.scrollBy(0, alturaCardBox);
}

function execucaoInicial() {
  console.log("A");
  carregarPerguntas();
  console.log("B");

  buttonPreviousCard.addEventListener("click", voltarPergunta);
  buttonNextCard.addEventListener("click", avancarPergunta);

  // ----- Botão Home -----
  const buttonHome = document.querySelector("#button-home");

  buttonHome.addEventListener("click", () => {
    window.location.href = "/";
  });

  /*
  // ----- Testes -----
  const buttonTeste = document.querySelector("#button-teste");

  buttonTeste.addEventListener("click", () => {
    const alerta = new Notificacao(
      (tipo = "alerta"),
      (titulo = "Teste de Alerta"),
      (mensagem = "Mensagem de teste..."),
      (icone = "")
    );
  });
  */
}

execucaoInicial();
