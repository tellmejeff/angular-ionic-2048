import { TestBed } from '@angular/core/testing';
import { GameService, Tile } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameService]
    });
    service = TestBed.inject(GameService);
  });

  afterEach(() => {
    // Clean up if needed
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initGame', () => {
    it('should initialize a 4x4 board', () => {
      service.initGame();
      const board = service.board();

      expect(board.length).toBe(4);
      expect(board[0].length).toBe(4);
    });

    it('should reset score to 0', () => {
      service.initGame();
      expect(service.score()).toBe(0);
    });

    it('should set gameOver and gameWon to false', () => {
      service.initGame();
      expect(service.gameOver()).toBe(false);
      expect(service.gameWon()).toBe(false);
    });

    it('should add two random tiles to the board', () => {
      service.initGame();
      const board = service.board();

      // Count non-zero tiles
      const nonZeroTiles = board.flat().filter(tile => tile.value !== 0);
      expect(nonZeroTiles.length).toBe(2);
    });
  });

  describe('addRandomTile', () => {
    it('should add a tile with value 2 or 4 to an empty cell', () => {
      service.initGame();

      // Clear the board first
      const emptyBoard = Array(4).fill(null).map((_, row) =>
        Array(4).fill(null).map((_, col) => ({ value: 0, row, col }))
      );
      service.board.set(emptyBoard);

      service.addRandomTile();

      const board = service.board();
      const nonZeroTiles = board.flat().filter(tile => tile.value !== 0);

      expect(nonZeroTiles.length).toBe(1);
      expect([2, 4]).toContain(nonZeroTiles[0].value);
    });

    it('should not add a tile when the board is full', () => {
      service.initGame();

      // Fill the board with non-zero values
      const fullBoard = Array(4).fill(null).map((_, row) =>
        Array(4).fill(null).map((_, col) => ({ value: 2, row, col }))
      );
      service.board.set(fullBoard);

      service.addRandomTile();

      // Board should remain unchanged
      const board = service.board();
      expect(board).toEqual(fullBoard);
    });
  });

  describe('move', () => {
    it('should move tiles up correctly', () => {
      service.initGame();

      // Set up a specific board state
      const testBoard: Tile[][] = [
        [{ value: 0, row: 0, col: 0 }, { value: 0, row: 0, col: 1 }, { value: 0, row: 0, col: 2 }, { value: 0, row: 0, col: 3 }],
        [{ value: 0, row: 1, col: 0 }, { value: 2, row: 1, col: 1 }, { value: 2, row: 1, col: 2 }, { value: 2, row: 1, col: 3 }],
        [{ value: 0, row: 2, col: 0 }, { value: 2, row: 2, col: 1 }, { value: 0, row: 2, col: 2 }, { value: 2, row: 2, col: 3 }],
        [{ value: 2, row: 3, col: 0 }, { value: 0, row: 3, col: 1 }, { value: 0, row: 3, col: 2 }, { value: 0, row: 3, col: 3 }]
      ];
      service.board.set(testBoard);

      // Spy on addRandomTileWithDelay to prevent it from executing
      jest.spyOn(service, 'addRandomTileWithDelay');

      service.move('up');

      // Check that the tiles moved correctly
      const board = service.board();
      expect(board[0][0].value).toBe(2);
      expect(board[1][0].value).toBe(0);
      expect(board[2][0].value).toBe(0);
      expect(board[3][0].value).toBe(0);
      expect(board[0][1].value).toBe(4);
      expect(board[1][1].value).toBe(0);
      expect(board[2][1].value).toBe(0);
      expect(board[3][1].value).toBe(0);
      expect(board[0][2].value).toBe(2);
      expect(board[1][2].value).toBe(0);
      expect(board[2][2].value).toBe(0);
      expect(board[3][2].value).toBe(0);
      expect(board[0][3].value).toBe(4);
      expect(board[1][3].value).toBe(0);
      expect(board[2][3].value).toBe(0);
      expect(board[3][3].value).toBe(0);
    });

    it('should move tiles right correctly', () => {
      service.initGame();

      // Set up a specific board state
      const testBoard: Tile[][] = [
        [{ value: 0, row: 0, col: 0 }, { value: 0, row: 0, col: 1 }, { value: 2, row: 0, col: 2 }, { value: 2, row: 0, col: 3 }],
        [{ value: 2, row: 1, col: 0 }, { value: 2, row: 1, col: 1 }, { value: 0, row: 1, col: 2 }, { value: 2, row: 1, col: 3 }],
        [{ value: 0, row: 2, col: 0 }, { value: 4, row: 2, col: 1 }, { value: 2, row: 2, col: 2 }, { value: 0, row: 2, col: 3 }],
        [{ value: 4, row: 3, col: 0 }, { value: 0, row: 3, col: 1 }, { value: 2, row: 3, col: 2 }, { value: 0, row: 3, col: 3 }]
      ];
      service.board.set(testBoard);

      // Spy on addRandomTileWithDelay to prevent it from executing
      jest.spyOn(service, 'addRandomTileWithDelay');

      service.move('right');

      // Check that the tiles moved correctly
      const board = service.board();
      expect(board[0][3].value).toBe(4);
      expect(board[0][2].value).toBe(0);
      expect(board[0][1].value).toBe(0);
      expect(board[0][0].value).toBe(0);
      expect(board[1][3].value).toBe(4);
      expect(board[1][2].value).toBe(2);
      expect(board[1][1].value).toBe(0);
      expect(board[1][0].value).toBe(0);
      expect(board[2][3].value).toBe(2);
      expect(board[2][2].value).toBe(4);
      expect(board[2][1].value).toBe(0);
      expect(board[2][0].value).toBe(0);
      expect(board[3][3].value).toBe(2);
      expect(board[3][2].value).toBe(4);
      expect(board[3][1].value).toBe(0);
      expect(board[3][0].value).toBe(0);
    });

    it('should move tiles down correctly', () => {
      service.initGame();

      // Set up a specific board state
      const testBoard: Tile[][] = [
        [{ value: 0, row: 0, col: 0 }, { value: 2, row: 0, col: 1 }, { value: 0, row: 0, col: 2 }, { value: 0, row: 0, col: 3 }],
        [{ value: 0, row: 1, col: 0 }, { value: 2, row: 1, col: 1 }, { value: 0, row: 1, col: 2 }, { value: 0, row: 1, col: 3 }],
        [{ value: 0, row: 2, col: 0 }, { value: 0, row: 2, col: 1 }, { value: 0, row: 2, col: 2 }, { value: 0, row: 2, col: 3 }],
        [{ value: 0, row: 3, col: 0 }, { value: 0, row: 3, col: 1 }, { value: 0, row: 3, col: 2 }, { value: 0, row: 3, col: 3 }]
      ];
      service.board.set(testBoard);

      // Spy on addRandomTileWithDelay to prevent it from executing
      jest.spyOn(service, 'addRandomTileWithDelay');

      service.move('down');

      // Check that the tiles moved correctly
      const board = service.board();
      expect(board[3][1].value).toBe(4); // The two 2s should merge to a 4
      expect(board[2][1].value).toBe(0);
      expect(board[1][1].value).toBe(0);
      expect(board[0][1].value).toBe(0);
    });

    it('should move tiles left correctly', () => {
      service.initGame();

      // Set up a specific board state
      const testBoard: Tile[][] = [
        [{ value: 2, row: 0, col: 0 }, { value: 2, row: 0, col: 1 }, { value: 0, row: 0, col: 2 }, { value: 0, row: 0, col: 3 }],
        [{ value: 0, row: 1, col: 0 }, { value: 0, row: 1, col: 1 }, { value: 0, row: 1, col: 2 }, { value: 0, row: 1, col: 3 }],
        [{ value: 0, row: 2, col: 0 }, { value: 0, row: 2, col: 1 }, { value: 0, row: 2, col: 2 }, { value: 0, row: 2, col: 3 }],
        [{ value: 0, row: 3, col: 0 }, { value: 0, row: 3, col: 1 }, { value: 0, row: 3, col: 2 }, { value: 0, row: 3, col: 3 }]
      ];
      service.board.set(testBoard);

      // Spy on addRandomTileWithDelay to prevent it from executing
      jest.spyOn(service, 'addRandomTileWithDelay');

      service.move('left');

      // Check that the tiles moved correctly
      const board = service.board();
      expect(board[0][0].value).toBe(4); // The two 2s should merge to a 4
      expect(board[0][1].value).toBe(0);
      expect(board[0][2].value).toBe(0);
      expect(board[0][3].value).toBe(0);
    });

    it('should increase score when tiles are merged', () => {
      service.initGame();

      // Set up a specific board state with two 2s that can be merged
      const testBoard: Tile[][] = [
        [{ value: 2, row: 0, col: 0 }, { value: 2, row: 0, col: 1 }, { value: 0, row: 0, col: 2 }, { value: 0, row: 0, col: 3 }],
        [{ value: 0, row: 1, col: 0 }, { value: 0, row: 1, col: 1 }, { value: 0, row: 1, col: 2 }, { value: 0, row: 1, col: 3 }],
        [{ value: 0, row: 2, col: 0 }, { value: 0, row: 2, col: 1 }, { value: 0, row: 2, col: 2 }, { value: 0, row: 2, col: 3 }],
        [{ value: 0, row: 3, col: 0 }, { value: 0, row: 3, col: 1 }, { value: 0, row: 3, col: 2 }, { value: 0, row: 3, col: 3 }]
      ];
      service.board.set(testBoard);
      service.score.set(0);

      // Spy on addRandomTileWithDelay to prevent it from executing
      jest.spyOn(service, 'addRandomTileWithDelay');

      service.move('left');

      // Score should increase by the value of the merged tile (4)
      expect(service.score()).toBe(4);
    });
  });

  describe('mergeLine', () => {
    it('should merge tiles with the same value', () => {
      const line: Tile[] = [
        { value: 2, row: 0, col: 0 },
        { value: 2, row: 0, col: 1 },
        { value: 0, row: 0, col: 2 },
        { value: 0, row: 0, col: 3 }
      ];

      const result = service.mergeLine(line);

      expect(result.line[0].value).toBe(4);
      expect(result.line[1].value).toBe(0);
      expect(result.line[2].value).toBe(0);
      expect(result.line[3].value).toBe(0);
      expect(result.moved).toBe(true);
      expect(result.score).toBe(4);
    });

    it('should not merge tiles with different values', () => {
      const line: Tile[] = [
        { value: 2, row: 0, col: 0 },
        { value: 4, row: 0, col: 1 },
        { value: 0, row: 0, col: 2 },
        { value: 0, row: 0, col: 3 }
      ];

      const result = service.mergeLine(line);

      expect(result.line[0].value).toBe(2);
      expect(result.line[1].value).toBe(4);
      expect(result.moved).toBe(false);
    });

    it('should handle multiple merges in one line', () => {
      const line: Tile[] = [
        { value: 2, row: 0, col: 0 },
        { value: 2, row: 0, col: 1 },
        { value: 4, row: 0, col: 2 },
        { value: 4, row: 0, col: 3 }
      ];

      const result = service.mergeLine(line);

      expect(result.line[0].value).toBe(4);
      expect(result.line[1].value).toBe(8);
      expect(result.line[2].value).toBe(0);
      expect(result.line[3].value).toBe(0);
      expect(result.moved).toBe(true);
      expect(result.score).toBe(12); // 4 + 8
    });
  });

  describe('checkGameStatus', () => {
    it('should set gameWon to true when a 2048 tile is present', () => {
      service.initGame();

      // Create a board with a 2048 tile
      const testBoard: Tile[][] = Array(4).fill(null).map((_, row) =>
        Array(4).fill(null).map((_, col) => ({
          value: (row === 0 && col === 0) ? 2048 : 0,
          row,
          col
        }))
      );
      service.board.set(testBoard);

      // Call the method directly
      (service as any).checkGameStatus();

      // gameWon should be true
      expect(service.gameWon()).toBe(true);
    });

    it('should set gameOver to true when no moves are possible', (done) => {
      service.initGame();

      // Create a board with no possible moves
      // Each cell has a value different from its neighbors
      const testBoard: Tile[][] = [
        [{ value: 2, row: 0, col: 0 }, { value: 4, row: 0, col: 1 }, { value: 2, row: 0, col: 2 }, { value: 4, row: 0, col: 3 }],
        [{ value: 4, row: 1, col: 0 }, { value: 2, row: 1, col: 1 }, { value: 4, row: 1, col: 2 }, { value: 2, row: 1, col: 3 }],
        [{ value: 2, row: 2, col: 0 }, { value: 4, row: 2, col: 1 }, { value: 2, row: 2, col: 2 }, { value: 4, row: 2, col: 3 }],
        [{ value: 4, row: 3, col: 0 }, { value: 2, row: 3, col: 1 }, { value: 4, row: 3, col: 2 }, { value: 2, row: 3, col: 3 }]
      ];
      service.board.set(testBoard);

      // Call the method directly
      (service as any).checkGameStatus();

      // Need to wait for the setTimeout in checkGameStatus to complete
      setTimeout(() => {
        expect(service.gameOver()).toBe(true);
        done();
      }, 300); // Wait longer than the 200ms in the service
    });

    it('should not set gameOver to true when moves are still possible', (done) => {
      service.initGame();

      // Create a board with possible moves (two adjacent 2s)
      const testBoard: Tile[][] = [
        [{ value: 2, row: 0, col: 0 }, { value: 2, row: 0, col: 1 }, { value: 4, row: 0, col: 2 }, { value: 8, row: 0, col: 3 }],
        [{ value: 4, row: 1, col: 0 }, { value: 8, row: 1, col: 1 }, { value: 16, row: 1, col: 2 }, { value: 32, row: 1, col: 3 }],
        [{ value: 64, row: 2, col: 0 }, { value: 128, row: 2, col: 1 }, { value: 256, row: 2, col: 2 }, { value: 512, row: 2, col: 3 }],
        [{ value: 1024, row: 3, col: 0 }, { value: 16, row: 3, col: 1 }, { value: 8, row: 3, col: 2 }, { value: 4, row: 3, col: 3 }]
      ];
      service.board.set(testBoard);

      // Call the method directly
      (service as any).checkGameStatus();

      // Need to wait for the setTimeout in checkGameStatus to complete
      setTimeout(() => {
        expect(service.gameOver()).toBe(false);
        done();
      }, 300); // Wait longer than the 200ms in the service
    });
  });

  describe('resetGame', () => {
    it('should call initGame', () => {
      jest.spyOn(service, 'initGame');
      service.resetGame();
      expect(service.initGame).toHaveBeenCalled();
    });
  });
});
