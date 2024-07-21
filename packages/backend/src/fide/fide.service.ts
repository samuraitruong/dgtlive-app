import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FidePlayerService } from '../db/fide-player.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import configuration from '../config/configuration';
import { FidePlayer } from '../db/fide-player.schema';
import { FideSearchPlayerResponse } from 'library';

@Injectable()
export class FideService {
  private readonly logger = new Logger(FideService.name);
  private cronLock = {
    cronFetch: false,
    cronPopulateRating: false,
  };

  constructor(
    private readonly httpService: HttpService,
    private fidePlayerService: FidePlayerService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async cronFetch() {
    if (!configuration().system.enabledSync) {
      return;
    }
    if (this.cronLock.cronFetch) {
      this.logger.warn(
        'cronFetch is already running. Skipping this execution.',
      );
      return;
    }

    this.cronLock.cronFetch = true;
    try {
      await this.fidePlayerService.cleanupDuplicates();
      const unfetchedPlayers = await this.fidePlayerService.query({
        id: { $exists: false },
        $or: [{ errorCount: { $lt: 10 } }, { errorCount: { $exists: false } }],
      });
      this.logger.log(`Total account without id : ${unfetchedPlayers?.length}`);

      for await (const player of unfetchedPlayers) {
        try {
          if (player.errorCount && player.errorCount > 10) {
            continue;
          }
          await this.searchUserFromFide(player.name);
        } catch (error) {
          this.logger.error(
            `Error fetching data for player ${player.name}`,
            error.stack,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error during cronFetch', error.stack);
    } finally {
      this.cronLock.cronFetch = false;
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async cronPopulateRating() {
    if (!configuration().system.enabledSync) {
      return;
    }
    if (this.cronLock.cronPopulateRating) {
      this.logger.warn(
        'cronPopulateRating is already running. Skipping this execution.',
      );
      return;
    }

    this.cronLock.cronPopulateRating = true;
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const unpopulateRatingPlayers = await this.fidePlayerService.query({
        id: { $exists: true },

        $or: [
          { ratings: { $exists: false } },
          { lastRatingUpdate: { $lt: oneDayAgo } },
          { lastRatingUpdate: { $exists: false } },
        ],
        errorCount: { $lt: 10 },
      });
      this.logger.log(
        `Populating rating for player count: ${unpopulateRatingPlayers?.length}`,
      );

      for await (const player of unpopulateRatingPlayers) {
        try {
          const extrasPlayerInfo = await this.getFideRating(player.id);
          if (extrasPlayerInfo) {
            Object.assign(player, extrasPlayerInfo);
            player.lastRatingUpdate = new Date();
            await player.save(); // Save the updated player
            this.logger.log(`Updated player ${player.id}`);
          } else {
            throw new Error('No FIDE user found for id ' + player.id);
          }
        } catch (error) {
          this.logger.error(
            `Error populating rating for player ${player.id} ${error.message}`,
            error.stack,
          );
          player.errorCount = player.errorCount || 0;
          player.errorCount++;
          player.save();
        }
      }
    } catch (error) {
      this.logger.error('Error during cronPopulateRating', error.stack);
    } finally {
      this.cronLock.cronPopulateRating = false;
    }
  }

  async syncFilePlayerRating(id: string) {
    const player = await this.fidePlayerService.findById(id);
    if (player && player.id) {
      const extrasPlayerInfo = await this.getFideRating(player.id);
      if (extrasPlayerInfo) {
        Object.assign(player, extrasPlayerInfo);
        player.lastRatingUpdate = new Date();
        await player.save(); // Save
      }
    }
    return player;
  }
  async getFideRating(id: string) {
    const url = `https://ratings.fide.com/profile/${id}`;
    this.logger.log(`Fetching FIDE rating from URL: ${url}`);

    try {
      const { data: html } = await firstValueFrom(this.httpService.get(url));
      if (html.includes('No record found please check ID number')) return null;
      const data = this.extractUserInfo(html);
      this.logger.log(`Fetched rating for player ${id} (${data.name})`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to fetch rating from URL: ${url}`, error.stack);
      throw error;
    }
  }

  async searchUserFromFide(name: string): Promise<FidePlayer> {
    const url = `https://app.fide.com/api/v1/client/search?query=${name}`;
    this.logger.log(`Fetching FIDE player ${name} data from URL: ${url}`);
    const existingPlayer = await this.fidePlayerService.searchByName(name);
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<FideSearchPlayerResponse>(url),
      );
      const user = data.players[0];
      if (user) {
        await this.fidePlayerService.upsertFidePlayer({
          ...(existingPlayer || {}),
          ...user,
        });
        this.logger.log(
          `Fetched and updated player ${user.id} from FIDE. search name =${name}`,
        );
        //  find the user with same name and remove
        //  await this.fidePlayerService.deleteSameName(name);

        return user as FidePlayer;
      }
    } catch (error) {
      this.logger.error(
        `Failed to fetch user data for ${name} from URL: ${url}`,
        error.stack,
      );
      if (existingPlayer) {
        existingPlayer.errorCount = existingPlayer.errorCount || 0;
        existingPlayer.errorCount++;
        await existingPlayer.save();
        this.logger.warn(
          `Incremented errorCount for player ${existingPlayer.name}`,
        );
      }
      return null;
    }
  }

  async searchUser(name: string): Promise<FidePlayer> {
    // this.logger.log(`Query user information ${name}`);
    try {
      const userFromDb = await this.fidePlayerService.searchByName(name);

      if (userFromDb) {
        // this.logger.log(`Found fetched user ${name} in database`);
        return userFromDb;
      }

      await this.fidePlayerService.upsertFidePlayer({
        inputName: name,
        name,
      });

      this.logger.log(`User ${name} not found in database, fetching from FIDE`);
      return await this.searchUserFromFide(name);
    } catch (error) {
      this.logger.error(`Error searching user ${name}`, error.stack);
      throw error;
    }
  }

  private extractUserInfo(html: string): Partial<FidePlayer> {
    const $ = cheerio.load(html);
    const [std, rapid, blitz] = $('.profile-top-rating-data')
      .toArray()
      .map((x) => $(x).text().trim());
    const ratingValue = (s: string) => {
      if (!s) return 'unrated';

      const v = s.split(' ').pop();
      if (v === 'rated') return 'unrated';
      return v;
    };
    const ratings = {
      std: ratingValue(std),
      rapid: ratingValue(rapid),
      blitz: ratingValue(blitz),
    };
    const [rank, federation, id, birthYear, gender, fideTitle] = $(
      '.profile-top-info__block__row__data',
    )
      .toArray()
      .map((t) => $(t).text().trim());

    return {
      name: $('.profile-top-title').text().trim(),
      rank,
      birthYear,
      federation,
      gender,
      id,
      fideTitle,
      ratings,
    };
  }

  async getRating(name: string): Promise<number> {
    try {
      const user = await this.searchUser(name);
      if (!user) {
        this.logger.warn(`User ${name} not found`);
        return null;
      }
      // Add logic to extract rating from user object or scrape it from the website
      return 2000; // Placeholder rating for demonstration
    } catch (error) {
      this.logger.error(`Error getting rating for user ${name}`, error.stack);
      return null;
    }
  }
}
