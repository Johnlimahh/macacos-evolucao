const populationSize = 5;
let population = [];
let populationCrossOver = [];
let selectedCount = 0;
let isSpinning = false;

const canvas = document.getElementById("roletaCanvas");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = canvas.width / 2;
let rotationAngle = 0;

function showSections() {
  document.getElementById("selecao-section").style.display = "block";
  document.getElementById("cross-over-section").style.display = "block";
  document.getElementById("mutacao-section").style.display = "block";
}

function randomMonkey() {
  const monkey = {
    forca: Math.floor(Math.random() * 101),
    agilidade: Math.floor(Math.random() * 101),
    inteligencia: Math.floor(Math.random() * 101)
  };
  monkey.fit = monkey.forca + monkey.agilidade + monkey.inteligencia;
  return monkey;
}

<<<<<<< HEAD
function fitness(monkey) {
  return monkey.forca + monkey.agilidade;
}

function monkeyCard(monkey) {
=======
function monkeyCard(monkey, title = "") {
>>>>>>> 2a35c8949d4f46d35566e0a174877c8837245bb3
  return `
    <div class="monkey-card">
      <img src="img/noun-monkey-7381417.svg" alt="Macaco" />
      <p><strong>${title || "Macaco"}</strong></p>
      <p>Força: ${monkey.forca.toFixed(2)}</p>
      <p>Agilidade: ${monkey.agilidade.toFixed(2)}</p>
      <p>Inteligência: ${monkey.inteligencia.toFixed(2)}</p>
      <p><strong>Fitness: ${monkey.fit.toFixed(2)}</strong></p>
    </div>
  `;
}

function generatePopulation() {
  population = [];
  populationCrossOver = [];
  selectedCount = 0;
  document.getElementById("population").innerHTML = "";
  document.getElementById("selected").innerHTML = "";
  document.querySelector("#new-generation-cross-over .offspring-generation").innerHTML = "";
  document.querySelector("#new-generation-mutacao .mutation-generation").innerHTML = "";

  for (let i = 0; i < populationSize; i++) {
    let monkey = randomMonkey();
    population.push(monkey);
    document.getElementById("population").innerHTML += monkeyCard(monkey);
  }

  createRoulette();
  showSections();
<<<<<<< HEAD

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
=======
  document.getElementById("spinBtn").disabled = false;
}

function createRoulette() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const totalFitness = population.reduce((sum, monkey) => sum + monkey.fit, 0);
  let startAngle = rotationAngle;

  population.forEach((monkey) => {
    const sliceAngle = (monkey.fit / totalFitness) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 60%)`;
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
    startAngle += sliceAngle;
  });
}

function animateRoulette(duration = 2000) {
  if (isSpinning) return;
  isSpinning = true;
  document.getElementById("spinBtn").disabled = true;

  const startTime = Date.now();
  const spinSpeed = Math.PI * 4;

  function spinStep() {
    const elapsed = Date.now() - startTime;
    if (elapsed < duration) {
      rotationAngle += spinSpeed * (duration - elapsed) / duration;
      createRoulette();
      requestAnimationFrame(spinStep);
    } else {
      finalizeSpin();
>>>>>>> 2a35c8949d4f46d35566e0a174877c8837245bb3
    }
  }

<<<<<<< HEAD
  if (selectedMonkey) {
    document.getElementById("selected").innerHTML = monkeyCard(selectedMonkey);
=======
  spinStep();
}

function finalizeSpin() {
  isSpinning = false;
  const selectedMonkey = weightedSelection();

  if (!populationCrossOver.includes(selectedMonkey)) {
>>>>>>> 2a35c8949d4f46d35566e0a174877c8837245bb3
    populationCrossOver.push(selectedMonkey);
    selectedCount++;
  }

<<<<<<< HEAD
  // Se necessário, desabilite o botão após a seleção
  document.getElementById("spinBtn").disabled = true;
=======
  if (selectedCount < populationSize) {
    setTimeout(() => animateRoulette(), 1000); // Espera 1 segundo antes de girar de novo
  } else {
    document.getElementById("offspringBtn").disabled = false;
    document.getElementById("mutateBtn").disabled = false;
  }
>>>>>>> 2a35c8949d4f46d35566e0a174877c8837245bb3
}

function weightedSelection() {
  const totalFitness = population.reduce((sum, monkey) => sum + monkey.fit, 0);
  let randomValue = Math.random() * totalFitness;

  for (const monkey of population) {
    randomValue -= monkey.fit;
    if (randomValue <= 0) {
      return monkey;
    }
  }
  return population[population.length - 1];
}

function generateOffspring() {
  const newGeneration = [];
  
  for (let i = 0; i < populationCrossOver.length - 1; i += 2) {
    const parent1 = populationCrossOver[i];
    const parent2 = populationCrossOver[i + 1];

    const child = {
      forca: (parent1.forca + parent2.forca) / 2,
      agilidade: (parent1.agilidade + parent2.agilidade) / 2,
      inteligencia: (parent1.inteligencia + parent2.inteligencia) / 2,
      fit: ((parent1.forca + parent2.forca) / 2) +
           ((parent1.agilidade + parent2.agilidade) / 2) +
           ((parent1.inteligencia + parent2.inteligencia) / 2)
    };

    newGeneration.push(child);
  }

<<<<<<< HEAD
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
=======
  const offspringContainer = document.querySelector("#new-generation-cross-over .offspring-generation");
  if (offspringContainer) {
    offspringContainer.innerHTML = "";
    newGeneration.forEach(offspring => {
      offspringContainer.innerHTML += monkeyCard(offspring, "Filho");
    });
  } else {
    console.error("Elemento .offspring-generation não encontrado.");
  }
>>>>>>> 2a35c8949d4f46d35566e0a174877c8837245bb3
}

function generateMutation() {
  const mutationTypes = ["Mutação Aleatória", "Mutação Pequena", "Mutação Dirigida"];
  const mutationGeneration = [];

  mutationTypes.forEach((mutationType, index) => {
    const monkey = population[index];

    let mutatedMonkey;
    if (mutationType === "Mutação Aleatória") {
      mutatedMonkey = {
        forca: monkey.forca + Math.floor(Math.random() * 21) - 10,
        agilidade: monkey.agilidade + Math.floor(Math.random() * 21) - 10,
        inteligencia: monkey.inteligencia + Math.floor(Math.random() * 21) - 10,
      };
    } else {
      mutatedMonkey = { ...monkey };
      const attribute = ["forca", "agilidade", "inteligencia"][Math.floor(Math.random() * 3)];
      mutatedMonkey[attribute] += Math.floor(Math.random() * 21) - 10;
    }

    mutatedMonkey.fit = mutatedMonkey.forca + mutatedMonkey.agilidade + mutatedMonkey.inteligencia;
    mutationGeneration.push({ ...mutatedMonkey, title: mutationType });
  });

  const mutationContainer = document.querySelector("#new-generation-mutacao .mutation-generation");
  if (mutationContainer) {
    mutationContainer.innerHTML = "";
    mutationGeneration.forEach(mutatedMonkey => {
      mutationContainer.innerHTML += monkeyCard(mutatedMonkey, mutatedMonkey.title);
    });
  } else {
    console.error("Elemento .mutation-generation não encontrado.");
  }
}


document.getElementById("generateBtn").addEventListener("click", generatePopulation);
document.getElementById("spinBtn").addEventListener("click", () => animateRoulette());
document.getElementById("offspringBtn").addEventListener("click", generateOffspring);
document.getElementById("mutateBtn").addEventListener("click", generateMutation);
