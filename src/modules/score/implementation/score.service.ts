import { Injectable } from '@nestjs/common';
import { ScoreInterface } from '../score.interface';

@Injectable()
export class ScoreService extends ScoreInterface {
  computeFrameScores(rolls: string[][]): number[] {
    const frameScores: number[] = [];
    let totalScore = 0;

    for (let frameIndex = 0; frameIndex < rolls.length; frameIndex++) {
      const frame = rolls[frameIndex];
      this.validateFrame(frame);

      const isStrike = frame[0] === 'x';
      const isSpare = frame.length === 2 && frame[1] === '/';

      if (isStrike) {
        const bonus = this.getBonusRolls(rolls, frameIndex, 2);
        totalScore += 10 + bonus;
      } else if (isSpare) {
        const firstRoll = this.parseRoll(frame[0]);
        const bonus = this.getBonusRolls(rolls, frameIndex, 1);
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
    } else if (!/^\d$/.test(roll)) {
      throw new Error(
        `Invalid roll value: "${roll}". Must be a digit, "x", "/", or ".".`,
      );
    } else {
      return parseInt(roll, 10);
    }
  }

  private validateFrame(frame: string[]): void {
    if (frame.length === 0 || frame.length > 2) {
      throw new Error(
        `Invalid frame: [${frame.join(', ')}]. A frame must contain 1 or 2 rolls.`,
      );
    }

    if (frame.length === 2 && frame[0] === 'x') {
      throw new Error(
        `Invalid frame: [${frame.join(', ')}]. A strike must be a single roll.`,
      );
    }
  }
}
