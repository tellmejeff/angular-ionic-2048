import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GameService, Tile } from '../../game.service';
import { TileComponent } from '../tile/tile.component';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule, IonicModule, TileComponent],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  gameService = inject(GameService);

  // Track touch events for swipe detection
  private touchStartX = 0;
  private touchStartY = 0;
  private readonly swipeThreshold = 50;

  ngOnInit(): void {
    this.gameService.initGame();
  }

  /**
   * Handle keyboard arrow keys
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        this.gameService.move('up');
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.gameService.move('right');
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.gameService.move('down');
        event.preventDefault();
        break;
      case 'ArrowLeft':
        this.gameService.move('left');
        event.preventDefault();
        break;
    }
  }

  /**
   * Handle touch start event
   */
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  /**
   * Handle touch end event to detect swipes
   */
  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;

    // Determine if it's a horizontal or vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > this.swipeThreshold) {
        if (deltaX > 0) {
          this.gameService.move('right');
        } else {
          this.gameService.move('left');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > this.swipeThreshold) {
        if (deltaY > 0) {
          this.gameService.move('down');
        } else {
          this.gameService.move('up');
        }
      }
    }
  }

  /**
   * Reset the game
   */
  resetGame(): void {
    this.gameService.resetGame();
  }

  /**
   * Get the range of indices for the board
   */
  getRange(size: number): number[] {
    return Array.from({ length: size }, (_, i) => i);
  }

  /**
   * Track tiles by their position and value for better rendering performance
   */
  trackByTile(index: number, tile: any): string {
    const tileObj = tile as Tile;
    return `${tileObj.row}-${tileObj.col}-${tileObj.value}`;
  }

  /**
   * Get all non-zero tiles from the board
   */
  getNonZeroTiles(): Tile[] {
    const tiles: Tile[] = [];
    const board = this.gameService.board();

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col].value !== 0) {
          tiles.push(board[row][col]);
        }
      }
    }

    return tiles;
  }
}
