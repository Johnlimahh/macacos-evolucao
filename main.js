const populationSize = 5;
let population = [];
let populationCrossOver = [];
let selectedCount = 0;
let isSpinning = false;
let currentRotation = 0;
let rotationAngle = 0;
let rouletteColors = [];
let maxFitnessInPopulation = 0; // Armazenar o valor máximo de fitness na população inicial

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

    // Calcular o fitness máximo na população inicial
    maxFitnessInPopulation = Math.max(...population.map(monkey => monkey.fit));
    
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
    
    // Seleciona um modelo base com base na roleta
    const baseMonkey = weightedSelection();
    
    // Gera um novo macaco com características baseadas no macaco selecionado
    // mas garantindo que seu fitness total não ultrapasse o máximo da população inicial
    const newMonkey = generateNewMonkeyBasedOn(baseMonkey);
    
    // Verifica se já existe um macaco com características muito similares
    const isDuplicate = checkForSimilarMonkey(newMonkey);
    
    if (!isDuplicate) {
        populationCrossOver.push(newMonkey);
        selectedCount++;
        document.getElementById("selected").innerHTML += monkeyCard(newMonkey, "Macaco " + selectedCount); 
    } else {
        // Se encontrou um duplicado, tenta gerar um novo macaco
        setTimeout(() => animateRoulette(500), 200);
        return;
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

// Função para gerar um novo macaco baseado em um modelo, respeitando o limite máximo de fitness
function generateNewMonkeyBasedOn(baseMonkey) {
    // Define o quanto os atributos podem variar (de -15 a +15)
    const variationRange = 15;
    
    // Gera valores com variação baseada no macaco original
    let forca = baseMonkey.forca + (Math.random() * variationRange * 2) - variationRange;
    let agilidade = baseMonkey.agilidade + (Math.random() * variationRange * 2) - variationRange;
    let inteligencia = baseMonkey.inteligencia + (Math.random() * variationRange * 2) - variationRange;
    
    // Garante que os valores estejam dentro do intervalo válido (0-100)
    forca = Math.max(0, Math.min(100, forca));
    agilidade = Math.max(0, Math.min(100, agilidade));
    inteligencia = Math.max(0, Math.min(100, inteligencia));
    
    // Calcula o fitness total
    let totalFit = forca + agilidade + inteligencia;
    
    // Se o fitness ultrapassa o máximo da população, normaliza os valores
    if (totalFit > maxFitnessInPopulation) {
        const scaleFactor = maxFitnessInPopulation / totalFit;
        forca = forca * scaleFactor;
        agilidade = agilidade * scaleFactor;
        inteligencia = inteligencia * scaleFactor;
        totalFit = forca + agilidade + inteligencia;
    }
    
    // Arredonda para 2 casas decimais para melhor apresentação
    forca = Math.round(forca * 100) / 100;
    agilidade = Math.round(agilidade * 100) / 100;
    inteligencia = Math.round(inteligencia * 100) / 100;
    totalFit = Math.round(totalFit * 100) / 100;
    
    return {
        forca,
        agilidade,
        inteligencia,
        fit: totalFit
    };
}

// Verifica se existe algum macaco muito similar na população selecionada
function checkForSimilarMonkey(monkey) {
    const similarityThreshold = 5; // Define o limite de similaridade (soma das diferenças)
    
    return populationCrossOver.some(existingMonkey => {
        const forcaDiff = Math.abs(existingMonkey.forca - monkey.forca);
        const agilidadeDiff = Math.abs(existingMonkey.agilidade - monkey.agilidade);
        const inteligenciaDiff = Math.abs(existingMonkey.inteligencia - monkey.inteligencia);
        
        // Se a soma das diferenças for menor que o limite, consideramos similar
        return (forcaDiff + agilidadeDiff + inteligenciaDiff) < similarityThreshold;
    });
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

// One Point Crossover
function onePointCrossover(parent1, parent2) {
    const crossoverPoint = Math.floor(Math.random() * 3); // 0: força, 1: agilidade, 2: inteligência
    
    const child = {
        forca: crossoverPoint <= 0 ? parent1.forca : parent2.forca,
        agilidade: crossoverPoint <= 1 ? parent1.agilidade : parent2.agilidade,
        inteligencia: crossoverPoint <= 2 ? parent1.inteligencia : parent2.inteligencia,
        fit: 0
    };

    child.fit = child.forca + child.agilidade + child.inteligencia;
    return child;
}

// Arithmetic Crossover
function arithmeticCrossover(parent1, parent2) {
    const alpha = Math.random();
    const child = {
        forca: alpha * parent1.forca + (1 - alpha) * parent2.forca,
        agilidade: alpha * parent1.agilidade + (1 - alpha) * parent2.agilidade,
        inteligencia: alpha * parent1.inteligencia + (1 - alpha) * parent2.inteligencia,
        fit: 0
    };

    child.fit = child.forca + child.agilidade + child.inteligencia;
    return child;
}

// Uniform Crossover
function uniformCrossover(parent1, parent2) {
    const child = {
        forca: Math.random() < 0.5 ? parent1.forca : parent2.forca,
        agilidade: Math.random() < 0.5 ? parent1.agilidade : parent2.agilidade,
        inteligencia: Math.random() < 0.5 ? parent1.inteligencia : parent2.inteligencia,
        fit: 0
    };

    child.fit = child.forca + child.agilidade + child.inteligencia;
    return child;
}

function generateOffspring() {
    const newGeneration = [];

    // Selecionar os dois primeiros pais para gerar os filhos iniciais
    const parent1 = populationCrossOver[0];
    const parent2 = populationCrossOver[1];

    // Gerar filhos usando os três tipos de crossover
    const childOnePoint1 = onePointCrossover(parent1, parent2);
    const childOnePoint2 = onePointCrossover(parent2, parent1);
    const childArithmetic = arithmeticCrossover(parent1, parent2);
    const childUniform = uniformCrossover(parent1, parent2);

    // Adicionar os filhos iniciais com os títulos específicos
    newGeneration.push({...childOnePoint1, title: "One Point 1"});
    newGeneration.push({...childOnePoint2, title: "One Point 2"});
    newGeneration.push({...childArithmetic, title: "Arithmetic"});
    newGeneration.push({...childUniform, title: "Uniform"});

    // Mostrar os filhos iniciais na interface
    const offspringContainer = document.querySelector("#new-generation-cross-over .offspring-generation");
    if (offspringContainer) {
        offspringContainer.innerHTML = "";

        // Mostrar os filhos iniciais
        newGeneration.forEach(offspring => {
            offspringContainer.innerHTML += monkeyCard(offspring, offspring.title);
        });

        // Adicionar título "Nova Geração de Cross-Over"
        offspringContainer.innerHTML += "<h3>Nova Geração de Cross-Over</h3>";
    } else {
        console.error("Elemento .offspring-generation não encontrado.");
    }

    // Gerar 5 novos macacos para a Nova Geração de Cross-Over
    const newGenerationOffspring = [];
    for (let i = 0; i < 5; i++) {
        // Selecionar aleatoriamente dois pais da lista newGeneration
        const randomIndex1 = Math.floor(Math.random() * newGeneration.length);
        let randomIndex2 = Math.floor(Math.random() * newGeneration.length);

        // Garantir que os índices dos pais não sejam iguais
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * newGeneration.length);
        }

        const parentA = newGeneration[randomIndex1];
        const parentB = newGeneration[randomIndex2];

        // Usar um método de crossover aleatório
        const crossoverMethods = [onePointCrossover, arithmeticCrossover, uniformCrossover];
        const randomMethod = crossoverMethods[Math.floor(Math.random() * crossoverMethods.length)];

        const offspring = randomMethod(parentA, parentB);
        offspring.title = `Macaco ${i + 1}`;

        newGenerationOffspring.push(offspring);
    }

    // Mostrar os 5 novos macacos da nova geração na interface
    if (offspringContainer) {
        newGenerationOffspring.forEach(offspring => {
            offspringContainer.innerHTML += monkeyCard(offspring, offspring.title);
        });
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
        
        // Garantir que o fitness não ultrapasse o máximo da população inicial
        if (mutatedMonkey.fit > maxFitnessInPopulation) {
            const scaleFactor = maxFitnessInPopulation / mutatedMonkey.fit;
            mutatedMonkey.forca *= scaleFactor;
            mutatedMonkey.agilidade *= scaleFactor;
            mutatedMonkey.inteligencia *= scaleFactor;
            mutatedMonkey.fit = mutatedMonkey.forca + mutatedMonkey.agilidade + mutatedMonkey.inteligencia;
        }
        
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
