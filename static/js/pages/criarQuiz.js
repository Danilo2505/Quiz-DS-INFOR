document
  .querySelector("form:has(#table-questoes)")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    // Extrai os IDs das perguntas selecionadas
    const dados = new FormData(e.target);
    const idsPerguntas = [...dados.entries()]
      .filter(([chave, valor]) => {
        return chave == "id_pergunta";
      })
      .map(([chave, valor]) => valor);

    // Redireciona para a página do quiz com os IDs como parâmetros na URL
    if (idsPerguntas.length > 0) {
      window.location.href = `/quiz.html?q=${idsPerguntas.join("&q=")}`;
    }
  });
