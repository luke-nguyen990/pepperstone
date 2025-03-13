import { GameModel } from './game.model';

export abstract class GameInterface {
  /**
   * Creates a new game.
   * @returns The created GameModel object.
   */
  abstract createGame(): GameModel;

  /**
   * Starts a game with the given ID.
   * @param gameId - The ID of the game to start.
   * @returns The updated GameModel object after starting the game.
   */
  abstract startGame(gameId: string): GameModel;

  /**
   * Retrieves a game by its ID.
   * @param gameId - The ID of the game to retrieve.
   * @returns A GameModel object representing the game.
   */
  abstract getGame(gameId: string): GameModel;

  /**
   * Adds a player to a game.
   * @param gameId - The ID of the game to add the player to.
   * @param playerName - The name of the player to add.
   * @returns The updated GameModel object after adding the player.
   */
  abstract addPlayer(gameId: string, playerName: string): GameModel;

  /**
   * Adds roll scores for a player in a specific game.
   * @param gameId - The ID of the game.
   * @param playerId - The ID of the player whose scores are being added.
   * @param scores - An array of scores to add for the player.
   * @returns The updated GameModel object after adding the scores.
   */
  abstract addRollScores(
    gameId: string,
    playerId: string,
    scores: string[],
  ): GameModel;
}
