import { NotionService } from './../notion/notion.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TrackingService } from './tracking.service';

describe('TrackingService', () => {
  let service: TrackingService;
  const getLastPageFromUserMockFn = jest.fn();
  const createPageMockFn = jest.fn();
  const updateEndDateMockFn = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingService],
      providers: [
        {
          provide: NotionService,
          useValue: {
            getLastPageFromUser: getLastPageFromUserMockFn,
            createPage: createPageMockFn,
            updateEndDate: updateEndDateMockFn,
          },
        },
      ],
    }).compile();

    service = module.get<TrackingService>(TrackingService);
  });

  it('should return true if a notion user is working', async () => {
    const page = {
      properties: {
        'Date-Range': {
          date: {
            end: null,
          },
        },
      },
    };
    getLastPageFromUserMockFn.mockReturnValue(Promise.resolve(page));

    const isUserWorking = await service.isUserWorking('123');

    expect(isUserWorking).toBeTruthy();
  });

  it('should return false if a notion user isnt working', async () => {
    const page = {
      properties: {
        'Date-Range': {
          date: {
            end: new Date(),
          },
        },
      },
    };
    getLastPageFromUserMockFn.mockReturnValue(Promise.resolve(page));

    const isUserWorking = await service.isUserWorking('123');

    expect(isUserWorking).toBeFalsy();
  });

  it('should return false if there is no page', async () => {
    const page = null;
    getLastPageFromUserMockFn.mockReturnValue(Promise.resolve(page));

    const isUserWorking = await service.isUserWorking('123');

    expect(isUserWorking).toBeFalsy();
  });

  it('should create a page if user is not working', async () => {
    const page = {
      properties: {
        'Date-Range': {
          date: {
            end: new Date(),
          },
        },
      },
    };
    getLastPageFromUserMockFn.mockReturnValue(Promise.resolve(page));
    await service.upsertTracking('123', new Date());

    expect(createPageMockFn).toHaveBeenCalledTimes(1);
  });

  it('should update a page if user is working', async () => {
    const page = {
      properties: {
        'Date-Range': {
          date: {
            end: null,
          },
        },
      },
    };
    getLastPageFromUserMockFn.mockReturnValue(Promise.resolve(page));
    await service.upsertTracking('123', new Date());

    expect(updateEndDateMockFn).toHaveBeenCalledTimes(1);
  });
});
