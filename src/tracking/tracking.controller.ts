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
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { TrackingService } from './tracking.service';
import { LastStartTimeRequest } from './dto/last-start-time-request-dto';

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
      const response = await this.trackingService.isUserWorking(
        user.notionUserId,
      );
      return {
        working: response,
      };
    } catch (err) {
      this.logger.error(err);
    }
    throw new BadRequestException();
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

    try {
      await this.trackingService.upsertTracking(user.notionUserId, date);
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException();
    }

    return true;
  }

  @ApiOperation({
    summary: 'Get last page start time from user',
    description: 'forbidden',
  })
  @ApiBody({ type: LastStartTimeRequest })
  @UseGuards(JwtAuthGuard)
  @Post(`/lasttime`)
  async lastStartTimeFromUser(@Request() req) {
    const user = req.user as UserJwt;

    this.logger.log(`User ${user.username} is getting their last start time`);

    try {
      const response = await this.trackingService.lastStartDateFromUser(
        user.notionUserId,
      );
      return { date: response };
    } catch (err) {
      this.logger.error(err);
    }
    throw new BadRequestException();
  }
}
