
import React from 'react';

interface GameInfoProps {
  winner: 'X' | 'O' | null;
  isDraw: boolean;
  xIsNext: boolean;
  onRestart: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({ winner, isDraw, xIsNext, onRestart }) => {
  let status;
  if (winner) {
    status = `Winner: `;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: `;
  }

  const PlayerIndicator: React.FC<{player: 'X' | 'O'}> = ({player}) => (
    <span className={`font-bold ${player === 'X' ? 'text-accent-x' : 'text-accent-o'}`}>{player}</span>
  );

  return (
    <div className="mt-6 text-center">
      <div className="text-2xl mb-4 text-gray-300 h-8">
        {status}
        {!isDraw && (
            winner ? <PlayerIndicator player={winner} /> : <PlayerIndicator player={xIsNext ? 'X' : 'O'} />
        )}
      </div>
      <button
        onClick={onRestart}
        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-200"
      >
        Restart Game
      </button>
    </div>
  );
};
