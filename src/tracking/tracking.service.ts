import { NotionService } from './../notion/notion.service';
import { Injectable, NotImplementedException, Logger } from '@nestjs/common';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(private readonly notionService: NotionService) {}

  async isUserWorking(user: any) {
    this.logger.log(user);
    const working = await this.notionService.getLastPageFromUser(user);
    return working;
  }

  upsertTracking() {
    throw new NotImplementedException();
  }
}
