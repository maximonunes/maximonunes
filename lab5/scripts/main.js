const mensagem = document.querySelector("#mensagem");

mensagem.addEventListener("mouseover", () => {
  mensagem.textContent = "Estás a passar o rato!";
});
mensagem.addEventListener("mouseout", () => {
  mensagem.textContent = "Passa por aqui";
});

// Pinta-me com select
const selectCores = document.querySelector("#selectCores");

selectCores.addEventListener("change", () => {
  const corSelecionada = selectCores.value;
  if (corSelecionada) {
    document.body.style.backgroundColor = corSelecionada;
  }
});

// Experimenta escrever
const inputTexto = document.querySelector("#texto");
const resultadoTexto = document.querySelector("#textoResultado");

inputTexto.addEventListener("input", () => {
  resultadoTexto.textContent = inputTexto.value;
});

// Contador manual
let contador = 0;
const contadorSpan = document.querySelector("#contador");
const btnContar = document.querySelector("#btnContar");

btnContar.addEventListener("click", () => {
  contador++;
  contadorSpan.textContent = contador;
});

// Contador automático
let counter = 0;
const counterSpan = document.querySelector("#counter");

setInterval(() => {
  counter++;
  counterSpan.textContent = counter;
}, 1000);

// Dados pessoais
const inputNome = document.querySelector("#nome");
const inputIdade = document.querySelector("#idade");
const btnSubmit = document.querySelector("#btnSubmit");
const resultadoDados = document.querySelector("#dadosResultado");

btnSubmit.addEventListener("click", () => {
  const nome = inputNome.value;
  const idade = inputIdade.value;

  if (!nome || !idade) {
    alert("Preencha todos os campos!");
    return;
  }

  resultadoDados.textContent = `Olá, ${nome} tem ${idade} anos!`;

  inputNome.value = "";
  inputIdade.value = "";
});
