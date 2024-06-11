import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { FideService } from './fide.service'; // Update path if needed
import { FidePlayerService } from '../db/fide-player.service'; // Update path if needed

describe.only('FideService', () => {
  let fideService: FideService;

  const mockFidePlayerService = {
    query: jest.fn(),
    upsertFidePlayer: jest.fn(),
    updateFidePlayer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule], // Use the real HttpModule
      providers: [
        FideService,
        { provide: FidePlayerService, useValue: mockFidePlayerService },
      ],
    }).compile();

    fideService = module.get<FideService>(FideService);
  });

  it('should fetch and extract user info from the live site', async () => {
    const result = await fideService.getFideRating('1503014');
    expect(result).toHaveProperty('name', 'Carlsen, Magnus');
    expect(result).toHaveProperty('federation');
    expect(result.id).toEqual('1503014');
  }, 10000);
});
