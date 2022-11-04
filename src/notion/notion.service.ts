import { NOTION_CLIENT } from './constants';
import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { Client } from '@notionhq/client';

@Injectable()
export class NotionService {
  constructor(@Inject(NOTION_CLIENT) private notionClient: Client) {}

  getLastPageFromUser(user: any) {
    return false;
  }
}
