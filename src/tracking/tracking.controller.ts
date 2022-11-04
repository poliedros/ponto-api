import { UserJwt } from './../auth/jwt.strategy';
import { Controller, Post, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TrackingService } from './tracking.service';

@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  private readonly logger = new Logger(TrackingController.name);

  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  create() {
    // this.trackingService.upsertTracking();

    return { ok: 'ok' };
  }

  @ApiOperation({ summary: 'Create new user', description: 'forbidden' })
  @ApiBody({})
  @UseGuards(JwtAuthGuard)
  @Post(`/working`)
  async isUserWorking(@Request() req) {
    const user = req.user as UserJwt;

    this.logger.log(`User ${user.username} is checking if itself is working`);

    return this.trackingService.isUserWorking(user.notionUserId);
  }
}
