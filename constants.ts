
import { SymbolDef } from './types';

export const SYMBOLS: SymbolDef[] = [
  { char: 'M50 5 L63 38 L98 38 L70 59 L81 91 L50 70 L19 91 L30 59 L2 38 L37 38 Z', name: 'Star', weight: 1, rarity: 10 },
  { char: 'M60 5 L20 55 H45 L35 95 L75 40 H50 Z', name: 'Lightning', weight: 3, rarity: 9 },
  { char: 'M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z', name: 'Hexagon', weight: 12, rarity: 6 },
  { char: 'M50 10 L90 50 L50 90 L10 50 Z', name: 'Diamond', weight: 18, rarity: 5 },
  { char: 'M50 10 L90 90 L10 90 Z', name: 'Triangle', weight: 25, rarity: 4 },
  { char: 'M35 10 H65 V35 H90 V65 H65 V90 H35 V65 H10 V35 H35 Z', name: 'Cross', weight: 35, rarity: 3 },
  { char: 'M10 10 H90 V90 H10 Z', name: 'Square', weight: 45, rarity: 2 },
  { char: 'M50 10 A40 40 0 1 0 50 90 A40 40 0 1 0 50 10 Z', name: 'Circle', weight: 60, rarity: 1 },
];

export const REEL_COUNT = 3;
export const SPIN_DURATION_BASE = 1200;
export const SPIN_DELAY_PER_REEL = 600;
