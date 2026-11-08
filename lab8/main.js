// A. Estado e variáveis com referência de elementos do DOM
const API = "https://deisishop.pw.deisi.ulusofona.pt";
const CHAVE = "produtos-selecionados";

if (!localStorage.getItem(CHAVE)) {
  localStorage.setItem(CHAVE, JSON.stringify([]));
}

let todosProdutos = []; // preenchido pelo fetch

const listaProdutos = document.getElementById("lista-produtos");
const listaCesto = document.getElementById("lista-cesto");
const totalEl = document.getElementById("total");
const mensagemProdutos = document.getElementById("mensagem-produtos");

const filtroEl = document.getElementById("filtro");
const ordemEl = document.getElementById("ordem");
const pesquisaEl = document.getElementById("pesquisa");

const estudanteEl = document.getElementById("estudante");
const cupaoEl = document.getElementById("cupao");
const comprarEl = document.getElementById("comprar");
const valorFinalEl = document.getElementById("valor-final");
const referenciaEl = document.getElementById("referencia");

// B. Funções utilitárias
function lerCesto() {
  return JSON.parse(localStorage.getItem(CHAVE));
}

function guardarCesto(cesto) {
  localStorage.setItem(CHAVE, JSON.stringify(cesto));
}

function urlImagem(produto) {
  // se a API devolver um caminho relativo, junta o endereço da API
  return produto.image.startsWith("http") ? produto.image : API + produto.image;
}

function criarProduto(produto) {
  const article = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = urlImagem(produto);
  imagem.alt = produto.title;

  const preco = document.createElement("p");
  preco.textContent = `Custo total: ${Number(produto.price).toFixed(2)} €`;

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
  imagem.src = urlImagem(produto);
  imagem.alt = produto.title;

  const preco = document.createElement("p");
  preco.textContent = `Custo total: ${Number(produto.price).toFixed(2)} €`;

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

  const total = cesto.reduce((soma, p) => soma + Number(p.price), 0);
  totalEl.textContent = `Custo total: ${total.toFixed(2)} €`;
}

function renderizarProdutos(produtos) {
  listaProdutos.innerHTML = "";

  if (produtos.length === 0) {
    mensagemProdutos.textContent = "Nenhum produto encontrado.";
    return;
  }

  mensagemProdutos.textContent = "";
  produtos.forEach((produto) => {
    listaProdutos.append(criarProduto(produto));
  });
}

// filtra, pesquisa e ordena, e depois redesenha
function atualizarLista() {
  const categoria = filtroEl.value;
  const ordem = ordemEl.value;
  const texto = pesquisaEl.value.trim().toLowerCase();

  const lista = todosProdutos
    .filter((p) => !categoria || p.category === categoria)
    .filter((p) => p.title.toLowerCase().includes(texto));

  if (ordem === "asc") lista.sort((a, b) => a.price - b.price);
  if (ordem === "desc") lista.sort((a, b) => b.price - a.price);

  renderizarProdutos(lista);
}

// C. Event handlers
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

function comprar() {
  const cesto = lerCesto();

  if (cesto.length === 0) {
    valorFinalEl.textContent = "O cesto está vazio.";
    referenciaEl.textContent = "";
    return;
  }

  const dados = {
    products: cesto.map((p) => p.id),
    student: estudanteEl.checked,
    coupon: cupaoEl.value.trim(),
    name: "" // confirma no OpenAPI se este campo é necessário
  };

  fetch(`${API}/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  })
    .then((res) => {
      if (!res.ok) {
        // tenta ler a mensagem de erro enviada pela API
        return res.json().then(
          (erro) => { throw new Error(erro.error || erro.message || `Erro ${res.status}`); },
          () => { throw new Error(`Erro ${res.status}`); }
        );
      }
      return res.json();
    })
    .then((resposta) => {
      valorFinalEl.textContent =
        `Valor final a pagar (com eventuais descontos): ${resposta.totalCost} €`;
      referenciaEl.textContent =
        `Referência de pagamento: ${resposta.reference}`;
    })
    .catch((erro) => {
      valorFinalEl.textContent = `Não foi possível concluir a compra: ${erro.message}`;
      referenciaEl.textContent = "";
    });
}

// D. Event Listeners
filtroEl.addEventListener("change", atualizarLista);
ordemEl.addEventListener("change", atualizarLista);
pesquisaEl.addEventListener("input", atualizarLista);
comprarEl.addEventListener("click", comprar);

// E. Inicialização
atualizaCesto();

// produtos
mensagemProdutos.textContent = "A carregar produtos...";
fetch(`${API}/products`)
  .then((res) => {
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    return res.json();
  })
  .then((dados) => {
    todosProdutos = dados;
    atualizarLista();
  })
  .catch((erro) => {
    mensagemProdutos.textContent = `Erro ao carregar produtos: ${erro.message}`;
  });

// categorias
fetch(`${API}/categories`)
  .then((res) => res.json())
  .then((categorias) => {
    categorias.forEach((cat) => {
      // a API pode devolver strings ou objetos; ajusta se necessário
      const valor = typeof cat === "string" ? cat : cat.name;
      filtroEl.append(new Option(valor, valor));
    });
  })
  .catch((erro) => console.error("Erro ao carregar categorias:", erro));
