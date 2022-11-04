import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TrackingService } from './tracking.service';

@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
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
    return this.trackingService.isUserWorking(req.user);
  }
}
