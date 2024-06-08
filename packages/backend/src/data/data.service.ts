import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDatumDto } from './dto/create-datum.dto';
import { UpdateDatumDto } from './dto/update-datum.dto';
import { TournamentRegister } from '../db/tournament';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LiveChessTournament } from 'library';

@Injectable()
export class DataService {
  constructor(
    @InjectModel(TournamentRegister.name)
    private tournamentRegisterModel: Model<TournamentRegister>,
  ) {}
  async create(createDatumDto: CreateDatumDto) {
    const findExist = this.tournamentRegisterModel.findOne({
      slug: createDatumDto.slug,
    });
    if (findExist != null) {
      throw new BadRequestException('An item with same slug already existing');
    }
    const livechess = new LiveChessTournament(createDatumDto.liveChessId);
    const tournament = await livechess.fetchTournament();
    createDatumDto.name = tournament.name;

    this.tournamentRegisterModel.create({ ...createDatumDto });
    return {
      ...createDatumDto,
    };
  }

  async findAll() {
    return (await this.tournamentRegisterModel.find()).map((x) => x.toObject());
  }

  async findOne(id: string) {
    return (await this.tournamentRegisterModel.findById(id)).toObject();
  }

  async update(id: string, updateDatumDto: UpdateDatumDto) {
    const livechess = new LiveChessTournament(updateDatumDto.liveChessId);
    const tournament = await livechess.fetchTournament();
    updateDatumDto.name = tournament.name;
    await this.tournamentRegisterModel.updateOne({ _id: id }, updateDatumDto);
    const exist = (await this.tournamentRegisterModel.findById(id)).toObject();
    return exist;
  }

  async remove(id: string) {
    await this.tournamentRegisterModel.deleteOne({ _id: id });
    return {
      succes: true,
    };
  }
}
