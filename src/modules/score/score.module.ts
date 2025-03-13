import { Module } from '@nestjs/common';
import { ScoreService } from './implementation/score.service';
import { ScoreInterface } from './score.interface';

@Module({
  exports: [ScoreInterface],
  providers: [{ provide: ScoreInterface, useClass: ScoreService }],
})
export class ScoreModule {}
