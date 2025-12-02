const formPergunta = document.querySelector("#section-pergunta > form");
const formTema = document.querySelector("#section-tema > form");
const formNivelDificuldade = document.querySelector(
  "#section-nivel-dificuldade > form"
);
/*
const formExplicacaoResposta = document.querySelector(
  "#section-explicacao-resposta > form"
);
*/

function carregarDadosPergunta() {
  const alfabetoMinusculo = rangeChar("a", "z");
  const data = new FormData(formPergunta);
  const idPergunta = data.get("id_pergunta");

  const ulAlternativas = document.querySelector("#ul-alternativas");
  const pAlternativaCorreta = document.querySelector("#p-alternativa-correta");
  const textareaExplicacao = document.querySelector("#textarea-explicacao");
  const ulTemas = document.querySelector("#ul-temas");
  const inputNivelDificuldade = document.querySelector(
    "#input-nivel-dificuldade"
  );

  const dadoPergunta = perguntas.filter(
    (pergunta) => pergunta.id == idPergunta
  )[0];
  const explicacao = JSON.parse(dadoPergunta.explicacao);

  // Alternativas
  ulAlternativas.replaceChildren();
  for (let i = 0; i < dadoPergunta.alternativas.length; i++) {
    const alternativa = dadoPergunta.alternativas[i];
    const li = document.createElement("li");
    const p = document.createElement("p");

    p.textContent = `${alfabetoMinusculo[i]}) ${alternativa}`;

    li.appendChild(p);
    ulAlternativas.appendChild(li);
  }

  // Alternativa correta
  pAlternativaCorreta.textContent = `${
    alfabetoMinusculo[dadoPergunta.id_resposta - 1]
  }) ${dadoPergunta.alternativas[dadoPergunta.id_resposta - 1]}`;

  // Explicação da Resposta
  textareaExplicacao.value = `${explicacao.titulo}
${explicacao.texto}`;

  // Tema(s)
  ulTemas.replaceChildren();
  for (nomeTema of nomesTemas[idPergunta]) {
    const li = document.createElement("li");
    const p = document.createElement("p");

    p.textContent = nomeTema;

    li.appendChild(p);
    ulTemas.appendChild(li);
  }
  // Nível de Dificuldade
  inputNivelDificuldade.value = dadoPergunta.nome_nivel;
}

/*
function carregarDadosExplicacaoResposta() {
  const selectIdExplicacao = document.querySelector("#select-id-explicacao");

  selectIdExplicacao.replaceChildren();
  for (const explicacao of explicacoes) {
    if (typeof explicacao.conteudo === "string") {
      explicacao.conteudo = JSON.parse(explicacao.conteudo);
    }
    const option = document.createElement("option");

    option.value = explicacao.id;
    option.textContent = `${explicacao.conteudo.titulo} | ${explicacao.conteudo.texto}`;

    selectIdExplicacao.appendChild(option);
  }
}
*/

// ----- Fomulários -----
// --- Mudanças ---
formPergunta.addEventListener("change", carregarDadosPergunta);

// --- Submissões ---
formPergunta.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const idPergunta = data.get("id_pergunta");

  try {
    const respostaPerguntasTemas = await excluirDadoFlask(
      "perguntas_temas",
      "id_pergunta = %s",
      [idPergunta]
    );
    const respostaPerguntas = await excluirDadoFlask("perguntas", "id = %s", [
      idPergunta,
    ]);
    const _n = new Notificacao(
      "success",
      "Pergunta excluída",
      "A pergunta foi removida com sucesso.",
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

  try {
    const resposta = await excluirDadoFlask("temas", "id = %s", [idTema]);
    const _n = new Notificacao(
      "success",
      "Tema excluído",
      "O tema foi removido com sucesso.",
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

  try {
    const resposta = await excluirDadoFlask("niveis_dificuldade", "id = %s", [
      idNivel,
    ]);
    const _n = new Notificacao(
      "success",
      "Nível excluído",
      "O nível de dificuldade foi removido.",
      "",
      3000
    );
    setTimeout(() => window.location.reload(), _n.tempoExpiracao + 350);
  } catch (erro) {
    console.error("Erro: " + erro.message);
    new Notificacao("error", "Erro", erro.message, "", 6000);
  }
});

/*
formExplicacaoResposta.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const idExplicacao = data.get("id_explicacao");

  try {
    const respostaPerguntasTemas = await excluirDadoFlask(
      "perguntas_temas",
      "id_pergunta = %s",
      [idPergunta]
    );
    const respostaPergunta = await excluirDadoFlask(
      "perguntas",
      "id_explicacao = %s",
      [idExplicacao]
    );
    const respostaExplicacao = await excluirDadoFlask(
      "explicacoes_respostas",
      "id = %s",
      [idExplicacao]
    );
  } catch (erro) {
    console.error("Erro: " + erro.message);
  }
});
*/

carregarDadosPergunta();
// carregarDadosExplicacaoResposta();
