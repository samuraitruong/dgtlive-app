import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { DataService } from './data.service';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { Ads } from 'library';
import { SponsorService } from 'src/db/sponsor.service';

@Controller('public')
export class PublicDataController {
  private readonly cacheDir = path.resolve(__dirname, '..', '__cache');
  constructor(
    private readonly dataService: DataService,
    private readonly sponsorService: SponsorService,
  ) {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir);
    }
  }

  @Get()
  async findAll() {
    const allData = await this.dataService.findAll();
    return allData
      .filter((x) => x.isActive)
      .map((x) => ({ name: x.name, slug: x.slug }));
  }

  @Get('/img')
  async getFile(@Query('url') url: string, @Res() res: Response) {
    try {
      const decodedUrl = decodeURIComponent(url);
      const fileName = this.getFileName(decodedUrl);
      const filePath = path.join(this.cacheDir, fileName);

      if (fs.existsSync(filePath)) {
        // Return the cached file if it exists
        return res.sendFile(filePath);
      }

      console.log('decodedUrl', decodedUrl);
      // Download the file from the external URL
      const response = await axios.get(decodedUrl, {
        responseType: 'arraybuffer',
      });

      // Save the file to the cache directory
      fs.writeFileSync(filePath, response.data);

      // Return the file to the client
      res.setHeader('Content-Type', response.headers['content-type']);
      res.sendFile(filePath);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'File could not be retrieved',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  private getFileName(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

  @Get('/ads/:tournamentName')
  async getAds(
    @Param('tournamentName') tournamentName: string,
    @Req() req: Request,
  ): Promise<Ads[]> {
    // Mock data based on the tournament name
    const proxyUrl = `${req.protocol}://${req.get('Host')}/api/public/img?url=`;
    // const ads: { [key: string]: Ads[] } = {
    //   bitw: [
    //     {
    //       name: 'Bendigo Bank',
    //       image:
    //         proxyUrl +
    //         'https://www.rbm.org.au/wp-content/uploads/2022/02/Bendigo-Bank-370x209.jpeg',
    //       url: 'https://www.bendigobank.com.au/',
    //     },
    //   ],
    // };

    const sponsors = await this.sponsorService.findAll({
      isActive: true,
      tournaments: { $in: [tournamentName] },
    });
    console.log('sponsors', sponsors);
    return sponsors.map(({ name, logoUrl, website }) => ({
      name,
      image: proxyUrl + logoUrl,
      url: website,
    }));
  }
}
