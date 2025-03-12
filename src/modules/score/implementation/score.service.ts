import { Injectable } from '@nestjs/common';
import { ScoreInterface } from '../score.interface';

@Injectable()
export class ScoreService extends ScoreInterface {
  calculateScore(rolls: string[]): number {
    throw new Error('Method not implemented.');
  }
}
