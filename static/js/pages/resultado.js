function criarCardQuestaoCorrecao(
  idRespostaUsuario,
  dadosQuestao,
  numeroDaQuestao
) {
  console.log(dadosQuestao);
  const alfabetoMinusculo = rangeChar("a", "z");
  // const alfabetoMaiusculo = rangeChar("A", "Z");
  // Cria o card da questão com a correção e seus elementos
  const divCardQuestao = document.createElement("div");
  const h2 = document.createElement("h2");
  const h5 = document.createElement("h5");
  const pRespostaUsuario = document.createElement("p");
  const pRespostaCorreta = document.createElement("p");
  const spanRespostaUsuario = document.createElement("span");
  const spanRespostaCorreta = document.createElement("span");
  // Adiciona classes aos elementos criados
  divCardQuestao.classList.add("div-card-questao");
  pRespostaUsuario.classList.add("p-resposta-usuario");
  pRespostaCorreta.classList.add("p-resposta-correta");

  h5.textContent = dadosQuestao.conteudo.pergunta;

  const indiceRespostaUsuario = idRespostaUsuario - 1;
  const indiceRespsotaCorreta = dadosQuestao.id_resposta - 1;

  pRespostaUsuario.textContent = "Sua Resposta: ";
  pRespostaCorreta.textContent = "Resposta Correta: ";

  spanRespostaUsuario.textContent = `${alfabetoMinusculo[indiceRespostaUsuario]}) ${dadosQuestao.alternativas[indiceRespostaUsuario]}`;
  spanRespostaCorreta.textContent = `${alfabetoMinusculo[indiceRespsotaCorreta]}) ${dadosQuestao.alternativas[indiceRespsotaCorreta]}`;

  divCardQuestao.appendChild(h2);
  divCardQuestao.appendChild(h5);
  divCardQuestao.appendChild(pRespostaUsuario);
  divCardQuestao.appendChild(pRespostaCorreta);
  pRespostaUsuario.appendChild(spanRespostaUsuario);
  pRespostaCorreta.appendChild(spanRespostaCorreta);

  // Verifica se a resposta do usuário está correta
  if (idRespostaUsuario == dadosQuestao.id_resposta) {
    h2.textContent = `✔️ Questão ${numeroDaQuestao}`;
  } else {
    h2.textContent = `❌ Questão ${numeroDaQuestao}`;
    const h5Explicacao = document.createElement("h5");
    const h6ExplicacaoTitulo = document.createElement("h6");
    const pExplicacaoTexto = document.createElement("p");
    h6ExplicacaoTitulo.classList.add("h5-explicacao");
    h6ExplicacaoTitulo.classList.add("h6-explicacao-titulo");
    pExplicacaoTexto.classList.add("p-explicacao-texto");
    h5Explicacao.textContent = "Explicação:";
    getData(`/api/explicacao_questao`, dadosQuestao.id_explicacao).then(
      (explicacao) => {
        console.log(explicacao[0]);
        explicacao[0].conteudo = JSON.parse(explicacao[0].conteudo);
        h6ExplicacaoTitulo.textContent = explicacao[0].conteudo.titulo;
        pExplicacaoTexto.textContent = explicacao[0].conteudo.texto;
      }
    );
    divCardQuestao.appendChild(h5Explicacao);
    divCardQuestao.appendChild(h6ExplicacaoTitulo);
    divCardQuestao.appendChild(pExplicacaoTexto);
  }

  return divCardQuestao;
}

async function carregarDados() {
  // Pega os dados salvos na sessão pelo Flask
  const dados = await getData("/api/resultado_dados");
  const perguntasERespostas = dados.perguntasERespostas || {};
  // Pega os dados das perguntas específicas para comparar as respostas
  const dadosDoFlask = await getData(
    "/api/perguntas_especificas",
    Object.keys(perguntasERespostas)
  );
  for (const dado of dadosDoFlask) {
    // Corrigir os campos que são JSON em string
    dado.alternativas = JSON.parse(dado.alternativas);
    dado.conteudo = JSON.parse(dado.conteudo);
  }
  return {
    perguntasERespostas: perguntasERespostas,
    dadosDoFlask: dadosDoFlask,
  };
}

async function execucaoInicial() {
  // --- Tela de Carregamento ---
  const telaCarregamento = new TelaCarregamento();
  telaCarregamento.mostrar();
  await esperarPorElemento("#div-load-screen > svg");

  // --- Obtenção dos Dados ---
  telaCarregamento.definirInfoProgresso("Obtendo perguntas e respostas...");
  // Pega os dados das respostas do usuário e as perguntas do Flask
  const dados = await carregarDados();
  const perguntasERespostas = dados.perguntasERespostas;
  const dadosDoFlask = dados.dadosDoFlask;

  // !!!
  await delay(1000);

  // --- Correção das Respostas ---
  const divCardsQuestoes = document.querySelector("#div-cards-questoes");
  telaCarregamento.definirInfoProgresso("Corrigindo...");
  let numeroDaQuestao = 1;
  // Compara as respostas do usuário com as respostas corretas
  for (const [idQuestao, idResposta] of Object.entries(perguntasERespostas)) {
    const questao = dadosDoFlask.filter((questao) => {
      return questao ? idQuestao == questao.id : false;
    })[0];

    divCardsQuestoes.appendChild(
      criarCardQuestaoCorrecao(idResposta, questao, numeroDaQuestao)
    );

    numeroDaQuestao += 1;
  }

  // !!!
  await delay(500);

  telaCarregamento.ocultar();
}

execucaoInicial();
