
import React from 'react';
import type { SquareValue } from '../types';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinning: boolean;
}

export const Square: React.FC<SquareProps> = ({ value, onClick, isWinning }) => {
  const valueClass = value === 'X' ? 'text-accent-x' : 'text-accent-o';
  const winningClass = isWinning ? 'bg-yellow-500 bg-opacity-40' : '';
  
  return (
    <button
      className={`w-24 h-24 sm:w-28 sm:h-28 bg-primary rounded-lg flex items-center justify-center text-5xl sm:text-6xl font-bold transition-colors duration-200 ease-in-out hover:bg-gray-700 ${valueClass} ${winningClass}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};
