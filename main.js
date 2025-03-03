const populationSize = 5;
let population = [];
let populationCrossOver = [];
let selectedCount = 0;
let isSpinning = false;
let rotationAngle = 0;
let rouletteColors = [];
let maxFitnessMonkey = null; // Armazena o macaco com maior fitness
let referenceFitness = 0; // Valor máximo de fitness na população inicial

// Canvas setup
const canvas = document.getElementById("roletaCanvas");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(centerX, centerY) - 10;

// Valores fixos para os primeiros 5 macacos
const initialMonkeys = [
    { forca: 70, agilidade: 80, inteligencia: 90 },
    { forca: 85, agilidade: 65, inteligencia: 75 },
    { forca: 60, agilidade: 90, inteligencia: 50 },
    { forca: 75, agilidade: 70, inteligencia: 85 },
    { forca: 95, agilidade: 75, inteligencia: 60 }
];

function hideAllSections() {
    // Esconder a roleta
    document.getElementById("roletaCanvas").style.display = "none";
    // Esconder todas as seções
    document.getElementById("selecao-section").style.display = "none";
    document.getElementById("cross-over-section").style.display = "none";
    document.getElementById("mutacao-section").style.display = "none";
}

function showSections() {
    // Mostrar a roleta
    document.getElementById("roletaCanvas").style.display = "block";
    // Mostrar as seções
    document.getElementById("selecao-section").style.display = "block";
    document.getElementById("cross-over-section").style.display = "block";
    document.getElementById("mutacao-section").style.display = "block";
}

function createMonkey(forca, agilidade, inteligencia) {
    const monkey = {
        forca: forca,
        agilidade: agilidade,
        inteligencia: inteligencia
    };
    monkey.fit = monkey.forca + monkey.agilidade + monkey.inteligencia;
    return monkey;
}

function getPercentageFitness(fitness) {
    return (fitness / referenceFitness * 100).toFixed(2);
}

function monkeyCard(monkey, title = "") {
    // Adiciona classe para o melhor macaco
    const isBest = monkey.fit === referenceFitness;
    const bestClass = isBest ? " best-monkey" : "";
    const percentageFitness = getPercentageFitness(monkey.fit);
    
    return `
        <div class="monkey-card${bestClass}">
            <img src="img/noun-monkey-7381417.svg" alt="Macaco" />
            <p><strong>${title || "Macaco"}</strong></p>
            <p>Força: ${monkey.forca.toFixed(2)}</p>
            <p>Agilidade: ${monkey.agilidade.toFixed(2)}</p>
            <p>Inteligência: ${monkey.inteligencia.toFixed(2)}</p>
            <p><strong>Fitness: ${monkey.fit.toFixed(2)}</strong></p>
            <p class="percentage-display">(${percentageFitness}% do máximo)</p>
        </div>
    `;
}

function generatePopulation() {
    // Limpar dados anteriores
    population = [];
    populationCrossOver = [];
    selectedCount = 0;
    document.getElementById("population").innerHTML = "";
    document.getElementById("selected").innerHTML = "";
    document.querySelector("#new-generation-cross-over .offspring-operations").innerHTML = "";
    document.querySelector("#new-generation-cross-over .offspring-generation").innerHTML = "";
    document.querySelector("#new-generation-mutacao .mutation-operations").innerHTML = "";
    document.querySelector("#new-generation-mutacao .mutation-generation").innerHTML = "";

    // Usar os valores fixos para a população inicial
    for (let i = 0; i < populationSize; i++) {
        let monkey = createMonkey(
            initialMonkeys[i].forca,
            initialMonkeys[i].agilidade,
            initialMonkeys[i].inteligencia
        );
        population.push(monkey);
    }

    // Encontrar o macaco com maior fitness
    maxFitnessMonkey = population.reduce((max, monkey) => 
        monkey.fit > max.fit ? monkey : max, population[0]);
    referenceFitness = maxFitnessMonkey.fit;

    // Atualizar a interface
    population.forEach((monkey, index) => {
        const isBest = monkey === maxFitnessMonkey;
        const title = `Macaco ${index + 1}${isBest ? " (Melhor)" : ""}`;
        document.getElementById("population").innerHTML += monkeyCard(monkey, title);
    });

    // Gerar cores para a roleta
    rouletteColors = [];
    population.forEach(() => {
        rouletteColors.push(`hsl(${Math.random() * 360}, 80%, 60%)`);
    });

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

    // Desenhar círculo de fundo
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#f0f0f0";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Desenhar fatias da roleta
    population.forEach((monkey, index) => {
        const sliceAngle = (monkey.fit / totalFitness) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = rouletteColors[index];
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Adicionar texto indicando a qual macaco pertence
        const midAngle = startAngle + (sliceAngle / 2);
        const textRadius = radius * 0.7; // Posição do texto mais próxima do centro
        const textX = centerX + Math.cos(midAngle) * textRadius;
        const textY = centerY + Math.sin(midAngle) * textRadius;
        
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(midAngle + Math.PI/2);
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.font = "bold 12px Arial";
        ctx.fillText(`Macaco ${index + 1}`, 0, 0);
        ctx.restore();

        startAngle += sliceAngle;
    });

    // Desenhar círculo central
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function animateRoulette(duration = 3000) {
    if (isSpinning) return;
    isSpinning = true;
    document.getElementById("spinBtn").disabled = true;

    const startTime = Date.now();
    const spinSpeed = Math.PI * 4; // Velocidade de rotação
    const slowdownFactor = 0.97; // Fator de desaceleração

    let currentSpeed = spinSpeed;

    function spinStep() {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            // Desacelerar gradualmente
            if (elapsed > duration * 0.5) {
                currentSpeed *= slowdownFactor;
            }
            
            rotationAngle += currentSpeed * (0.016); // 0.016 é aproximadamente 1/60 (60fps)
            createRoulette();
            requestAnimationFrame(spinStep);
        } else {
            finalizeSpin();
        }
    }

    spinStep();
}

