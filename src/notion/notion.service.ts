import { NOTION_CLIENT } from './constants';
import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

@Injectable()
export class NotionService {
  constructor(@Inject(NOTION_CLIENT) private notionClient: Client) {}

  async getLastPageFromUser(
    userId: string,
  ): Promise<PageObjectResponse | PartialPageObjectResponse> {
    const databaseId = 'c6afe6a8f4a54e90ab62258be283b366';

    const response = await this.notionClient.databases.query({
      database_id: databaseId,
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
}
