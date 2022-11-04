import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class TrackWorkRequest {
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty()
  date: Date;
}
