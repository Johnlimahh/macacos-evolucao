// Número de macacos na população
const populationSize = 5;
let population = [];
let populationCrossOver = [];
let populationMutacao = [];
let roulette = [];
let currentRotation = 0;
let selectedCount = 0;

// Cria um macaco aleatório
function randomMonkey() {
  return {
    forca: Math.floor(Math.random() * 101),
    agilidade: Math.floor(Math.random() * 101),
    inteligencia: Math.floor(Math.random() * 101)
  };
}

// Função de fitness: valoriza Força e Agilidade
function fitness(monkey) {
  return monkey.forca + monkey.agilidade;
}

// Cria um card para exibir os atributos do macaco
function monkeyCard(monkey) {
  return `
    <div class="monkey-card">
      <img src="img/noun-monkey-7381417.svg" alt="Macaco" />
      <p><strong>Macaco</strong></p>
      <p>Força: ${monkey.forca}</p>
      <p>Agilidade: ${monkey.agilidade}</p>
      <p>Inteligência: ${monkey.inteligencia}</p>
      <p><small>Fit: ${fitness(monkey)}</small></p>
    </div>
  `;
}

// Gera a população inicial
function generatePopulation() {
  population = [];
  populationCrossOver = [];
  populationMutacao = [];
  selectedCount = 0;
  document.getElementById("population").innerHTML = "";
  document.getElementById("selected").innerHTML = "";
  document.getElementById("new-generation-cross-over").innerHTML = "";
  document.getElementById("new-generation-mutacao").innerHTML = "";

  for (let i = 0; i < populationSize; i++) {
    let monkey = randomMonkey();
    population.push(monkey);
    document.getElementById("population").innerHTML += monkeyCard(monkey);
  }
  createRoulette();
  showSections();
}

// Cria a roleta com base na fitness de cada macaco
function createRoulette() {
  const canvas = document.getElementById("roletaCanvas");
  const ctx = canvas.getContext("2d");
  let totalFitness = population.reduce((acc, monkey) => acc + fitness(monkey), 0);
  let startAngle = 0;
  roulette = [];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha cada fatia com cores de alto contraste e bordas escuras
  for (const monkey of population) {
    let weight = fitness(monkey) / totalFitness;
    let sliceAngle = weight * 2 * Math.PI;
    let endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, startAngle, endAngle);
    ctx.fillStyle = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    roulette.push({ monkey, weight, startAngle, endAngle });
    startAngle = endAngle;
  }
  currentRotation = 0;
  canvas.style.transform = `rotate(${currentRotation}deg)`;
}

// Função para girar a roleta uma vez e gerar um macaco (se ainda não selecionado)
async function spinRoulette() {
  let rand = Math.random();
  let selectedMonkey = null;
  let stopAngle = 0;

  for (let entry of roulette) {
    if (rand < entry.weight) {
      selectedMonkey = entry.monkey;
      stopAngle = (entry.startAngle + entry.endAngle) / 2;
      break;
    }
    rand -= entry.weight;
  }

  // Girar a roleta
  await new Promise(resolve => {
    let rotationSpeed = 15;
    let rotationInterval = setInterval(() => {
      currentRotation += rotationSpeed;
      canvas.style.transform = `rotate(${currentRotation}deg)`;
      if (currentRotation >= stopAngle + 720) {
        clearInterval(rotationInterval);
        resolve();
      }
    }, 10);
  });

  document.getElementById("selected").innerHTML = monkeyCard(selectedMonkey);
  selectedCount++;

  // Exibe os resultados
  if (selectedCount >= 5) {
    document.getElementById("selecao-section").style.display = "none";
    document.getElementById("cross-over-section").style.display = "block";
    document.getElementById("mutacao-section").style.display = "block";
  }
}

// Função para gerar descendentes (Crossover)
function crossover() {
  // A lógica do crossover vai aqui. Exemplo:
  populationCrossOver = population.slice(0, 2);
  document.getElementById("new-generation-cross-over").innerHTML = populationCrossOver.map(monkeyCard).join('');
}

// Função para gerar mutação
function mutate() {
  // A lógica da mutação vai aqui. Exemplo:
  populationMutacao = population.slice(0, 2);
  document.getElementById("new-generation-mutacao").innerHTML = populationMutacao.map(monkeyCard).join('');
}

// Função para exibir as seções necessárias
function showSections() {
  document.getElementById("selecao-section").style.display = "block";
  document.getElementById("cross-over-section").style.display = "none";
  document.getElementById("mutacao-section").style.display = "none";
}

// Event Listeners para os botões
document.getElementById("generateBtn").addEventListener("click", generatePopulation);
document.getElementById("spinBtn").addEventListener("click", spinRoulette);
document.getElementById("offspringBtn").addEventListener("click", crossover);
document.getElementById("mutateBtn").addEventListener("click", mutate);
