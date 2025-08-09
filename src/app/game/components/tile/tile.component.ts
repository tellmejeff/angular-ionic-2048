import { Component, Input, OnChanges, SimpleChanges, ElementRef, NgZone, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tile } from '../../game.service';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnChanges, AfterViewInit {
  private el = inject(ElementRef);
  private ngZone = inject(NgZone);

  @Input() tile!: Tile;

  // Track previous value for animation
  previousValue = 0;

  // Position styles
  positionStyle: { [key: string]: string } = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tile'] && !changes['tile'].firstChange) {
      this.previousValue = changes['tile'].previousValue.value;
    }

    // Calculate position based on previous position if available
    if (this.tile.prevRow !== undefined && this.tile.prevCol !== undefined &&
        (this.tile.prevRow !== this.tile.row || this.tile.prevCol !== this.tile.col)) {
      // Use previous position for initial placement
      this.positionStyle = this.calculatePositionStyle(this.tile.prevRow, this.tile.prevCol);

      // Apply initial position styles directly to the host element
      this.applyStyles(this.positionStyle);

      // Schedule animation to new position
      this.schedulePositionAnimation();
    } else {
      // Use current position directly
      this.positionStyle = this.calculatePositionStyle(this.tile.row, this.tile.col);

      // Apply position styles directly to the host element
      this.applyStyles(this.positionStyle);
    }
  }

  ngAfterViewInit(): void {
    // For new tiles, no animation needed
    if (this.tile.isNew) {
      this.positionStyle = this.calculatePositionStyle(this.tile.row, this.tile.col);
      this.applyStyles(this.positionStyle);
    }
  }

  /**
   * Apply styles to the host element
   */
  private applyStyles(styles: { [key: string]: string }): void {
    Object.keys(styles).forEach(key => {
      this.el.nativeElement.style[key] = styles[key];
    });
  }

  /**
   * Schedule animation to new position
   */
  private schedulePositionAnimation(): void {
    // Run outside Angular's change detection for better performance
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // Update to current position after a short delay to trigger animation
        this.positionStyle = this.calculatePositionStyle(this.tile.row, this.tile.col);

        // Apply the new styles to the element
        this.applyStyles(this.positionStyle);
      }, 50); // Short delay to ensure the initial position is rendered first
    });
  }

  /**
   * Calculate position style based on row and column
   */
  private calculatePositionStyle(row: number, col: number): { [key: string]: string } {
    // These calculations should match the position-x-y classes in the CSS
    // Initialize with default values to ensure they're always defined
    let top = '15px';  // Default to first row
    let left = '15px'; // Default to first column

    // Ensure row and col are within valid range (0-3)
    if (row !== undefined && row >= 0 && row <= 3) {
      if (row === 0) {
        top = '15px';
      } else if (row === 1) {
        top = 'calc(25% + 11.25px)';
      } else if (row === 2) {
        top = 'calc(50% + 7.5px)';
      } else if (row === 3) {
        top = 'calc(75% + 3.75px)';
      }
    }

    if (col !== undefined && col >= 0 && col <= 3) {
      if (col === 0) {
        left = '15px';
      } else if (col === 1) {
        left = 'calc(25% + 11.25px)';
      } else if (col === 2) {
        left = 'calc(50% + 7.5px)';
      } else if (col === 3) {
        left = 'calc(75% + 3.75px)';
      }
    }

    return { top, left };
  }

  /**
   * Get CSS class based on tile value
   */
  getTileClass(): string {
    const classes = ['tile'];

    // Add value-specific class
    classes.push(`tile-${this.tile.value}`);

    // Add animation classes
    if (this.tile.isNew) {
      classes.push('tile-new');
    } else if (this.tile.isMerged) {
      classes.push('tile-merged');
    }

    return classes.join(' ');
  }
}
