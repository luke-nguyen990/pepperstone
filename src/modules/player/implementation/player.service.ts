import { Injectable } from '@nestjs/common';
import { PlayerInterface } from '../player.interface';
import { PlayerModel } from '../player.model';

@Injectable()
export class PlayerService extends PlayerInterface {
  createPlayer(name: string): PlayerModel {
    throw new Error('Method not implemented.');
  }
  getPlayer(id: string): PlayerModel {
    throw new Error('Method not implemented.');
  }
  getPlayers(ids: string[]): PlayerModel[] {
    throw new Error('Method not implemented.');
  }
}
