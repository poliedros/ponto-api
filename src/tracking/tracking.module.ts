import { NotionModule } from './../notion/notion.module';
import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';

@Module({
  imports: [NotionModule.forRoot()],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
