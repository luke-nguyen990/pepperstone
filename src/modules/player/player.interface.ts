import { PlayerModel } from './player.model';

export abstract class PlayerInterface {
  abstract createPlayer(name: string): PlayerModel;

  abstract getPlayer(id: string): PlayerModel;

  abstract getPlayers(ids: string[]): PlayerModel[];
}
