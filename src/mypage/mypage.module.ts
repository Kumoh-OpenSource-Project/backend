import { Module } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { MypageController } from './mypage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Article } from 'src/entities/Article';
import { UserClipped } from 'src/entities/UserClipped';
import { UserLike } from 'src/entities/UserLike';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Article,
      UserClipped,
      UserLike,
    ]),
  ],
  controllers: [MypageController],
  providers: [MypageService],
})
export class MypageModule {}
