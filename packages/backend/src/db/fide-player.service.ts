import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FidePlayer, FidePlayerDocument } from './fide-player.schema';

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

  async findAll(): Promise<FidePlayer[]> {
    return this.fidePlayerModel.find().exec();
  }

  async findOne(id: string): Promise<FidePlayer> {
    return this.fidePlayerModel.findOne({ id }).exec();
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

  async upsertFidePlayer(
    playerData: Partial<FidePlayer>,
    currentName?: string,
  ): Promise<FidePlayer> {
    const name = currentName || playerData.name;
    const existingPlayer = await this.fidePlayerModel.findOne({ name }).exec();

    if (existingPlayer) {
      // Update existing player
      return this.fidePlayerModel
        .findOneAndUpdate({ name }, playerData, { new: true, upsert: true })
        .exec();
    } else {
      // Create new player
      const createdPlayer = new this.fidePlayerModel(playerData);
      return createdPlayer.save();
    }
  }
}
