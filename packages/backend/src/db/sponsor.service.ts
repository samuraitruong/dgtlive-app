import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSponsorDto, UpdateSponsorDto } from './dto/sponsor.dto';
import { Sponsor, SponsorDocument } from './schema/sponsor.schema';

@Injectable()
export class SponsorService {
  constructor(
    @InjectModel(Sponsor.name) private sponsorModel: Model<SponsorDocument>,
  ) {}

  async create(createSponsorDto: CreateSponsorDto): Promise<Sponsor> {
    const newSponsor = new this.sponsorModel(createSponsorDto);
    return newSponsor.save();
  }

  async findAll(): Promise<Sponsor[]> {
    return this.sponsorModel.find().exec();
  }

  async findOne(id: string): Promise<Sponsor> {
    const sponsor = await this.sponsorModel.findById(id).exec();
    if (!sponsor) {
      throw new NotFoundException(`Sponsor with ID "${id}" not found`);
    }
    return sponsor;
  }

  async update(
    id: string,
    updateSponsorDto: UpdateSponsorDto,
  ): Promise<Sponsor> {
    const updatedSponsor = await this.sponsorModel
      .findByIdAndUpdate(id, updateSponsorDto, { new: true })
      .exec();
    if (!updatedSponsor) {
      throw new NotFoundException(`Sponsor with ID "${id}" not found`);
    }
    return updatedSponsor;
  }

  async remove(id: string): Promise<Sponsor> {
    const deletedSponsor = await this.sponsorModel.findByIdAndDelete(id).exec();
    if (!deletedSponsor) {
      throw new NotFoundException(`Sponsor with ID "${id}" not found`);
    }
    return deletedSponsor;
  }
}
