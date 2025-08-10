import { Injectable, signal } from '@angular/core';

export interface Tile {
  value: number;
  row: number;
  col: number;
  prevRow?: number;
  prevCol?: number;
  isNew?: boolean;
  isMerged?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Game board size (4x4 for standard 2048)
  private readonly boardSize = 4;

  // Game state signals
  public board = signal<Tile[][]>([]);
  public score = signal<number>(0);
  public gameOver = signal<boolean>(false);
  public gameWon = signal<boolean>(false);

  constructor() { }

  /**
   * Initialize a new game
   */
  initGame(): void {
    // Create empty board
    const newBoard: Tile[][] = [];
    for (let row = 0; row < this.boardSize; row++) {
      newBoard[row] = [];
      for (let col = 0; col < this.boardSize; col++) {
        newBoard[row][col] = { value: 0, row, col };
      }
    }

    // Set initial state
    this.board.set(newBoard);
    this.score.set(0);
    this.gameOver.set(false);
    this.gameWon.set(false);

    // Add two initial tiles
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Add a random tile (2 or 4) to an empty cell
   */
  addRandomTile(): void {
    const emptyCells: { row: number, col: number }[] = [];
    const currentBoard = this.board();

    // Find all empty cells
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (currentBoard[row][col].value === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    // If there are empty cells, add a new tile
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newValue = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% chance for 4

      // Create a new board with the updated tile
      const newBoard = [...currentBoard];
      newBoard[randomCell.row][randomCell.col] = {
        value: newValue,
        row: randomCell.row,
        col: randomCell.col,
        isNew: true
      };

      this.board.set(newBoard);
    }
  }

  /**
   * Add a random tile with a delay to allow animations to complete
   * @param delayMs The delay in milliseconds before adding the tile
   */
  addRandomTileWithDelay(delayMs: number = 250): void {
    setTimeout(() => {
      this.addRandomTile();
    }, delayMs);
  }

  /**
   * Helper method to create a line of tiles based on direction
   */
  private createLine(board: Tile[][], index: number, direction: 'up' | 'right' | 'down' | 'left'): Tile[] {
    const line: Tile[] = [];

    switch (direction) {
      case 'up':
        // Create a line from top to bottom for the given column
        for (let r = 0; r < this.boardSize; r++) {
          line.push(board[r][index]);
        }
        break;
      case 'right':
        // Create a line from right to left for the given row
        for (let c = this.boardSize - 1; c >= 0; c--) {
          line.push(board[index][c]);
        }
        break;
      case 'down':
        // Create a line from bottom to top for the given column
        for (let r = this.boardSize - 1; r >= 0; r--) {
          line.push(board[r][index]);
        }
        break;
      case 'left':
        // Create a line from left to right for the given row
        for (let c = 0; c < this.boardSize; c++) {
          line.push(board[index][c]);
        }
        break;
    }

    return line;
  }

  /**
   * Helper method to update the board with a merged line
   */
  private updateBoardWithLine(board: Tile[][], line: Tile[], index: number, direction: 'up' | 'right' | 'down' | 'left'): void {
    // For right and down directions, we need to reverse the line to match the board orientation
    const finalLine = (direction === 'right' || direction === 'down') ? [...line].reverse() : line;

    switch (direction) {
      case 'up':
      case 'down':
        // Update column
        for (let i = 0; i < this.boardSize; i++) {
          board[i][index] = finalLine[i];
          board[i][index].row = i;
          board[i][index].col = index;
        }
        break;
      case 'left':
      case 'right':
        // Update row
        for (let i = 0; i < this.boardSize; i++) {
          board[index][i] = finalLine[i];
          board[index][i].row = index;
          board[index][i].col = i;
        }
        break;
    }
  }

  /**
   * Move tiles in the specified direction
   */
  move(direction: 'up' | 'right' | 'down' | 'left'): void {
    // Clone the current board
    const currentBoard = this.board();
    const newBoard = JSON.parse(JSON.stringify(currentBoard));
    let moved = false;
    let scoreIncrease = 0;

    // Reset tile states and store previous positions
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        // Store current position as previous position
        newBoard[row][col].prevRow = row;
        newBoard[row][col].prevCol = col;

        // Reset animation states
        if (newBoard[row][col].isNew) {
          newBoard[row][col].isNew = false;
        }
        if (newBoard[row][col].isMerged) {
          newBoard[row][col].isMerged = false;
        }
      }
    }

    // Process the move based on direction
    const size = this.boardSize;

