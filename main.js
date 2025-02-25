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

  // Habilita os botões de seleção, crossover e mutação
  document.getElementById("spinBtn").disabled = false;
  document.getElementById("offspringBtn").disabled = false;
  document.getElementById("mutateBtn").disabled = false;
}

function createRoulette() {
  const canvas = document.getElementById("roletaCanvas");
  const ctx = canvas.getContext("2d");
  let totalFitness = population.reduce((acc, monkey) => acc + fitness(monkey), 0);
  let startAngle = 0;
  roulette = [];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const monkey of population) {
    let weight = fitness(monkey) / totalFitness;
    let sliceAngle = weight * 2 * Math.PI;
    let endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, startAngle, endAngle);
    ctx.fillStyle = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();

    roulette.push({ monkey, weight, startAngle, endAngle });
    startAngle = endAngle;
  }
}

async function spinRoulette() {
  // Adiciona classe para efeito de animação (definida no seu CSS)
  const canvas = document.getElementById("roletaCanvas");
  canvas.classList.add("girar");

  // Aguarda o tempo da animação (1 segundo, por exemplo)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Remove a classe para parar a animação
  canvas.classList.remove("girar");

  // Realiza o sorteio apenas UMA vez
  let rand = Math.random();
  let selectedMonkey = null;
  for (let entry of roulette) {
    if (rand < entry.weight) {
      selectedMonkey = entry.monkey;
      break;
    }
    rand -= entry.weight;
  }

  if (selectedMonkey) {
    document.getElementById("selected").innerHTML = monkeyCard(selectedMonkey);
    populationCrossOver.push(selectedMonkey);
    selectedCount++;
  }

  // Se necessário, desabilite o botão após a seleção
  document.getElementById("spinBtn").disabled = true;
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

  document.querySelector("#new-generation-cross-over .offspring-generation").innerHTML += monkeyCard(child);
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
  document.querySelector("#new-generation-mutacao .mutation-generation").innerHTML += monkeyCard(mutant);
}

// EVENTOS
document.getElementById("generateBtn").addEventListener("click", generatePopulation);
document.getElementById("spinBtn").addEventListener("click", spinRoulette);
document.getElementById("offspringBtn").addEventListener("click", generateOffspring);
document.getElementById("mutateBtn").addEventListener("click", selectMutant);
