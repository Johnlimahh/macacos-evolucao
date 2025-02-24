// Número de macacos na população
const populationSize = 5;
let population = [];
let populationCrossOver = [];
let populationMutacao = [];
let roulette = [];
let selectedCount = 0;

// Exibe as seções após gerar a população
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

// Cria a roleta baseada na fitness dos macacos
function createRoulette() {
  roulette = population.map(monkey => ({ monkey, weight: fitness(monkey) }));
}

// Função para girar a roleta e selecionar macacos
function spinRoulette() {
  if (selectedCount >= populationSize) return;
  let totalFitness = roulette.reduce((acc, entry) => acc + entry.weight, 0);
  let rand = Math.random() * totalFitness;
  let selectedMonkey = null;

  for (let entry of roulette) {
    if (rand < entry.weight) {
      selectedMonkey = entry.monkey;
      break;
    }
    rand -= entry.weight;
  }

  if (selectedMonkey && !populationCrossOver.includes(selectedMonkey)) {
    populationCrossOver.push(selectedMonkey);
    document.getElementById("selected").innerHTML += monkeyCard(selectedMonkey);
    selectedCount++;
  }
}

// CROSSOVER
function crossoverOnePoint(parent1, parent2) {
  return {
    forca: parent1.forca,
    agilidade: parent2.agilidade,
    inteligencia: (parent1.inteligencia + parent2.inteligencia) / 2
  };
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

// MUTAÇÃO
function mutate(monkey) {
  let mutated = { ...monkey };
  let attributes = ["forca", "agilidade", "inteligencia"];
  let attribute = attributes[Math.floor(Math.random() * attributes.length)];
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

// EVENTOS
document.getElementById("generateBtn").addEventListener("click", generatePopulation);
document.getElementById("spinBtn").addEventListener("click", spinRoulette);
document.getElementById("offspringBtn").addEventListener("click", generateOffspring);
document.getElementById("mutateBtn").addEventListener("click", selectMutant);
