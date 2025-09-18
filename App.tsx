
import React, { useState, useEffect, useCallback } from 'react';
import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { GameModeSelector } from './components/GameModeSelector';
import type { SquareValue, GameMode } from './types';
import { getAiMove } from './services/geminiService';

const calculateWinner = (squares: SquareValue[]): { winner: 'X' | 'O' | null, line: number[] | null } => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
};

const App: React.FC = () => {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<GameMode>('human');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { winner, line: winningLine } = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);

  const handleAiMove = useCallback(async (currentBoard: SquareValue[]) => {
    setIsAiThinking(true);
    setError(null);
    try {
      const move = await getAiMove(currentBoard);
      if (currentBoard[move] === null) {
        const newBoard = [...currentBoard];
        newBoard[move] = 'O';
        setBoard(newBoard);
        setXIsNext(true);
      } else {
        // Fallback if AI returns an invalid move
        console.error("AI chose an occupied square. Choosing a random available one.");
        const availableMoves = currentBoard.map((sq, i) => sq === null ? i : -1).filter(i => i !== -1);
        if(availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            const newBoard = [...currentBoard];
            newBoard[randomMove] = 'O';
            setBoard(newBoard);
            setXIsNext(true);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Gemini AI failed to make a move. Please check your API key or try again.');
    } finally {
      setIsAiThinking(false);
    }
  }, []);

  useEffect(() => {
    if (gameMode === 'ai' && !xIsNext && !winner && !isDraw) {
      // Add a small delay for better UX
      const timer = setTimeout(() => handleAiMove(board), 500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xIsNext, gameMode, winner, isDraw, board]);


  const handleClick = (i: number) => {
    if (winner || board[i] || (gameMode === 'ai' && !xIsNext)) {
      return;
    }
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setIsAiThinking(false);
    setError(null);
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    handleRestart();
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4 font-sans">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent-x to-accent-o">
          Gemini Tic-Tac-Toe
        </h1>
        <p className="text-gray-400 mb-6">Play against a friend or a Gemini-powered AI</p>
      </div>

      <main className="bg-secondary p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <GameModeSelector selectedMode={gameMode} onSelectMode={handleGameModeChange} />
        <div className="relative">
          <Board squares={board} onClick={handleClick} winningLine={winningLine}/>
          {isAiThinking && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-lg font-semibold animate-pulse">Gemini is thinking...</div>
            </div>
          )}
        </div>
        <GameInfo 
          winner={winner} 
          isDraw={isDraw}
          xIsNext={xIsNext}
          onRestart={handleRestart} 
        />
        {error && (
          <div className="mt-4 p-3 bg-red-800 border border-red-600 text-red-200 rounded-lg text-center">
            {error}
          </div>
        )}
      </main>
      <footer className="mt-8 text-gray-500 text-sm">
        Built with React, Tailwind CSS, and the Google Gemini API.
      </footer>
    </div>
  );
};

export default App;
