import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LastStartTimeRequest {
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty()
  date: Date;
}
