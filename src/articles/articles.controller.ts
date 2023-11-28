import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ValidationPipe, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article-dto';
import { UpdateArticleDto } from './dto/update-article-dto';
import { UserAuthGuard } from 'src/guard/user.auth.guard';
import { UserId } from 'src/common/decorator/user.id.decorator';
import { ArticleInformationDto } from './dto/article-informaition-dto';
import { ArticleIdDto } from './dto/article-id-dto';
import { CreateCommentDto } from './dto/create-comment-dto';
import { CommentIdDto } from './dto/comment-id-dto';

@UseGuards(UserAuthGuard)
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @Get()
  async findArticleById(
    @Query(ValidationPipe) query: ArticleInformationDto,
    @UserId() userId: number
  ) {
      const { offset } = query;
      if(query.type){
        const articleTypeNumber = ArticleInformationDto.mapTypeToNumber(query.type);
        
        return await this.articleService.findAllArticle(articleTypeNumber, userId, +offset);
      }else if(query.search){
        return await this.articleService.findArticleByContext(query.search, userId, +offset);
      }

      throw new BadRequestException(['알 수 없는 에러입니다. 다시 시도하십시오.'])

    }

  @Get('/:id')
  async findOneArticleById(
    @Param('id', new ParseIntPipe()) articleId: number,
    @UserId() userId: number,
  ){
    return await this.articleService.findArticle(articleId, userId);
  }

  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @UserId() userId: number 
  ) {
    
    return await this.articleService.create(createArticleDto, userId);
  }

  @Patch()
  async update(
     @Body() updateArticleDto: UpdateArticleDto,
     @UserId() userId: number 
     ) {
    return await this.articleService.update(userId, updateArticleDto);
  }

  @Delete()
  remove(
    @Body() articleIdDto : ArticleIdDto,
    @UserId() userId: number 
  ) {
    return this.articleService.remove(articleIdDto.articleId, userId);
  }

  @Post('/like')
  async getHeart(
    @Body() articleIdDto : ArticleIdDto,
    @UserId() userId: number 

  ){
    return await this.articleService.plusLike(articleIdDto, userId);
  }

  @Delete('/like')
  async removeHeart(
    @Body() articleIdDto : ArticleIdDto,
    @UserId() userId: number 
  ){
    return await this.articleService.removeLike(articleIdDto, userId);
  }

  @Post('/clipping')
  async getclipping(
    @Body() articleIdDto : ArticleIdDto,
    @UserId() userId: number 

  ){
    return await this.articleService.plusClipping(articleIdDto, userId);
  }

  @Delete('/clipping')
  async removeClipping(
    @Body() articleIdDto : ArticleIdDto,
    @UserId() userId: number 
  ){
    return await this.articleService.removeClipping(articleIdDto, userId);
  }


  @Get('/comment/:articleId')
  async getComment(
    @Param('articleId', new ParseIntPipe()) articleId: number
  ){
    return await this.articleService.getComments(articleId);
  }

  @Post('/comment')
  async makeComment(
    @Body() commentDto: CreateCommentDto,
    @UserId() userId: number
  ){
    return await this.articleService.makeComment(commentDto, userId);
  }

  @Delete('/comment')
  async removeComment(
    @Body() commentIdDto: CommentIdDto,
    @UserId() userId: number
  ){
    return await this.articleService.deleteComment(commentIdDto.commentId , userId);
  }

}
