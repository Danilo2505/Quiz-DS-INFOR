// Função para buscar um arquivo SVG e inseri-lo inline no HTML
const buscarSvg = (image) => {
  // Faz uma requisição para obter o conteúdo do arquivo SVG a partir do src da imagem
  fetch(image.src)
    .then((response) => response.text()) // Converte a resposta para texto
    .then((response) => {
      const span = document.createElement("span"); // Cria um elemento <span>
      span.innerHTML = response; // Define o conteúdo do <span> como o SVG retornado
      const inlineSvg = span.getElementsByTagName("svg")[0]; // Obtém o elemento <svg>
      image.parentNode.replaceChild(inlineSvg, image); // Substitui a imagem original pelo SVG inline
      return true;
    });
};

// Espera um tempo em milissegundos
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Faz uma requisição para o Flask e retorna os dados em JSON
async function getData(apiLink, parametros) {
  // Constrói o link da requisição com os parâmetros, se houver
  const linkRequisicao = parametros ? `${apiLink}/${parametros}` : apiLink;
  return fetch(linkRequisicao).then((response) => {
    if (!response.ok) {
      throw new Error(`Error HTTP! Status: ${response.status}`);
    }
    return response.json(); // Transforma a resposta JSON do Flask
  });
}

async function postData(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST", // Specify the HTTP method as POST
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header for JSON data
      },
      body: JSON.stringify(data), // Convert the data object to a JSON string
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json(); // Parse the JSON response
    return responseData;
  } catch (error) {
    console.error("Error during POST request:", error);
    throw error; // Re-throw the error for further handling
  }
}
