import { Injectable } from '@nestjs/common';
import { PlayerInterface } from '../player.interface';
import { PlayerModel } from '../player.model';
import { PlayerEntity, PlayerRepository } from './player.entity';

@Injectable()
export class PlayerService extends PlayerInterface {
  getPlayer(id: string): PlayerModel {
    const player = PlayerRepository.findOne(id);

    if (!player) {
      throw new Error(`Player with ID ${id} not found`);
    }

    return this.mapToPlayerModel(player);
  }

  getPlayers(ids: string[]): PlayerModel[] {
    return ids.map((id) => this.getPlayer(id));
  }

  createPlayer(name: string): PlayerModel {
    const player = new PlayerEntity(name);

    PlayerRepository.save(player);

    return this.mapToPlayerModel(player);
  }

  private mapToPlayerModel(player: PlayerEntity): PlayerModel {
    return {
      id: player.id,
      name: player.name,
    };
  }
}
