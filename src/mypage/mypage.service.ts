import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/Article';
import { User } from 'src/entities/User';
import { UserClipped } from 'src/entities/UserClipped';
import { UserLike } from 'src/entities/UserLike';
import { Repository } from 'typeorm';

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
      const articles = await this.articleRepo
        .createQueryBuilder('article')
        .select([
          'article.id as articleId',
          'article.title as title',
          'article.context_text as content',
          'article.date as writeDate',
          'article.like as likes',
          'article.clipped as clips',
        ])
        .where('article.writer_id = :userId', {userId})
        .getRawMany()

      return articles;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getLikes(userId){
    try{
      const articles = await this.LikeRepo
        .createQueryBuilder('user_like')
        .select([
          'article.id as articleId',
          'article.title as title',
          'article.context_text as content',
          'user.nick_name as nickName',
          'article.date as writeDate'
        ])
        .innerJoin('article', 'article', 'user_like.article_id = article.id')
        .innerJoin('user', 'user', 'user.id = article.writer_id')
        .where('user_like.user_id = :userId', {userId})
        .getRawMany()

      return articles;


    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getClipped(userId){
    try{
      const articles = await this.ClipRepo
        .createQueryBuilder('user_clipped')
        .select([
          'article.id as articleId',
          'article.title as title',
          'article.context_text as content',
          'user.nick_name as nickName',
          'article.date as writeDate'
        ])
        .innerJoin('article', 'article', 'user_clipped.article_id = article.id')
        .innerJoin('user', 'user', 'user.id = article.writer_id')
        .where('user_clipped.user_id = :userId', {userId})
        .getRawMany()
  
      return articles;

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
