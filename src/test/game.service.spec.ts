import { GameStatus } from 'src/modules/game/game.model';
import {
  GameEntity,
  GameRepository,
} from 'src/modules/game/implementation/game.entity';
import { GameService } from 'src/modules/game/implementation/game.service';
import { PlayerInterface } from 'src/modules/player/player.interface';
import { ScoreInterface } from 'src/modules/score/score.interface';

describe('GameService', () => {
  let gameService: GameService;
  let mockPlayerService: jest.Mocked<PlayerInterface>;
  let mockScoreService: jest.Mocked<ScoreInterface>;

  beforeEach(() => {
    mockPlayerService = {
      createPlayer: jest.fn((playerName: string) => ({
        id: `player-1`,
        name: playerName,
      })),
      getPlayer: jest.fn((id: string) => ({
        id,
        name: `Luke Nguyen`,
      })),
    } as unknown as jest.Mocked<PlayerInterface>;

    mockScoreService = {
      computeFrameScores: jest.fn((rolls: string[][]) => rolls.map(() => 10)),
    } as unknown as jest.Mocked<ScoreInterface>;

    gameService = new GameService(mockPlayerService, mockScoreService);
    GameRepository.storage.clear();
  });

  describe('createGame', () => {
    it('should create a new game and save it in the repository', () => {
      const game = gameService.createGame();

      expect(game).toBeDefined();
      expect(game.id).toBe('game-1');
      expect(game.status).toBe(GameStatus.WAITING);
      expect(GameRepository.storage.size).toBe(1);
    });
  });

  describe('startGame', () => {
    it('should throw an error if the game is not in "WAITING" status', () => {
      const gameEntity = new GameEntity();
      gameEntity.status = GameStatus.IN_PROGRESS;
      GameRepository.save(gameEntity);

      expect(() => gameService.startGame(gameEntity.id)).toThrowError(
        'Cannot start game. Status must be "WAITING".',
      );
    });

    it('should throw an error if there are not enough players', () => {
      const gameEntity = new GameEntity();
      GameRepository.save(gameEntity);

      expect(() => gameService.startGame(gameEntity.id)).toThrowError(
        `Cannot start the game. At least ${GameService.MIN_PLAYERS} players are required.`,
      );
    });

    it('should start the game if all conditions are met', () => {
      const gameEntity = new GameEntity();
      gameEntity.playersRolls = [
        { playerId: 'player1', rolls: [], frameScores: [] },
        { playerId: 'player2', rolls: [], frameScores: [] },
      ];
      GameRepository.save(gameEntity);

      const game = gameService.startGame(gameEntity.id);

      expect(game.status).toBe(GameStatus.IN_PROGRESS);
    });
  });

  describe('getGame', () => {
    it('should retrieve a game by its ID', () => {
      const gameEntity = new GameEntity();
      GameRepository.save(gameEntity);

      const game = gameService.getGame(gameEntity.id);

      expect(game).toBeDefined();
      expect(game.id).toBe(gameEntity.id);
    });

    it('should throw an error if the game does not exist', () => {
      expect(() => gameService.getGame('nonexistent-id')).toThrowError(
        'Game with ID "nonexistent-id" not found.',
      );
    });
  });

  describe('addPlayer', () => {
    it('should add a player to the game', () => {
      const gameEntity = new GameEntity();
      GameRepository.save(gameEntity);

      const game = gameService.addPlayer(gameEntity.id, 'Luke Nguyen');

      expect(game.playersScores.length).toBe(1);
      expect(game.playersScores[0].playerName).toBe('Luke Nguyen');
    });

    it('should throw an error if the game is not in "WAITING" status', () => {
      const gameEntity = new GameEntity();
      gameEntity.status = GameStatus.IN_PROGRESS;
      GameRepository.save(gameEntity);

      expect(() =>
        gameService.addPlayer(gameEntity.id, 'Luke Nguyen'),
      ).toThrowError('Cannot add players. Game is already in progress.');
    });

    it('should throw an error if the maximum player limit is reached', () => {
      const gameEntity = new GameEntity();
      gameEntity.playersRolls = Array(GameService.MAX_PLAYERS).fill({
        playerId: 'player',
        rolls: [],
        frameScores: [],
      });
      GameRepository.save(gameEntity);

      expect(() =>
        gameService.addPlayer(gameEntity.id, 'Luke Nguyen'),
      ).toThrowError(
        `Cannot add more players. Maximum limit (${GameService.MAX_PLAYERS}) reached.`,
      );
    });
  });

  describe('addRollScores', () => {
    it('should throw an error if the game is not in progress', () => {
      const gameEntity = new GameEntity();
      GameRepository.save(gameEntity);

      expect(() =>
        gameService.addRollScores(gameEntity.id, 'player1', ['1', '2']),
      ).toThrowError('Cannot add scores. Game is not in progress.');
    });

    it('should throw an error if the rolls are invalid', () => {
      const gameEntity = new GameEntity();
      gameEntity.status = GameStatus.IN_PROGRESS;
      gameEntity.playersRolls.push({
        playerId: 'player1',
        rolls: [],
        frameScores: [],
      });
      GameRepository.save(gameEntity);

      expect(() =>
        gameService.addRollScores(gameEntity.id, 'player1', ['a']),
      ).toThrowError(
        'Invalid rolls: [a]. Rolls must be "x", "/", ".", or digits.',
      );
    });

    it('should add valid rolls and compute frame scores', () => {
      const gameEntity = new GameEntity();
      gameEntity.status = GameStatus.IN_PROGRESS;
      gameEntity.playersRolls.push({
        playerId: 'player1',
        rolls: [],
        frameScores: [],
      });
      gameEntity.currentPlayerId = 'player1';
      GameRepository.save(gameEntity);

      const game = gameService.addRollScores(gameEntity.id, 'player1', [
        '5',
        '/',
      ]);

      expect(game.playersScores[0].rolls).toEqual([['5', '/']]);
      expect(game.playersScores[0].framesScore).toEqual([10]);
    });

    it('should throw an error if the rolls are invalid', () => {
      const gameEntity = new GameEntity();
      gameEntity.status = GameStatus.IN_PROGRESS;
      gameEntity.playersRolls.push({
        playerId: 'player1',
        rolls: [],
        frameScores: [],
      });
      gameEntity.currentPlayerId = 'player1';
      GameRepository.save(gameEntity);

      expect(() =>
        gameService.addRollScores(gameEntity.id, 'player1', ['a']),
      ).toThrowError(
        'Invalid rolls: [a]. Rolls must be "x", "/", ".", or digits.',
      );
    });
  });
});
