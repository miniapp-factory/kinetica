'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Share } from '@/components/share';
import { url } from '@/lib/metadata';

const fruits = ['apple', 'banana', 'cherry', 'lemon'] as const;
type Fruit = typeof fruits[number];

const getRandomFruit = (): Fruit => fruits[Math.floor(Math.random() * fruits.length)];

const initialGrid = Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit));

export function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(initialGrid);
  const [isSpinning, setIsSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    intervalRef.current = setInterval(() => {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]); // copy
        // shift rows down
        for (let r = 2; r > 0; r--) {
          newGrid[r] = newGrid[r - 1];
        }
        // new top row
        newGrid[0] = Array.from({ length: 3 }, getRandomFruit);
        return newGrid;
      });
    }, 200);
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsSpinning(false);
    }, 2000);
  };

  const isWin = !isSpinning && (
    // rows
    (grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2]) ||
    (grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2]) ||
    (grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2]) ||
    // columns
    (grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0]) ||
    (grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1]) ||
    (grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2])
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={`/${fruit}.png`}
            alt={fruit}
            width={64}
            height={64}
            className="rounded-md"
          />
        ))}
      </div>
      <Button onClick={spin} disabled={isSpinning} variant="outline">
        {isSpinning ? 'Spinning...' : 'Spin'}
      </Button>
      {isWin && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-semibold">You win!</span>
          <Share text={`I just won a fruit combo on the slot machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
