# Algoritmo Genético para Simulação de Evolução de Macacos

## Visão Geral

Este projeto implementa uma simulação visual de algoritmo genético para demonstrar o processo evolutivo de uma população de macacos. A aplicação web permite aos usuários observar e interagir com diferentes etapas do processo evolutivo, incluindo seleção natural, recombinação genética (crossover) e mutação.

## Funcionalidades

### 1. Geração da População Inicial
- A simulação começa com a criação de uma população inicial de macacos com características genéticas aleatórias
- Cada macaco possui um conjunto único de genes que determinam suas características
- Os usuários podem iniciar o processo clicando no botão "Gerar População"

### 2. Seleção Natural
- Implementada através de um sistema de roleta, onde indivíduos mais adaptados têm maior probabilidade de serem selecionados
- A roleta é visualizada em um elemento canvas, proporcionando uma experiência interativa
- Os usuários podem girar a roleta para selecionar indivíduos que passarão seus genes para a próxima geração

### 3. Recombinação Genética (Crossover)
- Os indivíduos selecionados formam pares para reprodução
- O algoritmo realiza a recombinação do material genético entre dois indivíduos
- Uma nova geração é criada a partir deste processo de crossover
- Os usuários podem visualizar a nova geração resultante do crossover

### 4. Mutação
- Introduz variações aleatórias no material genético da população
- Simula eventos evolutivos onde características podem mudar subitamente
- Contribui para a diversidade genética da população
- Os usuários podem observar os efeitos da mutação nos indivíduos da nova geração

## Estrutura do Projeto

### Arquivos Principais
- **index.html**: Estrutura da interface do usuário com seções para cada etapa do processo evolutivo
- **style.css**: Estilos para visualização dos macacos e componentes da interface
- **main.js**: Implementação da lógica do algoritmo genético e interatividade da interface

### Interface do Usuário
- Interface dividida em seções sequenciais que se tornam visíveis conforme o progresso da simulação
- Botões de controle para cada etapa do processo evolutivo
- Visualização clara da população em cada geração
- Roleta interativa para a fase de seleção

## Como Usar

1. Abra a aplicação em um navegador web
2. Clique em "Gerar População" para criar a população inicial de macacos
3. Quando a seção de seleção aparecer, clique em "Girar Roleta" para selecionar indivíduos
4. Observe os indivíduos selecionados e clique em "Gerar Nova Geração" para realizar o crossover
5. Após a geração do crossover, clique em "Gerar Mutação" para introduzir mutações genéticas
6. Compare as diferentes gerações para observar o processo evolutivo

## Conceitos Técnicos Implementados

### Representação Genética
- Cada macaco é representado por uma sequência de genes
- Os genes determinam características como tamanho, cor, força, etc.
- A codificação genética permite a herança de características entre gerações

### Método de Seleção por Roleta
- Indivíduos são selecionados com probabilidade proporcional à sua aptidão
- A roleta visual demonstra de forma clara como a seleção natural favorece características mais adaptadas
- Implementação baseada em canvas para uma experiência interativa

### Algoritmo de Crossover
- Implementa troca de informação genética entre dois indivíduos
- Utiliza pontos de corte para determinar quais genes serão trocados
- Simula o processo natural de recombinação genética durante a reprodução

### Mecanismo de Mutação
- Altera aleatoriamente genes específicos na população
- A taxa de mutação é controlada para simular eventos evolutivos realistas
- Contribui para a exploração de novas características que podem beneficiar a espécie

## Objetivo Educacional

Esta simulação serve como uma ferramenta educacional para demonstrar:
- Princípios fundamentais da evolução biológica
- Funcionamento de algoritmos genéticos
- Conceitos de seleção natural, recombinação genética e mutação
- Como características favoráveis tendem a se propagar em uma população ao longo do tempo

## Requisitos Técnicos
- Navegador web moderno com suporte a JavaScript e HTML5 Canvas
- Não são necessárias bibliotecas externas, pois o projeto utiliza JavaScript vanilla

## Possíveis Extensões Futuras
- Adição de parâmetros configuráveis (tamanho da população, taxa de mutação, etc.)
- Implementação de diferentes métodos de seleção
- Visualização gráfica da evolução da aptidão ao longo das gerações
- Inclusão de ambientes com diferentes pressões seletivas
