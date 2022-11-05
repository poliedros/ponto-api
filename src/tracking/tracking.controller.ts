import { TrackWorkRequest } from './dto/track-work-request.dto';
import { UserJwt } from './../auth/jwt.strategy';
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Logger,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TrackingService } from './tracking.service';

@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  private readonly logger = new Logger(TrackingController.name);

  constructor(private readonly trackingService: TrackingService) {}

  @ApiOperation({
    summary: 'Check if user is working',
    description: 'forbidden',
  })
  @ApiBody({})
  @UseGuards(JwtAuthGuard)
  @Post(`/working`)
  async isUserWorking(@Request() req) {
    const user = req.user as UserJwt;

    this.logger.log(`User ${user.username} is checking if itself is working`);

    try {
      const response = this.trackingService.isUserWorking(user.notionUserId);
      return response;
    } catch (err) {
      this.logger.error(err);
    }
    return new BadRequestException();
  }

  @ApiOperation({
    summary: 'Track work',
    description: 'forbidden',
  })
  @ApiBody({ type: TrackWorkRequest })
  @UseGuards(JwtAuthGuard)
  @Post(`/track`)
  async track(@Request() req, @Body() request: TrackWorkRequest) {
    const user = req.user as UserJwt;

    const date = new Date(request.date);
    this.logger.log(date.toString());

    try {
      await this.trackingService.upsertTracking(user.notionUserId, date);
    } catch (err) {
      this.logger.error(err);
      return new BadRequestException();
    }

    return true;
  }
}
