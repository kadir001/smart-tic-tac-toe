import React, { useState, useEffect } from "react";

const initialBoard = Array(9).fill(null);

const checkWinner = (board) => {
  const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let [a, b, c] of winLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }
  if (board.every(cell => cell)) return "draw";
  return null;
};

const bestMove = (board, isMaximizing) => {
  const winner = checkWinner(board);
  if (winner === "O") return { score: 1 };
  if (winner === "X") return { score: -1 };
  if (winner === "draw") return { score: 0 };

  let best = isMaximizing ? { score: -Infinity } : { score: Infinity };
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = isMaximizing ? "O" : "X";
      const result = bestMove(board, !isMaximizing);
      board[i] = null;
      result.index = i;
      if (isMaximizing) {
        if (result.score > best.score) best = result;
      } else {
        if (result.score < best.score) best = result;
      }
    }
  }
  return best;
};

export default function App() {
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const winner = checkWinner(board);

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const move = bestMove([...board], true);
      setTimeout(() => {
        setBoard(prev => {
          const copy = [...prev];
          copy[move.index] = "O";
          return copy;
        });
        setIsPlayerTurn(true);
      }, 400);
    }
  }, [isPlayerTurn]);

  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsPlayerTurn(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="w-[320px]">
        <h1 className="text-3xl font-bold text-center mb-6">Tic Tac Toe</h1>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {board.map((cell, i) => (
            <div
              key={i}
              onClick={() => handleClick(i)}
              className="aspect-square bg-gray-700 hover:bg-gray-600 transition-all duration-200 flex items-center justify-center text-3xl font-bold rounded-xl shadow-inner"
            >
              {cell === "X" && <span className="text-blue-400">X</span>}
              {cell === "O" && <span className="text-red-400">O</span>}
            </div>
          ))}
        </div>
        {winner && (
          <div className="text-center mb-4">
            {winner === "draw" ? (
              <p className="text-yellow-400">It’s a draw!</p>
            ) : (
              <p className="text-green-400 font-bold">{winner} wins!</p>
            )}
          </div>
        )}
        <button
          onClick={resetGame}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}
