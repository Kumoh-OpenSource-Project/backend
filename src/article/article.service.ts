import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Repository } from 'typeorm';
import { Article } from 'src/entities/Article';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchContextDto } from './dto/search-context-dto';

@Injectable()
export class ArticleService {

  private readonly PAGESIZE = 10;

  constructor( 
    @InjectRepository(Article)
    private articleRepo : Repository<Article>
  ){}
  
  async findAllArticle(type: number, offset: number){
    const articles = await this.articleRepo.find({
      where: { categoryId: type},
      order: { id: 'DESC'},
      take: this.PAGESIZE,
      skip: offset * this.PAGESIZE,
       });
    return articles;
  }

  async findOneArticle(articleId: number){
    const article = await this.articleRepo.findOne({
            where: { id: articleId},
    });
    if (!article) { throw new NotFoundException('해당하는 게시글이 없습니다.'); }

    return article;
  }


async findArticleByContext(dto: SearchContextDto) {
  const { search } = dto;

  const articles = await this.articleRepo.createQueryBuilder('article')
    .where('article.title LIKE :search', { search: `%${search}%` })
    .orWhere('article.contextText LIKE :search', { search: `%${search}%` })
    .orderBy('article.id', 'DESC')
    .getMany();

  return articles;
}

  async create(
    createArticleDto: CreateArticleDto,
    userId: number,
  ) {
    const newArticle = this.articleRepo.create({
      writerId: userId,
      categoryId: createArticleDto.articleCategory,
      title: createArticleDto.title,
      contextText: createArticleDto.contextText,
      like: 0,
      clipped: 0,
    });
    await this.articleRepo.save(newArticle);
    return '작성완료';  
}

  async update(
    userId: number,
    updateArticleDto: UpdateArticleDto, 
  ) {
      const { articleId, content } = updateArticleDto;
      const article = await this.findOneArticle(articleId);
      if(article.writerId !== userId){ throw new UnauthorizedException(['게시글을 수정할 권한이 없습니다.'])};
      article.contextText = content;
      await this.articleRepo.save(article);
      return [`${articleId}번 게시글 수정 완료`]
  }

  async remove(articleId: number, userId: number) {
    const article = await this.findOneArticle(articleId);
    if(article.writerId !== userId){ throw new UnauthorizedException(['게시글을 삭제할 권한이 없습니다.'])};
    await this.articleRepo.remove(article);
    return [`${articleId}번 게시글 삭제 완료`]
  }
}
