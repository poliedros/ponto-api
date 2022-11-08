import { Test, TestingModule } from '@nestjs/testing';
import { NotionService } from './notion.service';
import { NOTION_CLIENT } from './constants';

describe('NotionService', () => {
  let service: NotionService;
  const queryMockFn = jest.fn();
  const createPageMockFn = jest.fn();
  const updatePageMockFn = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotionService,
        {
          provide: NOTION_CLIENT,
          useValue: {
            databases: {
              query: queryMockFn,
            },
            pages: {
              create: createPageMockFn,
              update: updatePageMockFn,
            },
          },
        },
      ],
    }).compile();

    service = module.get<NotionService>(NotionService);
  });

  it('should get last page from user', async () => {
    const results = {
      results: [
        {
          _id: 1,
        },
      ],
    };
    queryMockFn.mockReturnValue(Promise.resolve(results));
    const page = await service.getLastPageFromUser('1231');

    expect(page).toEqual({ _id: 1 });
  });

  it('should get null if user doesnt have a last page', async () => {
    const results = {
      results: [],
    };
    queryMockFn.mockReturnValue(Promise.resolve(results));
    const page = await service.getLastPageFromUser('1231');

    expect(page).toBeNull();
  });

  it('should create a page for user', async () => {
    await service.createPage('12312', new Date());

    expect(createPageMockFn).toBeCalledTimes(1);
  });

  it('should update end date ', async () => {
    const page = {
      results: [
        {
          properties: {
            'Date-Range': {
              date: {
                end: null,
              },
            },
            'Worked-Minutes': {},
          },
        },
      ],
    };
    queryMockFn.mockReturnValue(Promise.resolve(page));

    await service.updateEndDate('12312', new Date());

    expect(updatePageMockFn).toBeCalledTimes(1);
  });
});
