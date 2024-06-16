import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FidePlayer, FidePlayerDocument } from './fide-player.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class FidePlayerService {
  private readonly logger = new Logger(FidePlayerService.name);
  constructor(
    @InjectModel(FidePlayer.name)
    private fidePlayerModel: Model<FidePlayerDocument>,
  ) {}

  async createFidePlayer(playerData: FidePlayer): Promise<FidePlayer> {
    const createdPlayer = new this.fidePlayerModel(playerData);
    return createdPlayer.save();
  }

  async query(filters: any): Promise<FidePlayerDocument[]> {
    return this.fidePlayerModel.find(filters).exec();
  }

  async findOne(id: string): Promise<FidePlayer> {
    return this.fidePlayerModel.findOne({ id }).exec();
  }

  async patchPlayerData(
    _id: string,
    playerData: Partial<FidePlayer>,
  ): Promise<FidePlayer> {
    return this.fidePlayerModel
      .findByIdAndUpdate(new ObjectId(_id), { $set: playerData }, { new: true })
      .exec();
  }

  async updateFidePlayer(
    id: string,
    playerData: Partial<FidePlayer>,
  ): Promise<FidePlayer> {
    return this.fidePlayerModel
      .findOneAndUpdate({ id }, playerData, { new: true })
      .exec();
  }

  async deleteFidePlayer(id: string): Promise<FidePlayer> {
    return this.fidePlayerModel.findOneAndDelete({ id }).exec();
  }

  async cleanupDuplicates() {
    this.logger.log('Starting cleanup of duplicate players.');

    try {
      // Aggregation pipeline to find duplicate names with errorCount > 1
      const duplicates = await this.fidePlayerModel.aggregate([
        {
          $match: { errorCount: { $gt: 1 } },
        },
        {
          $group: {
            _id: '$name',
            count: { $sum: 1 },
            ids: { $push: '$_id' },
          },
        },
        {
          $match: { count: { $gt: 1 } },
        },
      ]);

      this.logger.log(`Found ${duplicates.length} names with duplicates.`);

      // Process each group of duplicates
      for (const group of duplicates) {
        const idsToDelete = group.ids.slice(1); // Keep the first, delete the rest
        this.logger.log(
          `Deleting ${idsToDelete.length} duplicates for name ${group._id}.`,
        );

        await this.fidePlayerModel.deleteMany({ _id: { $in: idsToDelete } });
      }

      this.logger.log('Cleanup of duplicate players completed.');
    } catch (error) {
      this.logger.error('Error during cleanup of duplicates', error.stack);
    }
  }

  public async deleteSameName(name: string) {
    await this.fidePlayerModel.deleteMany({
      name,
      id: { $exists: false },
    });
  }
  public getSearchNameFilter(searchName: string): any {
    if (!searchName) return {};
    const filter: any = {};
    const nameParts = searchName.split(',').map((part) => part.trim());

    if (nameParts.length === 2) {
      const [lastname, firstname] = nameParts;

      // Search for 'lastname, firstname' or 'firstname lastname'
      filter.$or = [
        {
          firstname: new RegExp(`^${firstname}$`, 'i'),
          lastname: new RegExp(`^${lastname}$`, 'i'),
        },
        {
          firstname: new RegExp(`^${lastname}$`, 'i'),
          lastname: new RegExp(`^${firstname}$`, 'i'),
        },
        { name: new RegExp(`^${firstname} ${lastname}$`, 'i') },
        { name: new RegExp(`^${lastname}, ${firstname}$`, 'i') },
        { name: searchName },
        { inputName: searchName },
      ];
    } else {
      // Single part (either full name or part of it)
      const searchPattern = new RegExp(searchName, 'i');

      filter.$or = [
        { firstname: searchPattern },
        { lastname: searchPattern },
        { name: searchPattern },
      ];
    }
    return filter;
  }
  async searchByName(searchName: string): Promise<FidePlayerDocument> {
    // Execute the query
    return this.fidePlayerModel
      .findOne(this.getSearchNameFilter(searchName))
      .exec();
  }

  async findAll(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: 'asc' | 'desc',
    filter: Partial<FidePlayer>,
  ): Promise<{ data: FidePlayerDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    const total = await this.fidePlayerModel.countDocuments(filter).exec();
    const data = await this.fidePlayerModel
      .find(filter)
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .exec();

    return { data, total };
  }

  async upsertFidePlayer(playerData: Partial<FidePlayer>): Promise<FidePlayer> {
    const name = playerData.name;
    const existingPlayer = await this.searchByName(name);

    if (existingPlayer) {
      Object.assign(existingPlayer, playerData);
      return await existingPlayer.save();
    } else {
      // Create new player
      const createdPlayer = new this.fidePlayerModel(playerData);
      return await createdPlayer.save();
    }
  }
}
