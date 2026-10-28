// A. Estado e variáveis com referência de elementos do DOM
const CHAVE = "produtos-selecionados";

if (!localStorage.getItem(CHAVE)) {
  localStorage.setItem(CHAVE, JSON.stringify([]));
}

const listaProdutos = document.getElementById("lista-produtos");
const listaCesto = document.getElementById("lista-cesto");
const totalEl = document.getElementById("total");

// B. Funções utilitárias
function lerCesto() {
  return JSON.parse(localStorage.getItem(CHAVE));
}

function guardarCesto(cesto) {
  localStorage.setItem(CHAVE, JSON.stringify(cesto));
}

function criarProduto(produto) {
  const article = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;

  const preco = document.createElement("p");
  preco.textContent = `Custo total: ${produto.price} €`;

  const descricao = document.createElement("p");
  descricao.classList.add("descricao");
  descricao.textContent = produto.description;

  const rating = document.createElement("p");
  rating.textContent = `Rating: ${produto.rating.rate} (${produto.rating.count})`;

  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao Cesto";
  botao.addEventListener("click", () => adicionarAoCesto(produto));

  article.append(titulo, imagem, preco, rating, descricao, botao);
  return article;
}

function criaProdutoCesto(produto) {
  const article = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;

  const preco = document.createElement("p");
  preco.textContent = `Custo total: ${produto.price} €`;

  const botao = document.createElement("button");
  botao.textContent = "- Remover do Cesto";
  botao.addEventListener("click", () => removerDoCesto(produto));

  article.append(titulo, imagem, preco, botao);
  return article;
}

function atualizaCesto() {
  const cesto = lerCesto();
  listaCesto.innerHTML = "";

  cesto.forEach((produto) => {
    listaCesto.append(criaProdutoCesto(produto));
  });

  const total = cesto.reduce((soma, p) => soma + p.price, 0);
  totalEl.textContent = `Custo total: ${total.toFixed(2)} €`;
}

// C. Event handlers
function renderizarProdutos(produtos) {
  listaProdutos.innerHTML = "";
  produtos.forEach((produto) => {
    listaProdutos.append(criarProduto(produto));
  });
}

function adicionarAoCesto(produto) {
  const cesto = lerCesto();
  cesto.push(produto);
  guardarCesto(cesto);
  atualizaCesto();
}

function removerDoCesto(produto) {
  const cesto = lerCesto();
  const indice = cesto.findIndex((p) => p.id === produto.id);
  if (indice !== -1) {
    cesto.splice(indice, 1); // remove só uma unidade
    guardarCesto(cesto);
  }
  atualizaCesto();
}

// D. Event Listeners
// (os listeners dos botões são criados em criarProduto e criaProdutoCesto)

// E. Inicialização
renderizarProdutos(produtos);
atualizaCesto();
