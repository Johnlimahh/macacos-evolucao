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
  roulette = population.map(monkey => ({ monkey, weight: fitness(monkey) }));
}

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

  if (!populationCrossOver.includes(selectedMonkey)) {
    addToNextGeneration(selectedMonkey);
    selectedCount++;
  }

  if (selectedCount >= populationSize) {
    document.getElementById("spinBtn").disabled = true;
  }
}

function addToNextGeneration(monkey) {
  populationCrossOver.push(monkey);
  document.getElementById("selected").innerHTML += monkeyCard(monkey);
}

function generateOffspring() {
  populationMutacao = populationCrossOver.map(monkey => ({
    forca: Math.floor(monkey.forca * 1.1),
    agilidade: Math.floor(monkey.agilidade * 1.1),
    inteligencia: monkey.inteligencia
  }));

  document.getElementById("new-generation-cross-over").innerHTML = populationMutacao.map(monkeyCard).join('');
}

function selectMutant() {
  populationMutacao = populationMutacao.map(monkey => ({
    forca: monkey.forca + Math.floor(Math.random() * 10),
    agilidade: monkey.agilidade + Math.floor(Math.random() * 10),
    inteligencia: monkey.inteligencia + Math.floor(Math.random() * 10)
  }));

  document.getElementById("new-generation-mutacao").innerHTML = populationMutacao.map(monkeyCard).join('');
}

document.getElementById("generateBtn").addEventListener("click", generatePopulation);
document.getElementById("spinBtn").addEventListener("click", spinRoulette);
document.getElementById("offspringBtn").addEventListener("click", generateOffspring);
document.getElementById("mutateBtn").addEventListener("click", selectMutant);
