import { Routes } from '@angular/router';
import { GameBoardComponent } from './game/components/game-board/game-board.component';

export const routes: Routes = [
  { path: '', component: GameBoardComponent },
  { path: '**', redirectTo: '' }
];
