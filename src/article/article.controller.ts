import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus, BadRequestException, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UserAuthGuard } from 'src/guard/user.auth.guard';
import { UserId } from 'src/common/decorator/user.id.decorator';
import { ArticleInformationDto } from './dto/article-informaition.dto';
import { ArticleIdDto } from './dto/article-id-dto';
import { SearchContextDto } from './dto/search-context-dto';

@UseGuards(UserAuthGuard)
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async SearchArticle(
    @Query() query: SearchContextDto,
  ){
      return await this.articleService.findArticleByContext(query);
  }

  @Get('/:id')
  async findOneArticleById(
    @Param('id', new ParseIntPipe()) articleId: number
  ){
    return await this.articleService.findOneArticle(articleId);
  }

  @Get()
  async findArticleById(
    @Query(ValidationPipe) query: ArticleInformationDto,
  ) {
      const articleTypeNumber = ArticleInformationDto.mapTypeToNumber(query.type);
      const { offset } = query;
      return await this.articleService.findAllArticle(articleTypeNumber, +offset);
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
}
