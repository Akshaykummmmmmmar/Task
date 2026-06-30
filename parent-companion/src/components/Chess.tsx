"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

type PieceColor = "white" | "black";
type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type Board = (Piece | null)[][];

const PIECE_SYMBOLS: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: "\u2654",
    queen: "\u2655",
    rook: "\u2656",
    bishop: "\u2657",
    knight: "\u2658",
    pawn: "\u2659",
  },
  black: {
    king: "\u265A",
    queen: "\u265B",
    rook: "\u265C",
    bishop: "\u265D",
    knight: "\u265E",
    pawn: "\u265F",
  },
};

const PIECE_ORDER: PieceType[] = [
  "queen",
  "rook",
  "bishop",
  "knight",
  "pawn",
];

function createInitialBoard(): Board {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const backRow: PieceType[] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];
  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: backRow[c], color: "black" };
    board[1][c] = { type: "pawn", color: "black" };
    board[6][c] = { type: "pawn", color: "white" };
    board[7][c] = { type: backRow[c], color: "white" };
  }
  return board;
}

function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

function findKing(board: Board, color: PieceColor): [number, number] | null {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c]?.type === "king" && board[r][c]?.color === color)
        return [r, c];
  return null;
}

function isInBounds(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getRawMoves(board: Board, r: number, c: number): [number, number][] {
  const piece = board[r][c];
  if (!piece) return [];
  const moves: [number, number][] = [];
  const { type, color } = piece;
  const canMove = (tr: number, tc: number) => {
    if (!isInBounds(tr, tc)) return false;
    const t = board[tr][tc];
    return !t || t.color !== color;
  };
  const slide = (dirs: [number, number][]) => {
    for (const [dr, dc] of dirs) {
      let nr = r + dr, nc = c + dc;
      while (isInBounds(nr, nc)) {
        const t = board[nr][nc];
        if (t) {
          if (t.color !== color) moves.push([nr, nc]);
          break;
        }
        moves.push([nr, nc]);
        nr += dr;
        nc += dc;
      }
    }
  };
  switch (type) {
    case "pawn": {
      const dir = color === "white" ? -1 : 1;
      const startRow = color === "white" ? 6 : 1;
      if (isInBounds(r + dir, c) && !board[r + dir][c]) {
        moves.push([r + dir, c]);
        if (r === startRow && !board[r + 2 * dir][c])
          moves.push([r + 2 * dir, c]);
      }
      for (const dc of [-1, 1]) {
        const nr = r + dir, nc = c + dc;
        if (
          isInBounds(nr, nc) &&
          board[nr][nc] &&
          board[nr][nc]!.color !== color
        )
          moves.push([nr, nc]);
      }
      break;
    }
    case "knight":
      for (const [dr, dc] of [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ] as [number, number][])
        if (canMove(r + dr, c + dc)) moves.push([r + dr, c + dc]);
      break;
    case "bishop":
      slide([
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]);
      break;
    case "rook":
      slide([
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]);
      break;
    case "queen":
      slide([
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]);
      break;
    case "king":
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dr !== 0 || dc !== 0)
            if (canMove(r + dr, c + dc)) moves.push([r + dr, c + dc]);
      break;
  }
  return moves;
}

function isInCheck(board: Board, color: PieceColor): boolean {
  const king = findKing(board, color);
  if (!king) return false;
  const opp: PieceColor = color === "white" ? "black" : "white";
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c]?.color === opp)
        for (const [mr, mc] of getRawMoves(board, r, c))
          if (mr === king[0] && mc === king[1]) return true;
  return false;
}

function getLegalMoves(
  board: Board,
  r: number,
  c: number
): [number, number][] {
  const piece = board[r][c];
  if (!piece) return [];
  return getRawMoves(board, r, c).filter(([tr, tc]) => {
    const nb = cloneBoard(board);
    nb[tr][tc] = nb[r][c];
    nb[r][c] = null;
    return !isInCheck(nb, piece.color);
  });
}

function hasLegalMoves(board: Board, color: PieceColor): boolean {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (
        board[r][c]?.color === color &&
        getLegalMoves(board, r, c).length > 0
      )
        return true;
  return false;
}

function renderPiece(piece: Piece) {
  return PIECE_SYMBOLS[piece.color][piece.type];
}

