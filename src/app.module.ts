import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { TrackingModule } from './tracking/tracking.module';
import { NotionModule } from './notion/notion.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    HealthModule,
    TrackingModule,
    NotionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
