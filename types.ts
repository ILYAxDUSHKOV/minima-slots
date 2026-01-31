
export enum GameStatus {
  IDLE = 'IDLE',
  SPINNING = 'SPINNING',
  WINNING = 'WINNING'
}

export interface SymbolDef {
  char: string;
  name: string;
  weight: number;
  rarity: number; // 1-10 (10 is most rare/jackpot)
}

export interface WinAnimationProps {
  symbol: SymbolDef;
  onComplete: () => void;
}
