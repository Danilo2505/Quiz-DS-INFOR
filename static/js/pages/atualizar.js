const formPergunta = document.querySelector("#section-pergunta > form");
const formTema = document.querySelector("#section-tema > form");
const formNivelDificuldade = document.querySelector(
  "#section-nivel-dificuldade > form"
);
const formExplicacaoResposta = document.querySelector(
  "#section-explicacao-resposta > form"
);
const selectQuestaoEnunciado = document.querySelector(
  "#select-questao-enunciado"
);
const selectIdExplicacao = document.querySelector("#select-id-explicacao");

function carregarDadosPergunta() {
  const alfabetoMinusculo = rangeChar("a", "z");
  const data = new FormData(formPergunta);
  const idPergunta = data.get("id_pergunta");

  const inputNovoEnunciado = document.querySelector("#input-novo-enunciado");
  const ulAlternativas = document.querySelector("#ul-alternativas");
  const pAlternativaCorreta = document.querySelector("#p-alternativa-correta");
  const ulTemas = document.querySelector("#ul-temas");
  const inputNivelDificuldade = document.querySelector(
    "#input-nivel-dificuldade"
  );

  const dadoPergunta = perguntas.filter(
    (pergunta) => pergunta.id == idPergunta
  )[0];

  // Enunciado
  inputNovoEnunciado.value = dadoPergunta.conteudo.pergunta;

  // Alternativas
  ulAlternativas.replaceChildren();
  for (let i = 0; i < dadoPergunta.alternativas.length; i++) {
    const alternativa = dadoPergunta.alternativas[i];
    const li = document.createElement("li");
    const p = document.createElement("p");
    const input = document.createElement("input");

    input.type = "text";

    p.textContent = `${alfabetoMinusculo[i]}) `;
    input.value = alternativa;
    input.name = "alternativas";

    li.appendChild(p);
    li.appendChild(input);
    ulAlternativas.appendChild(li);
  }

  // Nível de Dificuldade
  inputNivelDificuldade.value = dadoPergunta.nome_nivel;
}

function carregarDadosExplicacaoResposta() {
  const selectIdExplicacao = document.querySelector("#select-id-explicacao");
  const inputTituloExplicacaoResposta = document.querySelector(
    " #input-titulo-explicacao-resposta"
  );
  const textareaTextoExplicacaoResposta = document.querySelector(
    " #textarea-texto-explicacao-resposta"
  );
  const explicacao = explicacoes.filter(
    (explicacao) => explicacao.id == selectIdExplicacao.value
  )[0];

  inputTituloExplicacaoResposta.value = explicacao.conteudo.titulo;
  textareaTextoExplicacaoResposta.value = explicacao.conteudo.texto;
}

// ----- Fomulários -----
// --- Mudanças ---
selectQuestaoEnunciado.addEventListener("change", carregarDadosPergunta);
selectIdExplicacao.addEventListener("change", carregarDadosExplicacaoResposta);

// --- Submissões ---
formPergunta.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const idPergunta = data.get("id_pergunta");
  const ulAlternativas = document.querySelector("#ul-alternativas");
  const inputsAlternativas = ulAlternativas.querySelectorAll("li input");
  const dadosPergunta = {
    alternativas: Array.from(inputsAlternativas).map(
      (alternativa) => alternativa.value
    ),
    conteudo: {
      pergunta: data.get("pergunta"),
    },
    id_explicacao: data.get("id_explicacao"),
    id_nivel: data.get("id_nivel"),
    id_resposta: data.get("id_resposta"),
    id_tema: data.get("id_tema"),
  };

  try {
    const resposta = await atualizarDadoFlask(
      "perguntas",
      dadosPergunta,
      "id = %s",
      [idPergunta]
    );
    const _n = new Notificacao(
      "success",
      "Pergunta atualizada",
      "A pergunta foi atualizada com sucesso.",
      "",
      3500
    );
    setTimeout(() => window.location.reload(), _n.tempoExpiracao + 350);
  } catch (erro) {
    console.error("Erro: " + erro.message);
    new Notificacao("error", "Erro", erro.message, "", 6000);
  }
});

formTema.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const idTema = data.get("id_tema");
  const novoNomeTema = data.get("novo_nome_tema");

  try {
    const resposta = await atualizarDadoFlask(
      "temas",
      { nome: novoNomeTema },
      "id = %s",
      [idTema]
    );
    const _n = new Notificacao(
      "success",
      "Tema atualizado",
      "O tema foi atualizado com sucesso.",
      "",
      3000
    );
    setTimeout(() => window.location.reload(), _n.tempoExpiracao + 350);
  } catch (erro) {
    console.error("Erro: " + erro.message);
    new Notificacao("error", "Erro", erro.message, "", 6000);
  }
});

formNivelDificuldade.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const idNivel = data.get("id_nivel");
  const nomeNivelDificuldade = data.get("nome_nivel_dificuldade");
  const nivelDificuldade = data.get("nivel_dificuldade");

  try {
    const resposta = await atualizarDadoFlask(
      "niveis_dificuldade",
      { nome: nomeNivelDificuldade, nivel_dificuldade: nivelDificuldade },
      "id = %s",
      [idNivel]
    );
    const _n = new Notificacao(
      "success",
      "Nível atualizado",
      "O nível de dificuldade foi atualizado.",
      "",
      3000
    );
    setTimeout(() => window.location.reload(), _n.tempoExpiracao + 350);
  } catch (erro) {
    console.error("Erro: " + erro.message);
    new Notificacao("error", "Erro", erro.message, "", 6000);
  }
});

formExplicacaoResposta.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const idExplicacao = data.get("id_explicacao");
  const titulo = data.get("titulo");
  const texto = data.get("texto");

  try {
    const resposta = await atualizarDadoFlask(
      "explicacoes_respostas",
      {
        conteudo: {
          titulo: titulo,
          texto: texto,
        },
      },
      "id = %s",
      [idExplicacao]
    );
    const _n = new Notificacao(
      "success",
      "Explicação atualizada",
      "A explicação da resposta foi atualizada.",
      "",
      3000
    );
    setTimeout(() => window.location.reload(), _n.tempoExpiracao + 350);
  } catch (erro) {
    console.error("Erro: " + erro.message);
    new Notificacao("error", "Erro", erro.message, "", 6000);
  }
});

carregarDadosPergunta();
carregarDadosExplicacaoResposta();
