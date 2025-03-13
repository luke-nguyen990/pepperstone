import { Module } from '@nestjs/common';
import { GameModule } from './modules/game/game.module';
import { HealthModule } from './modules/health/health.module';
import { PlayerModule } from './modules/player/player.module';
import { ScoreModule } from './modules/score/score.module';

@Module({
  imports: [HealthModule, GameModule, PlayerModule, ScoreModule],
})
export class AppModule {}
