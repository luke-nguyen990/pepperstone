import { Module } from '@nestjs/common';
import { PlayerModule } from '../player/player.module';
import { ScoreModule } from '../score/score.module';
import { GameController } from './game.controller';
import { GameInterface } from './game.interface';
import { GameService } from './implementation/game.service';

@Module({
  controllers: [GameController],
  imports: [PlayerModule, ScoreModule],
  providers: [{ provide: GameInterface, useClass: GameService }],
})
export class GameModule {}
