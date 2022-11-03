import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserRequest } from './dtos/create-user-request.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  async create(createUserDto: CreateUserRequest) {
    const { password } = createUserDto;

    createUserDto.password = await this.hashPassword(password);

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
