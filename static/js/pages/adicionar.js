const formPergunta = document.querySelector("#section-pergunta > form");
const formTema = document.querySelector("#section-tema > form");
const formNivelDificuldade = document.querySelector(
  "#section-nivel-dificuldade > form"
);
const formExplicacaoResposta = document.querySelector(
  "#section-explicacao-resposta > form"
);

// ----- Fomulários -----
// --- Submissões ---
formPergunta.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  const idTemas = Array.from(
    document.querySelectorAll("input[name='id_tema']:checked")
  ).map((checkboxTema) => Number(checkboxTema.value));

  novoDado = {
    conteudo: {
      pergunta: data.get("pergunta"),
    },
    alternativas: ["Loop for", "If-else", "Switch", "Função"],
    id_resposta: Number(data.get("id_resposta")),
    id_tema: idTemas[0],
    id_nivel: Number(data.get("id_nivel")),
  };

  if (data.get("id_explicacao") != "-1") {
    novoDado = {
      ...novoDado,
      ...{ id_explicacao: Number(data.get("id_explicacao")) },
    };
  }

  if (data.get("pergunta").trim() == "") {
    console.error("Erro: A pergunta não pode estar vazia.");
    const notificacao = new Notificacao(
      (tipo = "error"),
      (titulo = "Pergunta Vazia"),
      (mensagem = "A pergunta não pode estar vazia."),
      (icone = "")
    );
    return;
  }

  if (idTemas.length == 0) {
    console.error("Erro: Selecione ao menos um tema.");
    const notificacao = new Notificacao(
      (tipo = "error"),
      (titulo = "Sem tema"),
      (mensagem = "Selecione ao menos um tema."),
      (icone = "")
    );
    return;
  }

  try {
    console.log(novoDado);
    const resposta = await adicionarDadoFlask("perguntas", novoDado);
    for (let i = 0; i < idTemas.length; i++) {
      const resp = await adicionarDadoFlask("perguntas_temas", {
        id_pergunta: resposta.id,
        id_tema: idTemas[i],
      });
    }
    const _n = new Notificacao(
      "success",
      "Pergunta adicionada",
      "A pergunta foi adicionada com sucesso.",
      "",
      3500
    );
    setTimeout(() => window.location.reload(), _n.tempoExpiracao + 350);
  } catch (erro) {
    console.error("Erro: " + erro.message);
    const notificacao = new Notificacao(
      (tipo = "error"),
      (titulo = "Erro"),
      (mensagem = erro.message),
      (icone = "")
    );
  }
});

formTema.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  novoDado = {
    nome: data.get("nome"),
  };

  try {
    const resposta = await adicionarDadoFlask("temas", novoDado);
    const _n = new Notificacao(
      "success",
      "Tema adicionado",
      "Tema criado com sucesso.",
      "",
      3000
    );
    setTimeout(() => window.location.reload(), _n.tempoExpiracao + 350);
  } catch (erro) {
    console.error("Erro: " + erro.message);
  }
});

formNivelDificuldade.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  novoDado = {
    nome: data.get("nome"),
    nivel_dificuldade: Number(data.get("nivel_dificuldade")),
  };

  try {
    const resposta = await adicionarDadoFlask("niveis_dificuldade", novoDado);
    const _n = new Notificacao(
      "success",
      "Nível adicionado",
      "Nível criado com sucesso.",
      "",
      3000
    );
    setTimeout(() => window.location.reload(), _n.tempoExpiracao + 350);
  } catch (erro) {
    console.error("Erro: " + erro.message);
  }
});

formExplicacaoResposta.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);

  novoDado = {
    conteudo: {
      titulo: data.get("titulo"),
      texto: data.get("texto"),
    },
  };

  try {
    const resposta = await adicionarDadoFlask(
      "explicacoes_respostas",
      novoDado
    );
    const _n = new Notificacao(
      "success",
      "Explicação adicionada",
      "Explicação criada com sucesso.",
      "",
      3000
    );
    setTimeout(() => window.location.reload(), _n.tempoExpiracao + 350);
  } catch (erro) {
    console.error("Erro: " + erro.message);
  }
});
