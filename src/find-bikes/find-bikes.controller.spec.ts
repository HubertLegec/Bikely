import { Test, TestingModule } from '@nestjs/testing';
import { FindBikesController } from './find-bikes.controller';

describe('FindBikesController', () => {
  let controller: FindBikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindBikesController],
    }).compile();

    controller = module.get<FindBikesController>(FindBikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
