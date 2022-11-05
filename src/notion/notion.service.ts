import { NOTION_CLIENT } from './constants';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { toIsoString } from './helpers';

@Injectable()
export class NotionService {
  private readonly logger = new Logger(NotionService.name);

  private readonly databaseId = 'c6afe6a8f4a54e90ab62258be283b366';

  constructor(@Inject(NOTION_CLIENT) private notionClient: Client) {}

  async getLastPageFromUser(
    userId: string,
  ): Promise<PageObjectResponse | PartialPageObjectResponse> {
    this.logger.log(`Querying notion database with id ${userId}...`);

    const response = await this.notionClient.databases.query({
      database_id: this.databaseId,
      filter: {
        property: 'Person',
        people: {
          contains: userId,
        },
      },
      sorts: [
        {
          property: 'Date-Range',
          direction: 'descending',
        },
      ],
    });

    if (response.results.length > 0) return response.results[0];
    return null;
  }

  async createPage(notionUserId: string, date: Date) {
    await this.notionClient.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        'Date-Range': {
          date: {
            start: toIsoString(date),
            end: null,
            time_zone: null,
          },
        },
        Person: {
          people: [
            {
              object: 'user',
              id: notionUserId,
            },
          ],
        },
      },
    });
  }

  async updateEndDate(notionUserId: string, date: Date) {
    const page = (await this.getLastPageFromUser(
      notionUserId,
    )) as PageObjectResponse;
    page.properties['Date-Range']['date']['end'] = toIsoString(date);
    delete page.properties['Worked-Minutes'];

    await this.notionClient.pages.update({
      page_id: page.id,
      properties: page.properties,
    });
  }
}
