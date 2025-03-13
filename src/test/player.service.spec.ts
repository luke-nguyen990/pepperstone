import {
  PlayerEntity,
  PlayerRepository,
} from 'src/modules/player/implementation/player.entity';
import { PlayerService } from 'src/modules/player/implementation/player.service';

describe('PlayerService', () => {
  let playerService: PlayerService;

  beforeEach(() => {
    playerService = new PlayerService();

    PlayerRepository.storage.clear();
  });

  describe('getPlayer', () => {
    it('should retrieve a player by ID', () => {
      const player = new PlayerEntity('Luke Nguyen');
      PlayerRepository.save(player);

      const retrievedPlayer = playerService.getPlayer(player.id);

      expect(retrievedPlayer).toEqual({
        id: player.id,
        name: player.name,
      });
    });

    it('should throw an error if the player ID is not found', () => {
      expect(() => playerService.getPlayer('nonexistent-id')).toThrowError(
        'Player with ID nonexistent-id not found',
      );
    });
  });

  describe('getPlayers', () => {
    it('should retrieve multiple players by their IDs', () => {
      const player1 = new PlayerEntity('Luke Nguyen');
      const player2 = new PlayerEntity('Luke Nguyen');
      PlayerRepository.save(player1);
      PlayerRepository.save(player2);

      const players = playerService.getPlayers([player1.id, player2.id]);

      expect(players).toEqual([
        { id: player1.id, name: player1.name },
        { id: player2.id, name: player2.name },
      ]);
    });

    it('should throw an error if one of the player IDs is not found', () => {
      const player = new PlayerEntity('Luke Nguyen');
      PlayerRepository.save(player);

      expect(() =>
        playerService.getPlayers([player.id, 'nonexistent-id']),
      ).toThrowError('Player with ID nonexistent-id not found');
    });
  });

  describe('createPlayer', () => {
    it('should create a new player and save it in the repository', () => {
      const newPlayer = playerService.createPlayer('Luke Nguyen');

      expect(newPlayer).toEqual({
        id: expect.any(String),
        name: 'Luke Nguyen',
      });
      expect(PlayerRepository.storage.size).toBe(1);

      const savedPlayer = PlayerRepository.findOne(newPlayer.id);
      expect(savedPlayer).toBeDefined();
      expect(savedPlayer?.name).toBe('Luke Nguyen');
    });

    it('should create unique IDs for each new player', () => {
      const player1 = playerService.createPlayer('Luke Nguyen');
      const player2 = playerService.createPlayer('Luke Nguyen');

      expect(player1.id).not.toBe(player2.id);
    });
  });

  describe('private mapToPlayerModel', () => {
    it('should map a PlayerEntity to a PlayerModel', () => {
      const playerEntity = new PlayerEntity('Luke Nguyen');

      const playerModel = (playerService as any).mapToPlayerModel(playerEntity);

      expect(playerModel).toEqual({
        id: playerEntity.id,
        name: playerEntity.name,
      });
    });
  });
});
