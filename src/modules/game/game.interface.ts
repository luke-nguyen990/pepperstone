import { GameModel } from './game.model';

export abstract class GameInterface {
  abstract createGame(): GameModel;

  abstract startGame(gameId: string): GameModel;

  abstract getGame(gameId: string): GameModel;

  abstract addPlayer(gameId: string, playerName: string): GameModel;

  abstract addRollScores(
    gameId: string,
    playerId: string,
    scores: string[],
  ): any;
}