// Modifique a função finalizeSpin para continuar girando até completar os 5 macacos
function finalizeSpin() {
    isSpinning = false;
    
    // Determinar em qual fatia da roleta o ponteiro parou
    const normalizedAngle = rotationAngle % (2 * Math.PI);
    const totalFitness = population.reduce((sum, monkey) => sum + monkey.fit, 0);
    
    let accumulatedAngle = 0;
    let selectedIndex = 0;
    
    for (let i = 0; i < population.length; i++) {
        const sliceAngle = (population[i].fit / totalFitness) * 2 * Math.PI;
        if (normalizedAngle >= accumulatedAngle && normalizedAngle < accumulatedAngle + sliceAngle) {
            selectedIndex = i;
            break;
        }
        accumulatedAngle += sliceAngle;
    }
    
    // Seleciona o macaco baseado no índice da fatia
    const selectedMonkey = population[selectedIndex];
    
    // Gera um novo macaco baseado no selecionado, com pequenas variações
    const newMonkey = generateNewMonkeyBasedOn(selectedMonkey);
    
    // Verifica duplicação
    const isDuplicate = checkForSimilarMonkey(newMonkey);
    
    if (!isDuplicate) {
        populationCrossOver.push(newMonkey);
        selectedCount++;
        document.getElementById("selected").innerHTML += monkeyCard(
            newMonkey, 
            `Macaco ${selectedCount} (Baseado no ${selectedIndex + 1})`
        ); 
    }

    if (selectedCount < populationSize) {
        // Gira novamente automaticamente após um pequeno delay
        setTimeout(() => animateRoulette(2000), 500);
    } else {
        // Quando completar 5 macacos, habilita os botões de crossover e mutação
        document.getElementById("spinBtn").disabled = true;
        document.getElementById("offspringBtn").disabled = false;
        document.getElementById("mutateBtn").disabled = false;
    }
}

// Modifique a função animateRoulette para ter uma duração variável e mais aleatória
function animateRoulette(duration = 3000) {
    if (isSpinning) return;
    isSpinning = true;
    document.getElementById("spinBtn").disabled = true;

    // Adicione um pouco de aleatoriedade na duração para tornar os giros mais naturais
    const actualDuration = duration + Math.random() * 1000;
    
    const startTime = Date.now();
    const spinSpeed = Math.PI * 4;
    const slowdownFactor = 0.97;

    let currentSpeed = spinSpeed;

    function spinStep() {
        const elapsed = Date.now() - startTime;
        if (elapsed < actualDuration) {
            // Desacelerar gradualmente
            if (elapsed > actualDuration * 0.5) {
                currentSpeed *= slowdownFactor;
            }
            
            rotationAngle += currentSpeed * (0.016);
            createRoulette();
            requestAnimationFrame(spinStep);
        } else {
            finalizeSpin();
        }
    }

    spinStep();
}

