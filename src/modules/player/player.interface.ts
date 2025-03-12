import { PlayerModel } from './player.model';

export abstract class PlayerInterface {
  /**
   * Creates a new player.
   * @param name - The name of the player.
   * @returns The created PlayerModel object.
   */
  abstract createPlayer(name: string): PlayerModel;

  /**
   * Retrieves a player by their ID.
   * @param id - The ID of the player.
   * @returns A PlayerModel object.
   */
  abstract getPlayer(id: string): PlayerModel;

  /**
   * Retrieves multiple players by their IDs.
   * @param ids - An array of player IDs.
   * @returns An array of PlayerModel objects.
   */
  abstract getPlayers(ids: string[]): PlayerModel[];
}
