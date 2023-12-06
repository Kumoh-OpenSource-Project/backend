import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/Article';
import { User } from 'src/entities/User';
import { UserClipped } from 'src/entities/UserClipped';
import { UserLike } from 'src/entities/UserLike';
import { Repository } from 'typeorm';
import { getMineDto } from './dto/getMine.dto';

@Injectable()
export class MypageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    @InjectRepository(UserLike)
    private readonly LikeRepo: Repository<UserLike>,
    @InjectRepository(UserClipped)
    private readonly ClipRepo: Repository<UserClipped>
  ){}

  async getArticles(userId){
    try{
      const articles = await this.articleRepo.find({
        where: {writerId: userId},
        order: { id: 'DESC' },
      });

      return articles;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLikesOrClips(userId, type){
    try{
      let articles;
      if(type === 'likes'){
        articles = await this.LikeRepo.find({
        where: {userId: userId},
        order: { id: 'DESC' },
        relations: ['article', 'user', 'article.writer']
        });
      }
      else if(type === 'clipping'){
        articles = await this.ClipRepo.find({
          where: {userId: userId},
          order: { id: 'DESC' },
          relations: ['article', 'user', 'article.writer']
          });
      }

      const results = [];

      for (const article of articles) {
        let result = new getMineDto();
        result.articleId = article.article.id;
        result.category = article.article.categoryId;
        result.title = article.article.title;
        result.content = article.article.contextText;
        result.nickName = article.article.writer.nickName;
        result.writeDate = article.article.date;

        results.push(result);
      }
      results.sort((a, b) => b.articleId - a.articleId);
      return results;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}
