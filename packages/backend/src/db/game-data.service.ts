import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameData, GameDataDocument } from './game-data.schema';

@Injectable()
export class GameDataService {
  constructor(
    @InjectModel(GameData.name) private gameDataModel: Model<GameDataDocument>,
  ) {}

  async create(createGameDataDto: any): Promise<GameData> {
    const createdGameData = new this.gameDataModel(createGameDataDto);
    return createdGameData.save();
  }

  async upsert(createGameDataDto: any): Promise<GameData> {
    const { liveChessId, game, round } = createGameDataDto;

    console.log({ liveChessId, game, round });
    return this.gameDataModel
      .findOneAndReplace({ liveChessId, game, round }, createGameDataDto, {
        new: true,
        upsert: true,
        useFindAndModify: false,
      })
      .exec();
  }

  async findAll(): Promise<GameData[]> {
    return this.gameDataModel.find().exec();
  }

  async findById(id: string): Promise<GameData> {
    return this.gameDataModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<any> {
    return this.gameDataModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, updateGameDataDto: any): Promise<GameData> {
    return this.gameDataModel
      .findByIdAndUpdate(id, updateGameDataDto, { new: true })
      .exec();
  }
}
