import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './auth.service';
import { Role } from '../enums/role.enum';

export interface UserJwt {
  id: string;
  username: string;
  roles: Role[];
  notionUserId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_JWT_KEY || 'secretKey',
    });
  }

  async validate(payload: Payload): Promise<UserJwt> {
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
      notionUserId: payload.notionUserId,
    };
  }
}
