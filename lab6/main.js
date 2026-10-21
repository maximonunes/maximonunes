// A. declaração de variáveis

const nodeInputNumero = document.querySelector("#registo input[type='number']");
const nodeForm = document.querySelector("#registo form");

const nodeUlColecao = document.querySelector("#colecao ul");
const nodeUlRepetidos = document.querySelector("#secao-repetidos ul");

const nodeTotalColecao = document.querySelector("#total-colecao");
const nodeTotalRepetidos = document.querySelector("#total-repetidos");
const nodeMensagem = document.querySelector("#mensagem");

// Recuperar os dados guardados no navegador
const colecao = JSON.parse(localStorage.getItem("colecao")) || [];
const repetidos = JSON.parse(localStorage.getItem("repetidos")) || [];

// B. event handlers

function guardaCarta() {
  const numero = Number(nodeInputNumero.value);

  if (!Number.isInteger(numero) || numero < 1) {
    nodeMensagem.textContent = "Introduz um número válido.";
    return;
  }

  if (colecao.includes(numero)) {
    repetidos.push(numero);
    repetidos.sort((a, b) => a - b);

    nodeMensagem.textContent = `O cromo ${numero} foi adicionado aos repetidos.`;
  } else {
    colecao.push(numero);
    colecao.sort((a, b) => a - b);

    nodeMensagem.textContent = `Cromo ${numero} registado com sucesso!`;
  }

  atualizaLista(colecao, nodeUlColecao);
  atualizaLista(repetidos, nodeUlRepetidos);

  guardaDados();

  nodeForm.reset();
  nodeInputNumero.focus();
}

function atualizaLista(lista, nodeUl) {
  // Limpar o conteúdo da lista
  nodeUl.innerHTML = "";

  // Criar os elementos HTML
  lista.forEach((numero, indice) => {
    const nodeLi = document.createElement("li");

    if (nodeUl === nodeUlRepetidos) {
      nodeLi.innerHTML = `
                Cromo ${numero}
                <button type="button" data-indice="${indice}">
                    Eliminar
                </button>
            `;
    } else {
      nodeLi.textContent = `Cromo ${numero}`;
    }

    nodeUl.appendChild(nodeLi);
  });

  // Atualizar os contadores
  nodeTotalColecao.textContent = colecao.length;
  nodeTotalRepetidos.textContent = repetidos.length;

  // Associar eventos aos botões de eliminar
  if (nodeUl === nodeUlRepetidos) {
    associaEventosEliminar();
  }
}

function eliminaRepetido(indice) {
  repetidos.splice(indice, 1);

  atualizaLista(repetidos, nodeUlRepetidos);
  guardaDados();

  nodeMensagem.textContent = "Cromo repetido eliminado.";
}

function guardaDados() {
  localStorage.setItem("colecao", JSON.stringify(colecao));
  localStorage.setItem("repetidos", JSON.stringify(repetidos));
}

// C. event listeners

nodeForm.onsubmit = (event) => {
  event.preventDefault();
  guardaCarta();
};

// Associar eventos aos botões de eliminar
function associaEventosEliminar() {
  const botoesEliminar = nodeUlRepetidos.querySelectorAll("button");

  botoesEliminar.forEach((botao) => {
    botao.addEventListener("click", () => {
      const indice = Number(botao.dataset.indice);
      eliminaRepetido(indice);
    });
  });
}

// Mostrar os dados guardados ao abrir a página
atualizaLista(colecao, nodeUlColecao);
atualizaLista(repetidos, nodeUlRepetidos);
