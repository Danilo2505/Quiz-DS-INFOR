/*
// https://codepen.io/GemmaCroad/pen/RNWwGzG
class Notificacao {
  constructor(tipo, titulo, mensagem, icone, tempoExpiracao = 5000) {
    this.tempoExpiracao = tempoExpiracao;
    this.tipo = tipo;
    this.titulo = titulo;
    this.mensagem = mensagem;
    this.icone = icone;

    this.divListaNotificacoes = document.querySelector(
      "#div-notification-list"
    );

    // Cria a <div> para ser a lista das notificações
    if (!this.divListaNotificacoes) {
      this.divListaNotificacoes = document.createElement("div");
      this.divListaNotificacoes.id = "div-notification-list";
      document.body.appendChild(this.divListaNotificacoes);
      this.divListaNotificacoes = document.querySelector(
        "#div-notification-list"
      );
    }

    this.construirNotificacao();
  }

  construirNotificacao() {
    // Cria o elemento de Notificação
    this.divNotificacao = document.createElement("div");
    // Classes CSS do Elemento
    this.divNotificacao.classList.add(
      "div-notification",
      `div-notification-${tipo}`
    );

    // --- Botão para Fechar a Notificação ---
    this.buttonFechar = document.createElement("div");
    // Classes CSS
    this.buttonFechar.classList.add("button-close-notification");
    // Conteúdo Interno
    this.buttonFechar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>`;
    // Acrescenta ao Elemento da Notificação
    this.divNotificacao.appendChild(this.buttonFechar);

    // --- Cabeçalho da Notificação ---
    this.divCabecalho = document.createElement("div");
    this.divTitulo = document.createElement("div");
    this.divIcone = document.createElement("div");
    // Classes CSS
    this.divCabecalho.classList.add("div-notification-header");
    this.divTitulo.classList.add("div-notification-title");
    this.divIcone.classList.add("div-notification-icon");
    // Conteúdo Interno
    this.divTitulo.innerHTML = this.titulo;
    this.divIcone.innerHTML = this.icone;
    // Acrescenta ao Elemento da Notificação
    this.divCabecalho.appendChild(this.divTitulo);
    this.divCabecalho.appendChild(this.divIcone);
    this.divNotificacao.appendChild(this.divCabecalho);

    // --- Mensagem da Notificação ---
    this.divMensagem = document.createElement("div");
    // Classes CSS
    this.divMensagem.classList.add("div-notification-message");
    // Conteúdo Interno
    this.divMensagem.innerHTML = this.mensagem;
    // Acrescenta ao Elemento da Notificação
    this.divNotificacao.appendChild(this.divMensagem);

    // Acrescenta à Lista
    this.divListaNotificacoes.appendChild(this.divNotificacao);
  }

  mostrar() {}

  remover() {}

  sairAutomaticamente() {
    delay(this.tempoExpiracao);
    this.remover();
  }
}
*/

// Classe para controlar a Tela de Carregamento
class TelaCarregamento {
  constructor(mensagemInicial = "") {
    this.mensagemInicial = mensagemInicial;

    // Seleciona a <div> principal, se existir
    this.divTelaCarregamento = document.querySelector("#div-load-screen");

    // Cria a tela de carregamento se ela não existir
    if (!this.divTelaCarregamento) {
      this.construirTelaCarregamento();
      this.divTelaCarregamento = document.querySelector("#div-load-screen");
    }

    // Seleciona os elementos internos
    this.spanInfoProgresso = this.divTelaCarregamento.querySelector(
      ".span-progress-info"
    );

    // Define a mensagem inicial, se houver
    if (this.mensagemInicial) {
      this.definirInfoProgresso(this.mensagemInicial);
    }
  }

  construirTelaCarregamento() {
    // Cria o elemento principal da Tela de Carregamento
    this.divTelaCarregamento = document.createElement("div");
    this.divTelaCarregamento.id = "div-load-screen";
    this.divTelaCarregamento.style.display = "none";

    // --- Ícone de carregamento ---
    this.imgIcone = document.createElement("img");
    this.imgIcone.src = "/static/assets/icons/arrow-clockwise.svg";
    this.imgIcone.alt = "";
    this.imgIcone.setAttribute("onload", "buscarSvg(this)");
    this.divTelaCarregamento.appendChild(this.imgIcone);

    // --- Texto dinâmico de progresso ---
    this.spanInfoProgresso = document.createElement("span");
    this.spanInfoProgresso.classList.add("span-progress-info");
    this.divTelaCarregamento.appendChild(this.spanInfoProgresso);

    // Acrescenta ao body
    document.body.appendChild(this.divTelaCarregamento);
  }

  // --- Atualiza a mensagem de progresso ---
  definirInfoProgresso(info = "") {
    this.spanInfoProgresso.textContent = info;
  }

  // --- Mostra a Tela de Carregamento ---
  mostrar(mensagem = "") {
    this.divTelaCarregamento.style.display = "flex";
    if (mensagem) {
      this.definirInfoProgresso(mensagem);
    }
  }

  // --- Oculta a Tela de Carregamento ---
  ocultar() {
    this.divTelaCarregamento.style.display = "none";
    this.definirInfoProgresso("");
  }
}

function criarComponenteTopBar() {
  const expandSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16" style="display: block;">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>`;

  // ----- <div> Top Bar, barra de título -----
  const divTopBar = document.querySelector("#div-top-bar");

  // --- Botão para expandir ou colapsar os links ---
  const buttonExpandCollapseLinks = document.createElement("button");

  buttonExpandCollapseLinks.id = "button-collapse-expand-links";
  buttonExpandCollapseLinks.classList.add("escondido");
  buttonExpandCollapseLinks.innerHTML = expandSvg;

  divTopBar.appendChild(buttonExpandCollapseLinks);

  // --- Lista de links ---
  const ulTopBar = document.createElement("ul");
  const linksTopBar = [
    { href: "/criar-quiz.html", text: "Criar" },
    { href: "/adicionar.html", text: "Adicionar" },
    { href: "/atualizar.html", text: "Atualizar" },
    { href: "/excluir.html", text: "Excluir" },
  ];

  ulTopBar.id = "ul-top-bar-links";
  ulTopBar.classList.add("escondido");

  // Percorre os links
  linksTopBar.forEach((link) => {
    // Cria um <li> e depois um <a>
    const li = document.createElement("li");
    const a = document.createElement("a");
    // Escreve o link e texto do <a>
    a.href = link.href;
    a.textContent = link.text;
    // Acrescenta o <a> ao <li> e depois o <li> à <ul>
    li.appendChild(a);
    ulTopBar.appendChild(li);
  });

  // Adiciona os elementos na divTopBar
  divTopBar.appendChild(ulTopBar);
}

function configurarEventListenersComponente() {
  const buttonExpandCollapseLinks = document.querySelector(
    "#button-collapse-expand-links"
  );
  const ulTopBarLinks = document.querySelector("#ul-top-bar-links");

  // Controla a expansão ou colapso dosl links da Top Bar
  buttonExpandCollapseLinks.addEventListener("click", () => {
    const expandSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16" style="display: block;">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>`;
    const collapseSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16" style="display: block;">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>`;

    if (ulTopBarLinks.classList.contains("escondido")) {
      ulTopBarLinks.classList.remove("escondido");
      buttonExpandCollapseLinks.innerHTML = collapseSvg;
    } else {
      ulTopBarLinks.classList.add("escondido");
      buttonExpandCollapseLinks.innerHTML = expandSvg;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  criarComponenteTopBar();
  configurarEventListenersComponente();
});
