import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { KakaoStrategy } from './kakao.straegy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers:[AuthController],
  providers: [KakaoStrategy],
})
export class AuthModule {}
