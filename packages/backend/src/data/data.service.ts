import { Injectable } from '@nestjs/common';
import { CreateDatumDto } from './dto/create-datum.dto';
import { UpdateDatumDto } from './dto/update-datum.dto';
import { TournamentRegister } from '../db/tournament';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LiveChessTournament } from 'library';

@Injectable()
export class DataService {
  constructor(
    @InjectModel(TournamentRegister.name) private tournamentRegisterModel: Model<TournamentRegister>) { }
  async create(createDatumDto: CreateDatumDto) {
    const livechess = new LiveChessTournament(createDatumDto.liveChessId);
    var tournament = await livechess.fetchTournament();
    createDatumDto.name = tournament.name;

    this.tournamentRegisterModel.create({ ...createDatumDto })
    return {
      ...createDatumDto
    }
  }

  async findAll() {
    return (await this.tournamentRegisterModel.find()).map(x => x.toObject())
  }

  findOne(id: string) {
    return `This action returns a #${id} datum`;
  }

  async update(id: string, updateDatumDto: UpdateDatumDto) {

    const livechess = new LiveChessTournament(updateDatumDto.liveChessId);
    var tournament = await livechess.fetchTournament();
    updateDatumDto.name = tournament.name;
    await this.tournamentRegisterModel.updateOne({ _id: id }, updateDatumDto)
    const exist = (await this.tournamentRegisterModel.findById(id)).toObject();
    return exist;
  }

  remove(id: string) {
    return `This action removes a #${id} datum`;
  }
}
