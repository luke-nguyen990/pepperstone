import { GameStatus } from '../game.model';

export class GameEntity {
  id: string;
  playersRolls: {
    playerId: string;
    rolls: string[][];
    frameScores: number[];
  }[];
  currentFrame: number = 1;
  currentPlayerId: string;
  status: GameStatus = GameStatus.WAITING;
  constructor() {
    this.id = `game-${GameRepository.storage.size + 1}`;
    this.playersRolls = [];
    this.currentFrame = 1;
    this.status = GameStatus.WAITING;
  }
}

export class GameRepository {
  static storage: Map<string, GameEntity> = new Map();

  static save(game: GameEntity): GameEntity {
    this.storage.set(game.id, game);
    return game;
  }

  static findOne(id: string): GameEntity | undefined {
    return this.storage.get(id);
  }
}
