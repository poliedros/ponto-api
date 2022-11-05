import { NotionService } from './../notion/notion.service';
import { Injectable, Logger } from '@nestjs/common';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(private readonly notionService: NotionService) {}

  async isUserWorking(notionUserId: string) {
    const lastPage = (await this.notionService.getLastPageFromUser(
      notionUserId,
    )) as PageObjectResponse;

    if (!lastPage) return false;

    const end = lastPage.properties['Date-Range']['date']['end'];

    if (!end) return true;
    return false;
  }

  async upsertTracking(notionUserId: string, date: Date) {
    const isUserWorking = await this.isUserWorking(notionUserId);
    this.logger.log(`is user ${notionUserId} working? ${isUserWorking})`);

    if (!isUserWorking) await this.notionService.createPage(notionUserId, date);
    else {
      await this.notionService.updateEndDate(notionUserId, date);
    }
  }
}
