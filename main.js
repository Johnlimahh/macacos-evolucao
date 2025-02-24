// Número de macacos na população
const populationSize = 5;
let population = [];
let populationCrossOver = [];
let populationMutacao = [];
let roulette = [];
let selectedCount = 0;

function showSections() {
  document.getElementById("selecao-section").style.display = "block";
  document.getElementById("cross-over-section").style.display = "block";
  document.getElementById("mutacao-section").style.display = "block";
}

function randomMonkey() {
  return {
    forca: Math.floor(Math.random() * 101),
    agilidade: Math.floor(Math.random() * 101),
    inteligencia: Math.floor(Math.random() * 101)
  };
}

function fitness(monkey) {
  return monkey.forca + monkey.agilidade;
}

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

function createRoulette() {
  roulette = [...population];
}

function spinRoulette() {
  if (roulette.length === 0 || selectedCount >= populationSize) return;
  let index = Math.floor(Math.random() * roulette.length);
  let selectedMonkey = roulette.splice(index, 1)[0];
  addToNextGeneration(selectedMonkey);
  selectedCount++;
}

function addToNextGeneration(monkey) {
  populationCrossOver.push(monkey);
  document.getElementById("selected").innerHTML += monkeyCard(monkey);
}

function crossoverOnePoint(parent1, parent2) {
  let child = { ...parent1, agilidade: parent2.agilidade };
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

document.getElementById("generateBtn").addEventListener("click", generatePopulation);
document.getElementById("spinBtn").addEventListener("click", spinRoulette);
document.getElementById("offspringBtn").addEventListener("click", generateOffspring);
document.getElementById("mutateBtn").addEventListener("click", selectMutant);
