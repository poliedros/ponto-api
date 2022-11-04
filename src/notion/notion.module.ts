import { ConfigModule } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { NotionService } from './notion.service';
import { NOTION_CLIENT } from './constants';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class NotionModule {
  public static forRoot(): DynamicModule {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    return {
      module: NotionModule,
      providers: [
        {
          provide: NOTION_CLIENT,
          useValue: notion,
        },
        NotionService,
      ],
      exports: [NotionService],
    };
  }
}
