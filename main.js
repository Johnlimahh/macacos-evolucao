const populationSize = 5;
let population = [];
let populationCrossOver = [];
let roulette = [];
let selectedCount = 0;
let isSpinning = false;
let currentRotation = 0;

const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"]; // Cores fixas para a roleta

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

function fitness(monkey) {
    return monkey.forca + monkey.agilidade + monkey.inteligencia;
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

    // Habilita os botões de seleção, crossover e mutação
    document.getElementById("spinBtn").disabled = false;
    document.getElementById("offspringBtn").disabled = false;
    document.getElementById("mutateBtn").disabled = false;
}

function createRoulette() {
    const canvas = document.getElementById("roletaCanvas");
    const ctx = canvas.getContext("2d");
    const sliceAngle = (2 * Math.PI) / populationSize; // Ângulo igual para cada fatia
    let startAngle = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    population.forEach((monkey, index) => {
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 150, startAngle, startAngle + sliceAngle);
        ctx.fillStyle = colors[index % colors.length]; // Usa a cor fixa correspondente
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.stroke();
        roulette.push({ monkey, startAngle, endAngle: startAngle + sliceAngle });
        startAngle += sliceAngle;
    });
}

async function spinRoulette() {
    if (isSpinning) return;
    isSpinning = true;

    const canvas = document.getElementById("roletaCanvas");
    const totalSpins = 5; // Número de voltas antes de parar
    const spinDuration = 2000; // Duração da rotação em milissegundos
    const stopAngle = Math.random() * 2 * Math.PI; // Ângulo de parada aleatório

    // Gira a roleta continuamente
    canvas.style.transition = "transform 2s linear";
    canvas.style.transform = `rotate(${360 * totalSpins}deg)`;

    await new Promise(resolve => setTimeout(resolve, spinDuration));

    // Para a roleta no ângulo de parada
    canvas.style.transition = "transform 3s cubic-bezier(0.25, 1, 0.5, 1)";
    canvas.style.transform = `rotate(${360 * totalSpins + (stopAngle * (180 / Math.PI))}deg)`;

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Seleciona o macaco correspondente ao ângulo de parada
    const selectedMonkey = roulette.find(
        entry => stopAngle >= entry.startAngle && stopAngle < entry.endAngle
    ).monkey;

    if (!populationCrossOver.includes(selectedMonkey)) {
        populationCrossOver.push(selectedMonkey);
        selectedCount++;
        document.getElementById("selected").innerHTML += monkeyCard(selectedMonkey, "Selecionado");
    }

    if (selectedCount < populationSize) {
        setTimeout(() => spinRoulette(), 1000); // Continua girando até selecionar 5 macacos
    } else {
        document.getElementById("offspringBtn").disabled = false; // Habilita o botão de gerar nova geração
        document.getElementById("mutateBtn").disabled = false; // Habilita o botão de mutação
    }

    isSpinning = false;
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

function mutate(monkey) {
    let mutated = { ...monkey };
    let attributes = ["forca", "agilidade", "inteligencia"];
    let attribute = attributes[Math.floor(Math.random() * attributes.length)];
    mutated[attribute] = Math.min(100, Math.max(0, mutated[attribute] + (Math.random() < 0.5 ? -10 : 10)));
    return mutated;
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

// Event listeners
document.getElementById("generateBtn").addEventListener("click", generatePopulation);
document.getElementById("spinBtn").addEventListener("click", spinRoulette);
document.getElementById("offspringBtn").addEventListener("click", generateOffspring);
document.getElementById("mutateBtn").addEventListener("click", generateMutation);
