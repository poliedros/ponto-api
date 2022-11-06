import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';

describe('TrackingController', () => {
  let controller: TrackingController;
  const isUserWorkingMockFn = jest.fn();
  const upsertTrackingMockFn = jest.fn();

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

    const response = await controller.isUserWorking({
      user: {
        username: 'carlos',
        notionUserId: '1',
      },
    });

    expect(response.working).toBeTruthy();
  });

  it('should throw bad request if something occur', async () => {
    isUserWorkingMockFn.mockImplementation(() => {
      throw new Error();
    });

    const fn = async () => {
      await controller.isUserWorking({
        user: {
          username: 'carlos',
          notionUserId: '1',
        },
      });
    };

    try {
      await fn();
      expect(false).toBeTruthy();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });
});
