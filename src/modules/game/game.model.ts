export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

export interface GameModel {
  id: string;
  playersScores: {
    playerId: string;
    playerName: string;
    rolls: string[][];
    framesScore: number[];
  }[];
  currentFrame: number;
  status: GameStatus;
}
