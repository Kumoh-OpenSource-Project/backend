import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Article } from 'src/entities/Article';
import { Photo } from 'src/entities/Photo';
import { UserClipped } from 'src/entities/UserClipped';
import { UserLike } from 'src/entities/UserLike';
import { Comment } from 'src/entities/Comment';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Article,
      Photo,
      UserClipped,
      UserLike,
      Comment
    ]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticleModule {}
