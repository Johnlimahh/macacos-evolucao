// main.js
const populationSize = 5;
let population = [];
let populationCrossOver = [];
let selectedCount = 0;
let roulette = [];
let currentRotation = 0;

document.getElementById("generateBtn").addEventListener("click", generatePopulation);
document.getElementById("spinBtn").addEventListener("click", spinRouletaContinuamente);
document.getElementById("offspringBtn").addEventListener("click", generateOffspring);
document.getElementById("mutateBtn").addEventListener("click", selectMutant);

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

async function spinRouletaContinuamente() {
  if (roulette.length === 0) return;
  document.getElementById("spinBtn").disabled = true;
  while (selectedCount < populationSize) {
    await spinRoulette();
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  document.getElementById("spinBtn").disabled = false;
}

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

  let stopAngleDeg = stopAngle * (180 / Math.PI);
  let baseRotation = 360 * 5;
  let finalRotation = baseRotation - stopAngleDeg;
  currentRotation = finalRotation % 360;

  const canvas = document.getElementById("roletaCanvas");
  canvas.style.transition = "transform 2s linear";
  canvas.style.transform = `rotate(${360 * 10}deg)`;

  await new Promise(resolve => setTimeout(resolve, 2000));

  canvas.style.transition = "transform 3s cubic-bezier(0.25, 1, 0.5, 1)";
  canvas.style.transform = `rotate(${finalRotation}deg)`;

  await new Promise(resolve => setTimeout(resolve, 3000));

  if (!populationCrossOver.includes(selectedMonkey)) {
    addToNextGeneration(selectedMonkey);
    selectedCount++;
  }
}

function addToNextGeneration(monkey) {
  populationCrossOver.push(monkey);
  document.getElementById("selected").innerHTML += monkeyCard(monkey);
}

function generateOffspring() {
  console.log("Gerando nova geração...");
}

function selectMutant() {
  console.log("Gerando mutação...");
}