// Modifique o evento para o botão "Girar Roleta"
window.onload = function() {
    // Esconder tudo no início
    hideAllSections();
    
    document.getElementById("generateBtn").addEventListener("click", generatePopulation);
    document.getElementById("spinBtn").addEventListener("click", () => {
        // Inicia o processo de giros automáticos
        selectedCount = 0;
        populationCrossOver = [];
        document.getElementById("selected").innerHTML = "";
        animateRoulette(3000);
    });
    document.getElementById("offspringBtn").addEventListener("click", generateOffspring);
    document.getElementById("mutateBtn").addEventListener("click", generateMutation);
};

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
    
    // Se o fitness ultrapassa o máximo da população (referência), normaliza os valores
    if (totalFit > referenceFitness) {
        const scaleFactor = referenceFitness / totalFit;
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
    
    // Normalizar se o fitness ultrapassar o máximo de referência
    if (child.fit > referenceFitness) {
        const scaleFactor = referenceFitness / child.fit;
        child.forca *= scaleFactor;
        child.agilidade *= scaleFactor;
        child.inteligencia *= scaleFactor;
        child.fit = child.forca + child.agilidade + child.inteligencia;
    }
    
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
    
    // Normalizar se o fitness ultrapassar o máximo de referência
    if (child.fit > referenceFitness) {
        const scaleFactor = referenceFitness / child.fit;
        child.forca *= scaleFactor;
        child.agilidade *= scaleFactor;
        child.inteligencia *= scaleFactor;
        child.fit = child.forca + child.agilidade + child.inteligencia;
    }
    
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
    
    // Normalizar se o fitness ultrapassar o máximo de referência
    if (child.fit > referenceFitness) {
        const scaleFactor = referenceFitness / child.fit;
        child.forca *= scaleFactor;
        child.agilidade *= scaleFactor;
        child.inteligencia *= scaleFactor;
        child.fit = child.forca + child.agilidade + child.inteligencia;
    }
    
    return child;
}

function generateOffspring() {
    const offspringOperations = [];
    const newGenerationOffspring = [];

    // Selecionar os dois primeiros pais para demonstrar os tipos de crossover
    const parent1 = populationCrossOver[0];
    const parent2 = populationCrossOver[1];

    // Gerar filhos usando os três tipos de crossover
    const childOnePoint1 = onePointCrossover(parent1, parent2);
    const childOnePoint2 = onePointCrossover(parent2, parent1);
    const childArithmetic = arithmeticCrossover(parent1, parent2);
    const childUniform = uniformCrossover(parent1, parent2);

    // Adicionar os filhos de demonstração com os títulos específicos
    offspringOperations.push({...childOnePoint1, title: "One Point 1"});
    offspringOperations.push({...childOnePoint2, title: "One Point 2"});
    offspringOperations.push({...childArithmetic, title: "Arithmetic"});
    offspringOperations.push({...childUniform, title: "Uniform"});

    // Mostrar os filhos de demonstração na interface
    const offspringOperationsContainer = document.querySelector("#new-generation-cross-over .offspring-operations");
    if (offspringOperationsContainer) {
        offspringOperationsContainer.innerHTML = "";

        // Mostrar os pais
        offspringOperationsContainer.innerHTML += `<div class="monkey-card">
            <img src="img/noun-monkey-7381417.svg" alt="Macaco" />
            <p><strong>Pai 1</strong></p>
            <p>Força: ${parent1.forca.toFixed(2)}</p>
            <p>Agilidade: ${parent1.agilidade.toFixed(2)}</p>
            <p>Inteligência: ${parent1.inteligencia.toFixed(2)}</p>
            <p><strong>Fitness: ${parent1.fit.toFixed(2)}</strong></p>
            <p class="percentage-display">(${getPercentageFitness(parent1.fit)}% do máximo)</p>
        </div>`;
        
        offspringOperationsContainer.innerHTML += `<div class="monkey-card">
            <img src="img/noun-monkey-7381417.svg" alt="Macaco" />
            <p><strong>Pai 2</strong></p>
            <p>Força: ${parent2.forca.toFixed(2)}</p>
            <p>Agilidade: ${parent2.agilidade.toFixed(2)}</p>
            <p>Inteligência: ${parent2.inteligencia.toFixed(2)}</p>
            <p><strong>Fitness: ${parent2.fit.toFixed(2)}</strong></p>
            <p class="percentage-display">(${getPercentageFitness(parent2.fit)}% do máximo)</p>
        </div>`;

        // Mostrar os filhos de demonstração
        offspringOperations.forEach(offspring => {
            offspringOperationsContainer.innerHTML += monkeyCard(offspring, offspring.title);
        });
    }

    // Gerar 5 novos macacos para a Nova Geração de Cross-Over
    for (let i = 0; i < populationSize; i++) {
        // Selecionar aleatoriamente dois pais da população de crossover
        const randomIndex1 = Math.floor(Math.random() * populationCrossOver.length);
        let randomIndex2 = Math.floor(Math.random() * populationCrossOver.length);

        // Garantir que os índices dos pais não sejam iguais
        while (randomIndex2 === randomIndex1) {
            randomIndex2 = Math.floor(Math.random() * populationCrossOver.length);
        }

        const parentA = populationCrossOver[randomIndex1];
        const parentB = populationCrossOver[randomIndex2];

        // Usar um método de crossover aleatório
        const crossoverMethods = [onePointCrossover, arithmeticCrossover, uniformCrossover];
        const randomMethod = crossoverMethods[Math.floor(Math.random() * crossoverMethods.length)];

        const offspring = randomMethod(parentA, parentB);
        newGenerationOffspring.push({...offspring, title: `Macaco ${i + 1}`});
    }

    // Mostrar os 5 novos macacos da nova geração na interface
    const offspringGenerationContainer = document.querySelector("#new-generation-cross-over .offspring-generation");
    if (offspringGenerationContainer) {
        offspringGenerationContainer.innerHTML = "";
        newGenerationOffspring.forEach(offspring => {
            offspringGenerationContainer.innerHTML += monkeyCard(offspring, offspring.title);
        });
    }
}

