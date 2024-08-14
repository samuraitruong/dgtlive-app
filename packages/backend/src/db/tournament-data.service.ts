import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TournamentData,
  TournamentDataDocument,
} from './schema/tournament-data.schema';

@Injectable()
export class TournamentDataService {
  constructor(
    @InjectModel(TournamentData.name)
    private tournamentModel: Model<TournamentDataDocument>,
  ) {}

  async create(
    createTournamentDto: Partial<TournamentData>,
  ): Promise<TournamentData> {
    const createdTournament = new this.tournamentModel(createTournamentDto);
    return createdTournament.save();
  }

  async upsert(
    createTournamentDto: Partial<TournamentData>,
  ): Promise<TournamentData> {
    return this.tournamentModel
      .findOneAndUpdate(
        { liveChessId: createTournamentDto.liveChessId },
        { $set: createTournamentDto }, // Update fields
        { new: true, upsert: true, useFindAndModify: false },
      )
      .exec();
  }

  async findOneBy(filters: any): Promise<TournamentData> {
    return this.tournamentModel.findOne(filters).exec();
  }

  async findAll(): Promise<TournamentData[]> {
    return this.tournamentModel.find().exec();
  }

  async findById(id: string): Promise<TournamentData | null> {
    return this.tournamentModel.findById(id).exec();
  }

  async update(
    id: string,
    updateTournamentDto: Partial<TournamentData>,
  ): Promise<TournamentData | null> {
    return this.tournamentModel
      .findByIdAndUpdate(id, updateTournamentDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.tournamentModel.deleteOne({ _id: id }).exec();
  }
}
