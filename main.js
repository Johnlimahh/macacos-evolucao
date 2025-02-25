const populationSize = 5;
let population = [];
let populationCrossOver = [];
let selectedCount = 0;
let isSpinning = false;
let currentRotation = 0;
let rotationAngle = 0;
let rouletteColors = [];

// Canvas setup
const canvas = document.getElementById("roletaCanvas");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(centerX, centerY);

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

function monkeyCard(monkey, title = "") {
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

    // Habilita o botão de girar roleta
    document.getElementById("spinBtn").disabled = false;
    
    // Desabilita os outros botões até completar a seleção
    document.getElementById("offspringBtn").disabled = true;
    document.getElementById("mutateBtn").disabled = true;
}

function createRoulette() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const totalFitness = population.reduce((sum, monkey) => sum + monkey.fit, 0);
    let startAngle = rotationAngle;

    // Se as cores da roleta ainda não foram geradas, gera-as
    if (rouletteColors.length === 0) {
        population.forEach(() => {
            rouletteColors.push(`hsl(${Math.random() * 360}, 80%, 60%)`);
        });
    }

    population.forEach((monkey, index) => {
        const sliceAngle = (monkey.fit / totalFitness) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.fillStyle = rouletteColors[index]; // Usa as cores armazenadas
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.stroke();
        startAngle += sliceAngle;
    });
}

function animateRoulette(duration = 1000) {
    if (isSpinning) return;
    isSpinning = true;
    document.getElementById("spinBtn").disabled = true;

    const startTime = Date.now();
    const spinSpeed = Math.PI * 8; // Gira mais rápido

    function spinStep() {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            rotationAngle += spinSpeed * (duration - elapsed) / duration;
            createRoulette();
            requestAnimationFrame(spinStep);
        } else {
            finalizeSpin();
        }
    }

    spinStep();
}

function finalizeSpin() {
    isSpinning = false;
    const selectedMonkey = weightedSelection();

    if (!populationCrossOver.includes(selectedMonkey)) {
        populationCrossOver.push(selectedMonkey);
        selectedCount++;
        document.getElementById("selected").innerHTML += monkeyCard(selectedMonkey, "Selecionado " + selectedCount); 
    }

    if (selectedCount < populationSize) {
        // Continua girando automaticamente após um breve intervalo
        setTimeout(() => animateRoulette(), 1000);
    } else {
        // Quando completar 5 macacos, habilita os botões de crossover e mutação
        document.getElementById("spinBtn").disabled = true;
        document.getElementById("offspringBtn").disabled = false;
        document.getElementById("mutateBtn").disabled = false;
    }
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

    const offspringContainer = document.querySelector("#new-generation-cross-over .offspring-generation");
    if (offspringContainer) {
        offspringContainer.innerHTML = "";
        newGeneration.forEach(offspring => {
            offspringContainer.innerHTML += monkeyCard(offspring, "Filho");
        });
    } else {
        console.error("Elemento .offspring-generation não encontrado.");
    }
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