    for (let i = 0; i < size; i++) {
      // Create a line based on direction
      const line = this.createLine(newBoard, i, direction);

      // Merge the line
      const result = this.mergeLine(line);
      moved = moved || result.moved;
      scoreIncrease += result.score;

      // Update the board with the merged line
      this.updateBoardWithLine(newBoard, result.line, i, direction);
    }

    // Update the board if tiles moved
    if (moved) {
      this.board.set(newBoard);
      this.score.update(score => score + scoreIncrease);

      // Add a new tile with a delay to allow animations to complete
      this.addRandomTileWithDelay();

      // Check for game over or win
      this.checkGameStatus();
    }
  }


  /**
   * Merge a line of tiles (for a row or column)
   * Returns the merged line, whether any tiles moved, and the score increase
   */
  mergeLine(line: Tile[]): { line: Tile[], moved: boolean, score: number } {
    let moved = false;
    let score = 0;

    // Create a copy of the line with reset merge states
    const mergedLine: Tile[] = line.map(tile => ({
      ...tile,
      isMerged: false
    }));

    // Track the minimum column that can be a target for merging
    // This prevents double-merging in a single move
    let minCol = 0;

    // Start from the second tile (index 1) and try to move/merge each tile
    for (let col = 1; col < this.boardSize; col++) {
      // Skip empty tiles
      if (mergedLine[col].value === 0) {
        continue;
      }

      const tileBeingMoved = mergedLine[col];

      // Look for a target position for this tile (moving left)
      for (let target = col - 1; target >= 0 && target >= minCol; target--) {
        const potentialTarget = mergedLine[target];

        if (potentialTarget.value === 0) {
          // Move tile to empty space
          this.moveTile(target, tileBeingMoved, mergedLine);
          moved = true;
        } else if (potentialTarget.value === tileBeingMoved.value) {
          // Merge tiles with the same value
          score += this.mergeTiles(target, tileBeingMoved, mergedLine);
          minCol++;
          moved = true;
          break;
        } else {
          // Can't move this tile further
          minCol++;
          break;
        }
      }
    }

    return { line: mergedLine, moved, score };
  }

  /**
   * Move a tile to an empty position
   */
  private moveTile(targetCol: number, tileBeingMoved: Tile, mergedLine: Tile[]): void {
    // Move tile to target position
    mergedLine[targetCol] = {
      ...tileBeingMoved,
      value: tileBeingMoved.value
    };

    // Clear the original position
    mergedLine[targetCol + 1] = {
      ...tileBeingMoved,
      value: 0
    };
  }

  /**
   * Merge two tiles with the same value
   * Returns the score increase from the merge
   */
  private mergeTiles(targetCol: number, tileBeingMoved: Tile, mergedLine: Tile[]): number {
    const newValue = tileBeingMoved.value * 2;

    // Create merged tile
    mergedLine[targetCol] = {
      ...tileBeingMoved,
      value: newValue,
      isMerged: true
    };

    // Clear the original position
    mergedLine[targetCol + 1] = {
      ...tileBeingMoved,
      value: 0
    };

    return newValue;
  }

  /**
   * Check if the game is over or won
   */
  private checkGameStatus(): void {
    const currentBoard = this.board();

    // Check for 2048 tile (win condition)
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (currentBoard[row][col].value === 2048) {
          this.gameWon.set(true);
          return;
        }
      }
    }

    // For game over check, we need to wait until after the new tile is added
    // to accurately determine if there are no more moves
    setTimeout(() => {
      const updatedBoard = this.board();

      // Check if there are any empty cells
      for (let row = 0; row < this.boardSize; row++) {
        for (let col = 0; col < this.boardSize; col++) {
          if (updatedBoard[row][col].value === 0) {
            return; // Game not over, there are empty cells
          }
        }
      }

      // Check if there are any possible merges
      for (let row = 0; row < this.boardSize; row++) {
        for (let col = 0; col < this.boardSize; col++) {
          const value = updatedBoard[row][col].value;

          // Check adjacent cells (up, right, down, left)
          const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

          for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (
              newRow >= 0 && newRow < this.boardSize &&
              newCol >= 0 && newCol < this.boardSize &&
              updatedBoard[newRow][newCol].value === value
            ) {
              return; // Game not over, there are possible merges
            }
          }
        }
      }

      // If we get here, there are no empty cells and no possible merges
      this.gameOver.set(true);
    }, 300); // Wait a bit longer than the tile addition delay to ensure the new tile is in place
  }

  /**
   * Reset the game
   */
  resetGame(): void {
    this.initGame();
  }
}
