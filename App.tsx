import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { GameStatus, SymbolDef } from './types';
import { SYMBOLS, REEL_COUNT, SPIN_DURATION_BASE, SPIN_DELAY_PER_REEL } from './constants';
import Reel from './components/Reel';

const App: React.FC = () => {
  const defaultSymbol = SYMBOLS[SYMBOLS.length - 1];
  
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [reels, setReels] = useState<SymbolDef[]>(Array(REEL_COUNT).fill(defaultSymbol));
  const [spinningStates, setSpinningStates] = useState<boolean[]>(Array(REEL_COUNT).fill(false));
  const [isWinningAnim, setIsWinningAnim] = useState(false);
  
  const resultsRef = useRef<SymbolDef[]>(Array(REEL_COUNT).fill(defaultSymbol));
  const timeoutsRef = useRef<number[]>([]);
  const victoryTimeoutRef = useRef<number | null>(null);

  const totalWeight = useMemo(() => SYMBOLS.reduce((acc, s) => acc + s.weight, 0), []);

  const getRandomSymbol = useCallback(() => {
    let random = Math.random() * totalWeight;
    for (const symbol of SYMBOLS) {
      if (random < symbol.weight) return symbol;
      random -= symbol.weight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
  }, [totalWeight]);

  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (victoryTimeoutRef.current) {
      clearTimeout(victoryTimeoutRef.current);
      victoryTimeoutRef.current = null;
    }
  }, []);

  const checkWin = (results: SymbolDef[]) => {
    const isWin = results.every(s => s.name === results[0].name);
    if (isWin) {
      setStatus(GameStatus.WINNING);
      setIsWinningAnim(true);
      
      victoryTimeoutRef.current = window.setTimeout(() => {
        setStatus(GameStatus.IDLE);
        setIsWinningAnim(false);
        victoryTimeoutRef.current = null;
      }, 3000);
    } else {
      setStatus(GameStatus.IDLE);
    }
  };

  const handleSpin = useCallback(() => {
    // CRITICAL: Block interaction if already in a win sequence
    if (status === GameStatus.WINNING || isWinningAnim) {
      return;
    }

    if (status === GameStatus.SPINNING) {
      clearAllTimers();
      setSpinningStates([false, false, false]);
      checkWin(resultsRef.current);
      return;
    }

    setStatus(GameStatus.SPINNING);
    setIsWinningAnim(false);

    const nextResults = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    resultsRef.current = nextResults;
    setReels(nextResults);
    setSpinningStates([true, true, true]);
    
    const schedule = [
      SPIN_DURATION_BASE,
      SPIN_DURATION_BASE + SPIN_DELAY_PER_REEL,
      SPIN_DURATION_BASE + SPIN_DELAY_PER_REEL * 2
    ];

    timeoutsRef.current = schedule.map((delay, i) => {
      return window.setTimeout(() => {
        setSpinningStates(prev => {
          const next = [...prev];
          next[i] = false;
          return next;
        });

        if (i === REEL_COUNT - 1) {
          checkWin(nextResults);
          timeoutsRef.current = [];
        }
      }, delay);
    });

  }, [status, isWinningAnim, getRandomSymbol, clearAllTimers]);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  return (
    <div className={`h-screen w-screen flex flex-col items-center bg-white transition-colors duration-500 relative overflow-hidden ${isWinningAnim ? 'is-winning-anim' : ''}`}>
      
      <header className="flex flex-col items-center justify-center z-20 text-center pt-8 md:pt-16 pb-4">
        <div className="inline-flex flex-col items-end">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-black select-none rainbow-text">
            Minima Slots
          </h1>
          <span className="text-sm md:text-xl font-medium text-black opacity-60 tracking-widest mt-0.5 md:mt-1 rainbow-text">
            by Dushkov
          </span>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center -translate-y-16 md:-translate-y-24 z-10 px-4">
        
        <div className="w-full max-w-sm md:max-w-md mb-20 md:mb-32">
          <div className="flex gap-2 md:gap-3 w-full p-3 md:p-5 rounded-[2.5rem] bg-white border-[3px] border-black rainbow-border shadow-sm">
            {reels.map((symbol, i) => (
              <Reel 
                key={i}
                index={i}
                isSpinning={spinningStates[i]}
                targetSymbol={symbol}
                isWinning={isWinningAnim}
              />
            ))}
          </div>
        </div>

        <div className="z-20">
          <button
            onClick={handleSpin}
            className={`w-40 md:w-48 h-12 md:h-14 py-2.5 text-base font-bold border-[3px] border-black rounded-full transition-all bg-white text-black hover:bg-black hover:text-white cursor-pointer active:scale-95 rainbow-border flex items-center justify-center relative overflow-hidden ${
              (status === GameStatus.WINNING || isWinningAnim) ? 'locked' : ''
            }`}
          >
            <span className={`spin-button-content rainbow-text select-none`}>
              SPIN
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;