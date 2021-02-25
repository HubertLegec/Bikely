import { HttpCode } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BikeType } from './bike.type';
import { BikeRequest } from './bikeRequest.dto';
import { BikesController } from './bikes.controller';
import { BikesModule } from './bikes.module';
import { BikesService } from './bikes.service';

describe('BikesController', () => {
  let bikesController: BikesController;
  let bikesService: BikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BikesModule],
      controllers: [BikesController],
      providers: [BikesService],
    }).compile();

    bikesService = module.get<BikesService>(BikesService);
    bikesController = module.get<BikesController>(BikesController);
  });

  describe('addBike', () => {
    it('Should return bike id', () => {
      const result = Promise.resolve('testId');
      jest.spyOn(bikesService, 'create').mockImplementation(() => result);

      expect(bikesController.addBike(bikeRequestCorrect)).resolves.toEqual({ id: 'testId' });
    });
  });

  describe('addBike', () => {
    it('should return http code 400', () => {
      const result = Promise.resolve('testId');
      jest.spyOn(bikesService, 'create').mockImplementation(() => result);

      expect(bikesController.addBike(bikeRequestTooSmallFrameSize)).resolves.toEqual(HttpCode(400));
    });
  });

  const bikeRequestCorrect: BikeRequest = {
    type: BikeType.mtb,
    isElectric: false,
    frameSize: 20,
  };

  const bikeRequestTooSmallFrameSize = {
    type: BikeType.city,
    isElectric: false,
    frameSize: 2,
  };
});
