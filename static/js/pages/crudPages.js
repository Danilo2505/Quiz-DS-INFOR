const selectModo = document.querySelector("#select-modo");
const selectorsSectionsModos = [
  "#section-pergunta",
  "#section-tema",
  "#section-nivel-dificuldade",
  "#section-explicacao-resposta",
];

function definirModo(modoSelecionado) {
  // Coloca a classe escondido em cada seção de modo
  selectorsSectionsModos.forEach((modo) => {
    try {
      document.querySelector(modo).classList.add("escondido");
    } catch (erro) {
      console.error(erro.message);
    }
  });

  // Retira a classe "escondido" do modo selecionado
  switch (modoSelecionado) {
    // Modo de adição de disciplinas
    case "pergunta":
      document.querySelector("#section-pergunta").classList.remove("escondido");
      break;

    // Modo de adição de salas
    case "tema":
      document.querySelector("#section-tema").classList.remove("escondido");
      break;

    // Modo de adição de alunos
    case "nivel_dificuldade":
      document
        .querySelector("#section-nivel-dificuldade")
        .classList.remove("escondido");
      break;

    // Modo de adição de notas
    case "explicacao_resposta":
      document
        .querySelector("#section-explicacao-resposta")
        .classList.remove("escondido");
      break;
  }
}

definirModo(selectModo.value);

selectModo.addEventListener("change", function () {
  definirModo(this.value);
});
