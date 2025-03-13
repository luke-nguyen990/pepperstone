import { ScoreService } from 'src/modules/score/implementation/score.service';

describe('ScoreService', () => {
  let scoreService: ScoreService;

  beforeEach(() => {
    scoreService = new ScoreService();
  });

  describe('computeFrameScores', () => {
    it('should compute scores for a game with no strikes or spares', () => {
      const rolls = [
        ['3', '4'],
        ['2', '5'],
        ['1', '6'],
      ];

      const frameScores = scoreService.computeFrameScores(rolls);

      expect(frameScores).toEqual([7, 14, 21]);
    });

    it('should compute scores for a game with a spare', () => {
      const rolls = [
        ['5', '/'],
        ['3', '4'],
      ];

      const frameScores = scoreService.computeFrameScores(rolls);

      expect(frameScores).toEqual([13, 20]);
    });

    it('should compute scores for a game with a strike', () => {
      const rolls = [['x'], ['4', '2']];

      const frameScores = scoreService.computeFrameScores(rolls);

      expect(frameScores).toEqual([16, 22]);
    });

    it('should compute scores for consecutive strikes', () => {
      const rolls = [['x'], ['x'], ['5', '2']];

      const frameScores = scoreService.computeFrameScores(rolls);

      expect(frameScores).toEqual([25, 42, 49]);
    });

    it('should compute scores for a game with mixed strikes, spares, and open frames', () => {
      const rolls = [['x'], ['5', '/'], ['4', '2']];

      const frameScores = scoreService.computeFrameScores(rolls);

      expect(frameScores).toEqual([20, 34, 40]);
    });

    it('should compute scores for a game with gutter balls', () => {
      const rolls = [['.'], ['3', '.'], ['.']];

      const frameScores = scoreService.computeFrameScores(rolls);

      expect(frameScores).toEqual([0, 3, 3]);
    });

    it('should return an empty array if there are no rolls', () => {
      const rolls: string[][] = [];
      const frameScores = scoreService.computeFrameScores(rolls);

      expect(frameScores).toEqual([]);
    });

    it('should throw an error for invalid rolls', () => {
      const rolls = [['Z']];

      expect(() => scoreService.computeFrameScores(rolls)).toThrowError(
        'Invalid roll value: "Z". Must be a digit, "x", "/", or ".".',
      );
    });

    it('should throw an error for an invalid frame with more than two rolls', () => {
      const rolls = [['3', '4', '5']];
      expect(() => scoreService.computeFrameScores(rolls)).toThrowError(
        'Invalid frame: [3, 4, 5]. A frame must contain 1 or 2 rolls.',
      );
    });

    it('should throw an error for a frame with a strike followed by another roll', () => {
      const rolls = [['x', '3']];

      expect(() => scoreService.computeFrameScores(rolls)).toThrowError(
        'Invalid frame: [x, 3]. A strike must be a single roll.',
      );
    });
  });

  describe('getBonusRolls', () => {
    it('should calculate bonus rolls correctly for a strike', () => {
      const rolls = [['x'], ['5', '3']];

      const bonus = (scoreService as any).getBonusRolls(rolls, 0, 2);

      expect(bonus).toBe(8);
    });

    it('should calculate bonus rolls correctly for a spare', () => {
      const rolls = [
        ['5', '/'],
        ['7', '2'],
      ];

      const bonus = (scoreService as any).getBonusRolls(rolls, 0, 1);

      expect(bonus).toBe(7);
    });

    it('should calculate zero bonus if there are no additional frames', () => {
      const rolls = [['x']];

      const bonus = (scoreService as any).getBonusRolls(rolls, 0, 2);

      expect(bonus).toBe(0);
    });
  });

  describe('parseRoll', () => {
    it('should return 10 for a strike', () => {
      const result = (scoreService as any).parseRoll('x');
      expect(result).toBe(10);
    });

    it('should return 0 for a gutter ball', () => {
      const result = (scoreService as any).parseRoll('.');
      expect(result).toBe(0);
    });

    it('should return the numeric value for valid rolls', () => {
      const result = (scoreService as any).parseRoll('5');
      expect(result).toBe(5);
    });

    it('should throw an error for invalid rolls', () => {
      expect(() => (scoreService as any).parseRoll('Z')).toThrowError(
        'Invalid roll value: "Z". Must be a digit, "x", "/", or ".".',
      );
    });

    it('should throw an error for a spare "/" roll without context', () => {
      expect(() => (scoreService as any).parseRoll('/')).toThrowError(
        'Spare symbol "/" should not be parsed directly. It requires context of the first roll in the frame.',
      );
    });
  });

  describe('validateFrame', () => {
    it('should not throw an error for a valid frame with two rolls', () => {
      const frame = ['3', '4'];
      expect(() => (scoreService as any).validateFrame(frame)).not.toThrow();
    });

    it('should not throw an error for a valid strike frame', () => {
      const frame = ['x'];
      expect(() => (scoreService as any).validateFrame(frame)).not.toThrow();
    });

    it('should throw an error for a frame with more than two rolls', () => {
      const frame = ['3', '4', '5'];
      expect(() => (scoreService as any).validateFrame(frame)).toThrowError(
        'Invalid frame: [3, 4, 5]. A frame must contain 1 or 2 rolls.',
      );
    });

    it('should throw an error for a frame with a strike followed by another roll', () => {
      const frame = ['x', '3'];
      expect(() => (scoreService as any).validateFrame(frame)).toThrowError(
        'Invalid frame: [x, 3]. A strike must be a single roll.',
      );
    });
  });
});
