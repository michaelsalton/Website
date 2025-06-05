'use client';

import { useState } from 'react';

export default function SimulationsGrid() {
  const [showSimulations, setShowSimulations] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={() => setShowSimulations(!showSimulations)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {showSimulations ? 'Hide Simulations' : 'Show Simulations'}
        </button>
      </div>
      
      {showSimulations && (
        <div className="grid grid-cols-3 gap-8">
          {/* Add your remaining simulations here */}
        </div>
      )}
    </div>
  );
} 