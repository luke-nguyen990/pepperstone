import { Injectable } from '@nestjs/common';
import { GameInterface } from '../game.interface';
import { GameModel } from '../game.model';

@Injectable()
export class GameService extends GameInterface {
  createGame(): GameModel {
    throw new Error('Method not implemented.');
  }
  startGame(gameId: string): GameModel {
    throw new Error('Method not implemented.');
  }
  getGame(gameId: string): GameModel {
    throw new Error('Method not implemented.');
  }
  addPlayer(gameId: string, playerName: string): GameModel {
    throw new Error('Method not implemented.');
  }
  addRollScores(gameId: string, playerId: string, scores: string[]) {
    throw new Error('Method not implemented.');
  }
}