function generateMutation() {
    const mutationOperations = [];
    const mutationGeneration = [];

    // Demonstrar os três tipos de mutação
    const baseMonkeys = populationCrossOver.slice(0, 3);
    const mutationTypes = ["Mutação Aleatória", "Mutação Pequena", "Mutação Dirigida"];

    // Realizar as operações de mutação para demonstração
    baseMonkeys.forEach((monkey, index) => {
        let mutatedMonkey;
        
        if (mutationTypes[index] === "Mutação Aleatória") {
            // Todos os atributos são alterados aleatoriamente
            mutatedMonkey = {
                forca: monkey.forca + Math.floor(Math.random() * 21) - 10,
                agilidade: monkey.agilidade + Math.floor(Math.random() * 21) - 10,
                inteligencia: monkey.inteligencia + Math.floor(Math.random() * 21) - 10,
            };
        } else if (mutationTypes[index] === "Mutação Pequena") {
            // Alteração menor em todos os atributos
            mutatedMonkey = {
                forca: monkey.forca + Math.floor(Math.random() * 11) - 5,
                agilidade: monkey.agilidade + Math.floor(Math.random() * 11) - 5,
                inteligencia: monkey.inteligencia + Math.floor(Math.random() * 11) - 5,
            };
        } else { // Mutação Dirigida
            // Altera apenas um atributo
            mutatedMonkey = { ...monkey };
            const attribute = ["forca", "agilidade", "inteligencia"][Math.floor(Math.random() * 3)];
            mutatedMonkey[attribute] += Math.floor(Math.random() * 21) - 10;
        }
        
        // Garantir valores dentro do intervalo válido
        mutatedMonkey.forca = Math.max(0, Math.min(100, mutatedMonkey.forca));
        mutatedMonkey.agilidade = Math.max(0, Math.min(100, mutatedMonkey.agilidade));
        mutatedMonkey.inteligencia = Math.max(0, Math.min(100, mutatedMonkey.inteligencia));

        mutatedMonkey.fit = mutatedMonkey.forca + mutatedMonkey.agilidade + mutatedMonkey.inteligencia;
        
        // Normalizar se o fitness ultrapassar o máximo de referência
        if (mutatedMonkey.fit > referenceFitness) {
            const scaleFactor = referenceFitness / mutatedMonkey.fit;
            mutatedMonkey.forca *= scaleFactor;
            mutatedMonkey.agilidade *= scaleFactor;
            mutatedMonkey.inteligencia *= scaleFactor;
            mutatedMonkey.fit = mutatedMonkey.forca + mutatedMonkey.agilidade + mutatedMonkey.inteligencia;
        }
        
        mutationOperations.push({
            original: monkey,
            mutated: mutatedMonkey,
            title: mutationTypes[index]
        });
    });

    // Mostrar as operações de mutação na interface
    const mutationOperationsContainer = document.querySelector("#new-generation-mutacao .mutation-operations");
    if (mutationOperationsContainer) {
        mutationOperationsContainer.innerHTML = "";
        
        // Para cada tipo de mutação, mostrar o original e o mutado
        mutationOperations.forEach(op => {
            mutationOperationsContainer.innerHTML += `
                <div class="mutation-pair">
                    <div class="original">
                        ${monkeyCard(op.original, "Original")}
                    </div>
                    <div class="arrow">➔</div>
                    <div class="mutated">
                        ${monkeyCard(op.mutated, op.title)}
                    </div>
                </div>
            `;
        });
    }

    // Gerar 5 novos macacos com mutações para a nova geração
    for (let i = 0; i < populationSize; i++) {
        // Selecionar um macaco aleatório da população de crossover
        const randomIndex = Math.floor(Math.random() * populationCrossOver.length);
        const baseMonkey = populationCrossOver[randomIndex];
        
        // Escolher aleatoriamente um tipo de mutação
        const mutationType = mutationTypes[Math.floor(Math.random() * mutationTypes.length)];
        let mutatedMonkey;
        
        if (mutationType === "Mutação Aleatória") {
            mutatedMonkey = {
                forca: baseMonkey.forca + Math.floor(Math.random() * 21) - 10,
                agilidade: baseMonkey.agilidade + Math.floor(Math.random() * 21) - 10,
                inteligencia: baseMonkey.inteligencia + Math.floor(Math.random() * 21) - 10,
            };
        } else if (mutationType === "Mutação Pequena") {
            mutatedMonkey = {
                forca: baseMonkey.forca + Math.floor(Math.random() * 11) - 5,
                agilidade: baseMonkey.agilidade + Math.floor(Math.random() * 11) - 5,
                inteligencia: baseMonkey.inteligencia + Math.floor(Math.random() * 11) - 5,
            };
        } else { // Mutação Dirigida
            mutatedMonkey = { ...baseMonkey };
            const attribute = ["forca", "agilidade", "inteligencia"][Math.floor(Math.random() * 3)];
            mutatedMonkey[attribute] += Math.floor(Math.random() * 21) - 10;
        }
        
        // Garantir valores dentro do intervalo válido
        mutatedMonkey.forca = Math.max(0, Math.min(100, mutatedMonkey.forca));
        mutatedMonkey.agilidade = Math.max(0, Math.min(100, mutatedMonkey.agilidade));
        mutatedMonkey.inteligencia = Math.max(0, Math.min(100, mutatedMonkey.inteligencia));

        mutatedMonkey.fit = mutatedMonkey.forca + mutatedMonkey.agilidade + mutatedMonkey.inteligencia;
        
        // Normalizar se o fitness ultrapassar o máximo de referência
        if (mutatedMonkey.fit > referenceFitness) {
            const scaleFactor = referenceFitness / mutatedMonkey.fit;
            mutatedMonkey.forca *= scaleFactor;
            mutatedMonkey.agilidade *= scaleFactor;
            mutatedMonkey.inteligencia *= scaleFactor;
            mutatedMonkey.fit = mutatedMonkey.forca + mutatedMonkey.agilidade + mutatedMonkey.inteligencia;
        }
        
        mutationGeneration.push({
            ...mutatedMonkey,
            title: `Macaco ${i + 1} (${mutationType})`
        });
    }

    // Mostrar os 5 novos macacos da geração com mutação na interface
    const mutationGenerationContainer = document.querySelector("#new-generation-mutacao .mutation-generation");
    if (mutationGenerationContainer) {
        mutationGenerationContainer.innerHTML = "";
        mutationGeneration.forEach(monkey => {
            mutationGenerationContainer.innerHTML += monkeyCard(monkey, monkey.title);
        });
    }
}

// Inicializar quando a página carregar
window.onload = function() {
    // Esconder tudo no início
    hideAllSections();
    
    document.getElementById("generateBtn").addEventListener("click", generatePopulation);
    document.getElementById("spinBtn").addEventListener("click", () => animateRoulette());
    document.getElementById("offspringBtn").addEventListener("click", generateOffspring);
    document.getElementById("mutateBtn").addEventListener("click", generateMutation);
    
    // Não gerar população automaticamente no início
    // generatePopulation();
};
