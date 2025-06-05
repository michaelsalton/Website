'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Simulation {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType;
}

interface Props {
  simulations: Simulation[];
  onSelect: (simulation: Simulation) => void;
  currentSimulation: Simulation;
}

export default function SimulationSelector({ simulations, onSelect, currentSimulation }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-theme-mid/20 backdrop-blur-sm text-theme-light px-4 py-2 rounded-lg border border-theme-mid/30 hover:bg-theme-mid/30 transition-colors"
      >
        {currentSimulation.name}
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 mt-2 w-[600px] bg-theme-darker/80 backdrop-blur-sm rounded-lg border border-theme-mid/30 overflow-hidden"
        >
          <div className="grid grid-cols-3 gap-2 p-2">
            {simulations.map((sim) => (
              <motion.button
                key={sim.id}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                onClick={() => {
                  onSelect(sim);
                  setIsOpen(false);
                }}
                className={`text-left p-3 rounded-lg transition-colors ${
                  sim.id === currentSimulation.id ? 'text-theme-light bg-theme-mid/20' : 'text-theme-mid'
                }`}
              >
                <div className="font-medium">{sim.name}</div>
                <div className="text-sm text-theme-mid/70">{sim.description}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
} 