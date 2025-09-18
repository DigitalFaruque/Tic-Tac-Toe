
import React from 'react';
import type { GameMode } from '../types';

interface GameModeSelectorProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({ selectedMode, onSelectMode }) => {
  const baseClasses = "w-1/2 py-2.5 text-sm font-medium leading-5 rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 transition-all";
  const activeClasses = "bg-white shadow text-blue-700";
  const inactiveClasses = "text-blue-100 hover:bg-white/[0.12] hover:text-white";

  return (
    <div className="w-full max-w-md px-2 py-4 sm:px-0">
      <div className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
        <button
          onClick={() => onSelectMode('human')}
          className={`${baseClasses} ${selectedMode === 'human' ? activeClasses : inactiveClasses}`}
        >
          Player vs Player
        </button>
        <button
          onClick={() => onSelectMode('ai')}
          className={`${baseClasses} ${selectedMode === 'ai' ? activeClasses : inactiveClasses}`}
        >
          Player vs Gemini AI
        </button>
      </div>
    </div>
  );
};
