import React, { useState, useEffect } from 'react';
import { SymbolDef } from '../types';
import { SYMBOLS } from '../constants';

interface ReelProps {
  index: number;
  isSpinning: boolean;
  targetSymbol: SymbolDef;
  isWinning: boolean;
}

const Reel: React.FC<ReelProps> = ({ isSpinning, targetSymbol, isWinning }) => {
  const [displayPath, setDisplayPath] = useState(targetSymbol?.char || SYMBOLS[SYMBOLS.length - 1].char);

  useEffect(() => {
    let interval: number;

    if (isSpinning) {
      interval = window.setInterval(() => {
        const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        setDisplayPath(randomSymbol.char);
      }, 70);
    } else if (targetSymbol) {
      setDisplayPath(targetSymbol.char);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpinning, targetSymbol]);

  return (
    <div className={`flex-1 aspect-square flex items-center justify-center border-[3px] border-black bg-white rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden rainbow-border`}>
      <div className={`slot-cell transition-all duration-300 ${isSpinning ? 'animate-jitter opacity-50 scale-90' : 'scale-100'}`}>
        <svg viewBox="0 0 100 100" className="icon-svg rainbow-stroke">
          <path d={displayPath} />
        </svg>
      </div>
      {isSpinning && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/[0.01] via-transparent to-black/[0.01] pointer-events-none" />
      )}
    </div>
  );
};

export default Reel;