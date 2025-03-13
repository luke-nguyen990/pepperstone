import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ResponseBase, ResponseCode } from 'src/common/base/response.base';
import { GameInterface } from './game.interface';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameInterface) {}

  @Get('/get-game/:id')
  async getGame(@Param('id') gameId: string): Promise<ResponseBase> {
    try {
      const result = this.gameService.getGame(gameId);
      return new ResponseBase(ResponseCode.SUCCESS, 'OK', result);
    } catch (e) {
      return new ResponseBase(ResponseCode.ERROR, e.message, null);
    }
  }

  @Post('/create-game')
  async createGame(): Promise<ResponseBase> {
    try {
      const result = this.gameService.createGame();
      return new ResponseBase(ResponseCode.SUCCESS, 'OK', result);
    } catch (e) {
      return new ResponseBase(ResponseCode.ERROR, e.message, null);
    }
  }

  @Post('/start-game/:id')
  async startGame(@Param('id') gameId: string): Promise<ResponseBase> {
    try {
      const result = this.gameService.startGame(gameId);
      return new ResponseBase(ResponseCode.SUCCESS, 'OK', result);
    } catch (e) {
      return new ResponseBase(ResponseCode.ERROR, e.message, null);
    }
  }

  @Post('/add-player/:id')
  async addPlayer(
    @Param('id') gameId: string,
    @Query('player_name') playerName: string,
  ): Promise<ResponseBase> {
    try {
      const result = this.gameService.addPlayer(gameId, playerName);
      return new ResponseBase(ResponseCode.SUCCESS, 'OK', result);
    } catch (e) {
      return new ResponseBase(ResponseCode.ERROR, e.message, null);
    }
  }

  @Post('/add-roll-scores/:id')
  async addRollScores(
    @Param('id') gameId: string,
    @Query('player_id') playerId: string,
    @Query('scores') scores: string[],
  ): Promise<ResponseBase> {
    try {
      const result = this.gameService.addRollScores(gameId, playerId, scores);
      return new ResponseBase(ResponseCode.SUCCESS, 'OK', result);
    } catch (e) {
      return new ResponseBase(ResponseCode.ERROR, e.message, null);
    }
  }
}
