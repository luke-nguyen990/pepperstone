import { Injectable } from '@nestjs/common';
import { ScoreInterface } from '../score.interface';

@Injectable()
export class ScoreService extends ScoreInterface {
  computeFrameScores(rolls: string[][]): number[] {
    const frameScores: number[] = [];
    let totalScore = 0;

    for (let i = 0; i < rolls.length; i++) {
      const frame = rolls[i];
      const isStrike = frame[0] === 'x';
      const isSpare = frame.length === 2 && frame[1] === '/';

      if (isStrike) {
        const bonus = this.getBonusRolls(rolls, i, 2);
        totalScore += 10 + bonus;
      } else if (isSpare) {
        const firstRoll = this.parseRoll(frame[0]);
        const bonus = this.getBonusRolls(rolls, i, 1);
        totalScore += 10 + bonus - firstRoll;
      } else {
        const frameTotal = frame.reduce(
          (sum, roll) => sum + this.parseRoll(roll),
          0,
        );
        totalScore += frameTotal;
      }

      frameScores.push(totalScore);
    }

    return frameScores;
  }

  private getBonusRolls(
    rolls: string[][],
    currentFrameIndex: number,
    count: number,
  ): number {
    let bonus = 0;
    let rollsToCount = count;

    for (
      let i = currentFrameIndex + 1;
      i < rolls.length && rollsToCount > 0;
      i++
    ) {
      const nextFrame = rolls[i];
      for (const roll of nextFrame) {
        if (rollsToCount === 0) break;
        bonus += this.parseRoll(roll);
        rollsToCount--;
      }
    }

    return bonus;
  }

  private parseRoll(roll: string): number {
    if (roll === 'x') {
      return 10;
    } else if (roll === '/') {
      throw new Error(
        'Spare symbol "/" should not be parsed directly. It requires context of the first roll in the frame.',
      );
    } else if (roll === '.') {
      return 0;
    } else {
      return parseInt(roll, 10);
    }
  }
}
