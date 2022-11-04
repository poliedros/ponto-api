import { NotionService } from './../notion/notion.service';
import { Injectable, NotImplementedException, Logger } from '@nestjs/common';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(private readonly notionService: NotionService) {}

  async isUserWorking(notionUserId: string) {
    const lastPage = (await this.notionService.getLastPageFromUser(
      notionUserId,
    )) as PageObjectResponse;
    const end = lastPage.properties['Date-Range']['date']['end'];

    if (!end) return true;
    return false;
  }

  upsertTracking() {
    throw new NotImplementedException();
  }
}
