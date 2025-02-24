// Número de macacos na população
const populationSize = 5;
let population = [];
let populationCrossOver = [];
let populationMutacao = [];
let roulette = [];
let currentRotation = 0;
let selectedCount = 0;

// Exibe as seções (Seleção, Crossover e Mutação) após gerar a população
function showSections() {
  document.getElementById("selecao-section").style.display = "block";
  document.getElementById("cross-over-section").style.display = "block";
  document.getElementById("mutacao-section").style.display = "block";
}

// Função para criar um macaco aleatório
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

// Cria um card para exibir os atributos do macaco, com imagem
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

  // Desenha cada fatia com cores vibrantes e bordas escuras
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

// Função para girar a roleta e selecionar macacos
async function spinRoulette() {
  if (roulette.length === 0) return;

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

  let stopAngleDeg = stopAngle * (180 / Math.PI);
  let baseRotation = 360 * 5;
  let finalRotation = baseRotation - stopAngleDeg;
  currentRotation = finalRotation % 360;

  const canvas = document.getElementById("roletaCanvas");
  canvas.style.transition = "transform 3s ease-out";
  canvas.style.transform = `rotate(${finalRotation}deg)`;

  await new Promise(resolve => setTimeout(resolve, 3000));

  if (!populationCrossOver.includes(selectedMonkey)) {
    addToNextGeneration(selectedMonkey);
    selectedCount++;
  }
}

// Adiciona o macaco selecionado à seção de seleção (para crossover)
function addToNextGeneration(monkey) {
  populationCrossOver.push(monkey);
  document.getElementById("selected").innerHTML += monkeyCard(monkey);
}

// =========================
// CROSSOVER
// =========================

function crossoverOnePoint(parent1, parent2) {
  let child = { ...parent1 };
  child.agilidade = parent2.agilidade;
  return child;
}

function generateOffspring() {
  if (populationCrossOver.length < 2) {
    alert("Selecione pelo menos dois macacos antes de fazer o crossover!");
    return;
  }

  let parent1 = populationCrossOver[0];
  let parent2 = populationCrossOver[1];

  let child = crossoverOnePoint(parent1, parent2);

  document.getElementById("new-generation-cross-over").innerHTML += monkeyCard(child);
  populationMutacao.push(child);
}

// =========================
// MUTAÇÃO
// =========================

function mutate(monkey) {
  let mutated = { ...monkey };
  let attribute = ["forca", "agilidade", "inteligencia"][Math.floor(Math.random() * 3)];
  mutated[attribute] = Math.min(100, Math.max(0, mutated[attribute] + (Math.random() < 0.5 ? -10 : 10)));
  return mutated;
}

function selectMutant() {
  if (populationMutacao.length === 0) {
    alert("Nenhum macaco disponível para mutação!");
    return;
  }

  let mutant = mutate(populationMutacao[0]);
  document.getElementById("new-generation-mutacao").innerHTML += monkeyCard(mutant);
}

// =========================
// EVENTOS
// =========================

document.getElementById("generateBtn").addEventListener("click", generatePopulation);
document.getElementById("spinBtn").addEventListener("click", spinRoulette);
document.getElementById("offspringBtn").addEventListener("click", generateOffspring);
document.getElementById("mutateBtn").addEventListener("click", selectMutant);
