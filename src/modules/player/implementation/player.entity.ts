export class PlayerEntity {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = `player-${PlayerRepository.storage.size + 1}`;
    this.name = name;
  }
}

export class PlayerRepository {
  static storage: Map<string, PlayerEntity> = new Map();

  static save(player: PlayerEntity): void {
    this.storage.set(player.id, player);
  }

  static findOne(id: string): PlayerEntity | undefined {
    return this.storage.get(id);
  }
}
