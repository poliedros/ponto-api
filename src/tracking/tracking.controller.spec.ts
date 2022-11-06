import { TrackWorkRequest } from './dto/track-work-request.dto';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';

describe('TrackingController', () => {
  let controller: TrackingController;
  const isUserWorkingMockFn = jest.fn();
  const upsertTrackingMockFn = jest.fn();

  const userReq = {
    user: {
      username: 'carlos',
      notionUserId: '1',
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingController],
      providers: [
        {
          provide: TrackingService,
          useValue: {
            isUserWorking: isUserWorkingMockFn,
            upsertTracking: upsertTrackingMockFn,
          },
        },
      ],
    }).compile();

    controller = module.get<TrackingController>(TrackingController);
  });

  it('should check if user is working', async () => {
    isUserWorkingMockFn.mockReturnValue(Promise.resolve(true));

    const response = await controller.isUserWorking(userReq);

    expect(response.working).toBeTruthy();
  });

  it('should throw bad request in working if something occur', async () => {
    isUserWorkingMockFn.mockImplementation(() => {
      throw new Error();
    });

    const fn = async () => {
      await controller.isUserWorking(userReq);
    };

    try {
      await fn();
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should track new work date with valid data', async () => {
    upsertTrackingMockFn.mockReturnValue(Promise.resolve());

    const request: TrackWorkRequest = { date: new Date() };

    const response = await controller.track(userReq, request);

    expect(response).toBeTruthy();
  });

  it('should throw a badrequest in track if something occur', async () => {
    upsertTrackingMockFn.mockImplementation(() => {
      throw new Error();
    });

    try {
      const request: TrackWorkRequest = { date: new Date() };

      await controller.track(userReq, request);
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});
