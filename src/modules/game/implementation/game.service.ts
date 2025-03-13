import { Injectable } from '@nestjs/common';
import { GameInterface } from 'src/modules/game/game.interface';
import { PlayerInterface } from 'src/modules/player/player.interface';
import { ScoreInterface } from 'src/modules/score/score.interface';
import { GameModel, GameStatus } from '../game.model';
import { GameEntity, GameRepository } from './game.entity';

@Injectable()
export class GameService extends GameInterface {
  static readonly MAX_PLAYERS = 5;
  static readonly MIN_PLAYERS = 2;

  constructor(
    private readonly playerService: PlayerInterface,
    private readonly scoreService: ScoreInterface,
  ) {
    super();
  }

  createGame(): GameModel {
    const gameEntity = new GameEntity();
    GameRepository.save(gameEntity);
    return this.mapToModel(gameEntity);
  }

  startGame(id: string): GameModel {
    const gameEntity = this.findGameById(id);

    if (gameEntity.status !== GameStatus.WAITING) {
      throw new Error('Cannot start game. Status must be "WAITING".');
    }

    if (gameEntity.playersRolls.length < GameService.MIN_PLAYERS) {
      throw new Error(
        `Cannot start the game. At least ${GameService.MIN_PLAYERS} players are required.`,
      );
    }

    gameEntity.status = GameStatus.IN_PROGRESS;
    GameRepository.save(gameEntity);

    return this.mapToModel(gameEntity);
  }

  getGame(id: string): GameModel {
    const gameEntity = this.findGameById(id);
    return this.mapToModel(gameEntity);
  }

  addPlayer(gameId: string, playerName: string): GameModel {
    const gameEntity = this.findGameById(gameId);

    this.validateGameForAddingPlayers(gameEntity);

    const playerEntity = this.playerService.createPlayer(playerName);
    gameEntity.playersRolls.push({
      playerId: playerEntity.id,
      rolls: [],
      frameScores: [],
    });

    if (gameEntity.playersRolls.length === GameService.MAX_PLAYERS) {
      gameEntity.status = GameStatus.IN_PROGRESS;
    }

    GameRepository.save(gameEntity);

    return this.mapToModel(gameEntity);
  }

  addRollScores(gameId: string, playerId: string, scores: string[]): GameModel {
    const gameEntity = this.findGameById(gameId);

    if (gameEntity.status !== GameStatus.IN_PROGRESS) {
      throw new Error('Cannot add scores. Game is not in progress.');
    }

    const playerRolls = this.findPlayerRolls(gameEntity, playerId);

    this.validateRolls(scores);

    playerRolls.rolls.push(scores);
    playerRolls.frameScores = this.scoreService.computeFrameScores(
      playerRolls.rolls,
    );

    GameRepository.save(gameEntity);

    return this.mapToModel(gameEntity);
  }

  private validateRolls(scores: string[]): void {
    if (!scores.every((roll) => /^[x/.\d]$/.test(roll))) {
      throw new Error(
        `Invalid rolls: [${scores.join(', ')}]. Rolls must be "x", "/", ".", or digits.`,
      );
    }
  }

  private findGameById(gameId: string): GameEntity {
    const gameEntity = GameRepository.findOne(gameId);
    if (!gameEntity) {
      throw new Error(`Game with ID "${gameId}" not found.`);
    }
    return gameEntity;
  }

  private validateGameForAddingPlayers(gameEntity: GameEntity): void {
    if (gameEntity.status !== GameStatus.WAITING) {
      throw new Error('Cannot add players. Game is already in progress.');
    }

    if (gameEntity.playersRolls.length >= GameService.MAX_PLAYERS) {
      throw new Error(
        `Cannot add more players. Maximum limit (${GameService.MAX_PLAYERS}) reached.`,
      );
    }
  }

  private findPlayerRolls(
    gameEntity: GameEntity,
    playerId: string,
  ): { playerId: string; rolls: string[][]; frameScores: number[] } {
    const playerRolls = gameEntity.playersRolls.find(
      (p) => p.playerId === playerId,
    );
    if (!playerRolls) {
      throw new Error(`Player with ID "${playerId}" not found in the game.`);
    }
    return playerRolls;
  }

  private mapToModel(gameEntity: GameEntity): GameModel {
    return {
      id: gameEntity.id,
      playersScores: gameEntity.playersRolls.map((frame) => ({
        playerId: frame.playerId,
        playerName: this.playerService.getPlayer(frame.playerId).name,
        rolls: frame.rolls,
        framesScore: frame.frameScores,
      })),
      currentFrame: gameEntity.currentFrame,
      status: gameEntity.status,
    };
  }
}
