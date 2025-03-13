import { Module } from '@nestjs/common';
import { PlayerService } from './implementation/player.service';
import { PlayerInterface } from './player.interface';

@Module({
  exports: [PlayerInterface],
  providers: [{ provide: PlayerInterface, useClass: PlayerService }],
})
export class PlayerModule {}
