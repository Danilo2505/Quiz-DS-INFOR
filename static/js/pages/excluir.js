const formPergunta = document.querySelector("#section-pergunta > form");
const formTema = document.querySelector("#section-tema > form");
const formNivelDificuldade = document.querySelector(
  "#section-nivel-dificuldade > form"
);
const formExplicacaoResposta = document.querySelector(
  "#section-explicacao-resposta > form"
);

// ----- Fomulários -----
// --- Mudanças ---
formPergunta.addEventListener("change", () => {});

formTema.addEventListener("change", () => {});

formNivelDificuldade.addEventListener("change", () => {});

formExplicacaoResposta.addEventListener("change", () => {});

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
  } catch (erro) {
    console.error("Erro: " + erro.message);
  }
});

formTema.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const idTema = data.get("id_tema");

  try {
    const resposta = await excluirDadoFlask("temas", "id = %s", [idTema]);
  } catch (erro) {
    console.error("Erro: " + erro.message);
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
  } catch (erro) {
    console.error("Erro: " + erro.message);
  }
});

formExplicacaoResposta.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const idExplicacao = data.get("id_explicacao");

  try {
    const resposta = await excluirDadoFlask(
      "explicacoes_respostas",
      "id = %s",
      [idExplicacao]
    );
  } catch (erro) {
    console.error("Erro: " + erro.message);
  }
});