export function Chess() {
  const [board, setBoard] = useState<Board>(createInitialBoard);
  const [turn, setTurn] = useState<PieceColor>("white");
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [whiteCaptured, setWhiteCaptured] = useState<Piece[]>([]);
  const [blackCaptured, setBlackCaptured] = useState<Piece[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const legalMoves = useMemo(() => {
    if (!selected) return [];
    return getLegalMoves(board, selected[0], selected[1]);
  }, [board, selected]);

  const kingInCheck = useMemo(() => {
    if (!isInCheck(board, turn)) return null;
    return findKing(board, turn);
  }, [board, turn]);

  function handleCellClick(r: number, c: number) {
    if (gameOver) return;

    const piece = board[r][c];

    if (piece && piece.color === turn) {
      setSelected([r, c]);
      return;
    }

    if (selected) {
      const isLegal = legalMoves.some(([mr, mc]) => mr === r && mc === c);
      if (isLegal) {
        const newBoard = cloneBoard(board);
        const captured = newBoard[r][c];
        newBoard[r][c] = newBoard[selected[0]][selected[1]];
        newBoard[selected[0]][selected[1]] = null;

        const moved = newBoard[r][c]!;

        if (moved.type === "pawn" && (r === 0 || r === 7)) {
          newBoard[r][c] = { type: "queen", color: moved.color };
        }

        if (captured) {
          if (captured.color === "white")
            setWhiteCaptured((prev) => [...prev, captured]);
          else setBlackCaptured((prev) => [...prev, captured]);
        }

        setBoard(newBoard);

        const nextTurn: PieceColor = turn === "white" ? "black" : "white";
        const nextInCheck = isInCheck(newBoard, nextTurn);
        const nextHasMoves = hasLegalMoves(newBoard, nextTurn);

        if (!nextHasMoves) {
          setGameOver(true);
          if (nextInCheck) {
            setStatusMessage(
              `${nextTurn === "white" ? "Black" : "White"} wins by checkmate!`
            );
          } else {
            setStatusMessage("Stalemate!");
          }
        } else if (nextInCheck) {
          setStatusMessage("Check!");
        } else {
          setStatusMessage("");
        }

        setTurn(nextTurn);
        setSelected(null);
        return;
      }
    }

    setSelected(null);
  }

  const newGame = useCallback(() => {
    setBoard(createInitialBoard());
    setTurn("white");
    setSelected(null);
    setWhiteCaptured([]);
    setBlackCaptured([]);
    setGameOver(false);
    setStatusMessage("");
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "h-3 w-3 rounded-full border border-stone-400",
              turn === "white" ? "bg-white" : "bg-stone-800"
            )}
          />
          <span className="text-sm font-medium text-stone-600">
            {turn === "white" ? "White" : "Black"}&#39;s turn
          </span>
        </div>
        {statusMessage && (
          <span
            className={cn(
              "rounded-full px-3 py-0.5 text-xs font-medium",
              statusMessage.includes("wins")
                ? "bg-sage-100 text-sage-700"
                : statusMessage.includes("Stalemate")
                  ? "bg-sand-100 text-sand-700"
                  : "bg-sun-100 text-sun-700"
            )}
          >
            {statusMessage}
          </span>
        )}
      </div>

      <div className="grid grid-cols-8 overflow-hidden rounded-lg border-2 border-stone-400 shadow-md">
        {board.map((row, r) =>
          row.map((piece, c) => {
            const isLight = (r + c) % 2 === 0;
            const isSel =
              selected?.[0] === r && selected?.[1] === c;
            const isLegal = legalMoves.some(
              ([mr, mc]) => mr === r && mc === c
            );
            const isCheck =
              kingInCheck?.[0] === r && kingInCheck?.[1] === c;
            const isCapture = isLegal && board[r][c] !== null;

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center text-lg transition-colors sm:h-12 sm:w-12 sm:text-xl",
                  isLight ? "bg-amber-50" : "bg-amber-800",
                  isSel && "ring-2 ring-coral-400 ring-inset z-10",
                  isLegal && !isCapture && "!bg-sky-200/60",
                  isLegal && isCapture && "!bg-red-300/60",
                  isCheck && "!bg-red-400/80"
                )}
                aria-label={`${String.fromCharCode(97 + c)}${8 - r}`}
              >
                {piece && (
                  <span
                    className={cn(
                      "drop-shadow-sm",
                      piece.color === "white"
                        ? "text-white [text-shadow:_0_1px_2px_rgba(0,0,0,0.4)]"
                        : "text-stone-900"
                    )}
                  >
                    {renderPiece(piece)}
                  </span>
                )}
                {isLegal && !piece && (
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400/40" />
                )}
              </button>
            );
          })
        )}
      </div>

      {blackCaptured.length > 0 && (
        <div className="flex flex-wrap items-center gap-0.5">
          <span className="mr-1 text-xs text-stone-400">Captured: </span>
          {blackCaptured.map((p, i) => (
            <span key={i} className="text-sm text-stone-700">
              {renderPiece(p)}
            </span>
          ))}
        </div>
      )}

      {whiteCaptured.length > 0 && (
        <div className="flex flex-wrap items-center gap-0.5">
          <span className="mr-1 text-xs text-stone-400">Captured: </span>
          {whiteCaptured.map((p, i) => (
            <span key={i} className="text-sm text-stone-700">
              {renderPiece(p)}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={newGame}
        className="focus-ring rounded-full border-2 border-coral-300 px-5 py-1.5 text-sm font-medium text-coral-700 transition-all hover:bg-coral-100"
      >
        New Game
      </button>
    </div>
  );
}
