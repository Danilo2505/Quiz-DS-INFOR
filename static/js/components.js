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
