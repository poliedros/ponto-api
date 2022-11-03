import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { Roles } from './../decorators/roles.decorator';
import { Role } from './../enums/role.enum';
import { RolesGuard } from './../guards/roles.guard';
import { CreateUserRequest } from './dtos/create-user-request.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create new user', description: 'forbidden' })
  @ApiBody({ type: CreateUserRequest })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.Admin)
  async create(@Body() createUserDto: CreateUserRequest) {
    await this.usersService.create(createUserDto);
    const { username, roles } = createUserDto;
    return { username, roles };
  }
}
