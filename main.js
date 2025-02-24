import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const getRandomValue = () => Math.floor(Math.random() * 100) + 1;

const AttributeCounter = ({ label, value }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold">{label}</span>
      <motion.div
        className="text-4xl font-bold text-blue-500"
        animate={{ opacity: [0, 1], scale: [0.8, 1] }}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.div>
    </div>
  );
};

export default function AttributeRandomizer() {
  const [attributes, setAttributes] = useState({
    Força: 0,
    Agilidade: 0,
    Inteligência: 0,
  });

  const rollAttributes = () => {
    let iterations = 10;
    let counter = 0;
    const interval = setInterval(() => {
      setAttributes({
        Força: getRandomValue(),
        Agilidade: getRandomValue(),
        Inteligência: getRandomValue(),
      });
      counter++;
      if (counter >= iterations) clearInterval(interval);
    }, 100);
  };

  // Função de crossover: combina atributos de dois macacos
  const crossover = (parent1, parent2) => {
    return {
      Força: Math.round((parent1.Força + parent2.Força) / 2),
      Agilidade: Math.round((parent1.Agilidade + parent2.Agilidade) / 2),
      Inteligência: Math.round((parent1.Inteligência + parent2.Inteligência) / 2),
    };
  };

  // Função de mutação: altera um atributo aleatoriamente
  const mutate = (monkey) => {
    const attributes = ["Força", "Agilidade", "Inteligência"];
    const attributeToMutate = attributes[Math.floor(Math.random() * attributes.length)];
    return { ...monkey, [attributeToMutate]: getRandomValue() };
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-6">
      <h1 className="text-2xl font-bold">Sorteio de Atributos</h1>
      <div className="grid grid-cols-3 gap-6">
        {Object.entries(attributes).map(([key, value]) => (
          <AttributeCounter key={key} label={key} value={value} />
        ))}
      </div>
      <Button onClick={rollAttributes} className="p-2 bg-blue-500 text-white rounded-lg">
        Sortear Atributos
      </Button>
    </div>
  );
}
