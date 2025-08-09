import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { TileComponent } from './components/tile/tile.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    GameBoardComponent,
    TileComponent
  ],
  exports: [
    GameBoardComponent,
    TileComponent
  ]
})
export class GameModule { }
