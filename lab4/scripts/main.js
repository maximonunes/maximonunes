// Referências guardadas uma única vez (fora das funções), como pede o enunciado
let contador = 0;
const spanContador = document.querySelector('#contador');
const botao = document.querySelector('#btn-contar');
const foto = document.querySelector('#foto');
const legenda = document.querySelector('#legenda');
const area = document.querySelector('#area');
const coordenadas = document.querySelector('#coordenadas');
const titulo = document.querySelector('#titulo');

const cores = ['#ffd166', '#ef476f', '#06d6a0', '#118ab2', '#c77dff'];

// Evento 1: click -> incrementa o contador e muda a cor
function contar() {
    contador++;
    spanContador.textContent = contador;
    spanContador.style.color = cores[contador % cores.length];
    if (contador === 10) {
        titulo.textContent = 'Chegaste aos 10 cliques! 🚀';
    }
}

// Evento 2: dblclick -> reinicia o contador
// (nota: um duplo clique também dispara dois "click", por isso o reset acontece no fim)
function reiniciar() {
    contador = 0;
    spanContador.textContent = contador;
    spanContador.style.color = '';
    titulo.textContent = 'Planeta Interativo';
    botao.textContent = 'Reiniciado! Clica para contar de novo';
}

// Evento 3: mouseover -> a imagem cresce e fica mais viva
function destacarFoto() {
    foto.style.transform = 'scale(1.1) rotate(2deg)';
    foto.style.filter = 'brightness(1.2) saturate(1.4)';
    legenda.textContent = 'Olá! Não me deixes ir embora... 🌍';
}

// Evento 4: mouseout -> volta ao normal
function normalizarFoto() {
    foto.style.transform = 'none';
    foto.style.filter = 'none';
    legenda.textContent = 'Foste-te embora... 😢';
}

// Evento 5: mousemove -> mostra coordenadas e muda a cor de fundo da área
function seguirRato(evento) {
    const retangulo = area.getBoundingClientRect();
    const x = Math.round(evento.clientX - retangulo.left);
    const y = Math.round(evento.clientY - retangulo.top);
    coordenadas.textContent = 'x: ' + x + ' | y: ' + y;

    const matiz = Math.round((x / retangulo.width) * 360);
    const luz = 20 + Math.round((y / retangulo.height) * 30);
    area.style.backgroundColor = 'hsl(' + matiz + ', 70%, ' + luz + '%)';
}
