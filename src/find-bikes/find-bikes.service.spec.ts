import { Test, TestingModule } from '@nestjs/testing';
import { FindBikesService } from './find-bikes.service';

describe('FindBikesService', () => {
  let service: FindBikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindBikesService],
    }).compile();

    service = module.get<FindBikesService>(FindBikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
