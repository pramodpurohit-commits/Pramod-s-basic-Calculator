
export interface Calculation {
  equation: string;
  result: string;
  timestamp: number;
}

export type Operation = '+' | '-' | '*' | '/' | null;
