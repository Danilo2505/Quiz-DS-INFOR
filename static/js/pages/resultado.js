async function carregarDados() {
  // Pega os dados salvos na sessão pelo Flask
  const dados = await getData("/api/resultado_dados");
  const perguntasERespostas = dados.perguntasERespostas || {};
  // Pega os dados das perguntas específicas para comparar as respostas
  const dadosDoFlask = await getData(
    "/api/perguntas_especificas",
    Object.keys(perguntasERespostas)
  );
  // Compara as respostas do usuário com as respostas corretas
  for (const [idQuestao, idResposta] of Object.entries(perguntasERespostas)) {
    const questao = dadosDoFlask.filter((questao) => {
      return questao ? idQuestao == questao.id : false;
    })[0];

    if (idResposta != questao.id_resposta) {
      console.log(`Errou a pergunta ${questao.id}`);
    } else {
      console.log(`Acertou a pergunta ${questao.id}`);
    }
  }
}

carregarDados();
