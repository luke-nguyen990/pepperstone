import { Module } from '@nestjs/common';
import { PlayerModule } from '../player/player.module';
import { ScoreModule } from '../score/score.module';

@Module({
  imports: [PlayerModule, ScoreModule],
  controllers: [],
})
export class GameModule {}
